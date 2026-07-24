#!/usr/bin/env python3
"""
Deploy script — Next Leads
Syncs local src/ and prisma/ to the server, then rebuilds the API container.

Usage:
    python deploy.py              # sync all changed files + rebuild
    python deploy.py --full       # force sync all files regardless of changes
    python deploy.py --logs-only  # just tail production logs
    python deploy.py --no-build   # sync files without rebuilding container
"""

import argparse
import os
import sys
import time
from pathlib import Path

try:
    import paramiko
except ImportError:
    print("ERROR: paramiko not installed. Run: pip install paramiko")
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────
HOST = "72.60.243.27"
USER = "root"
PASSWORD = "@Nextleads124985"

LOCAL_APP = Path(__file__).parent / "app"
REMOTE_APP = "/root/app/app"

# Directories to sync (relative to app/)
SYNC_DIRS = ["src", "prisma"]

# Files to sync at root of app/
SYNC_ROOT_FILES = [
    "package.json",
    "tsconfig.json",
    "tsconfig.build.json",
    "nest-cli.json",
    "eslint.config.mjs",
]

SKIP_EXTENSIONS = {".js", ".d.ts", ".js.map"}
SKIP_DIRS = {"node_modules", "dist", ".git", "coverage"}

# ── Helpers ───────────────────────────────────────────────────────────────────

def connect():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASSWORD, timeout=15)
    return client


def run(client, cmd, stream=False):
    """Run a command on the server. If stream=True, print output line by line."""
    transport = client.get_transport()
    channel = transport.open_session()
    channel.set_combine_stderr(True)
    channel.exec_command(cmd)

    output = []
    while True:
        if channel.recv_ready():
            chunk = channel.recv(4096).decode("utf-8", errors="replace")
            for line in chunk.splitlines():
                if stream:
                    safe = line.encode('ascii', errors='replace').decode('ascii')
                    print(f"  {safe}")
                output.append(line)
        if channel.exit_status_ready() and not channel.recv_ready():
            break
        time.sleep(0.05)

    exit_code = channel.recv_exit_status()
    return exit_code, "\n".join(output)


def collect_local_files(force=False):
    """Return list of (local_path, remote_path) tuples to upload."""
    files = []

    for dir_name in SYNC_DIRS:
        local_dir = LOCAL_APP / dir_name
        if not local_dir.exists():
            continue
        for local_path in local_dir.rglob("*"):
            if local_path.is_dir():
                continue
            if any(part in SKIP_DIRS for part in local_path.parts):
                continue
            if local_path.suffix in SKIP_EXTENSIONS:
                continue
            rel = local_path.relative_to(LOCAL_APP)
            remote_path = f"{REMOTE_APP}/{rel.as_posix()}"
            files.append((local_path, remote_path))

    for fname in SYNC_ROOT_FILES:
        local_path = LOCAL_APP / fname
        if local_path.exists():
            files.append((local_path, f"{REMOTE_APP}/{fname}"))

    return files


def sync_files(sftp, files, force=False):
    """Upload files that differ from the remote version."""
    uploaded = 0
    skipped = 0

    for local_path, remote_path in files:
        # Ensure remote directory exists
        remote_dir = remote_path.rsplit("/", 1)[0]
        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            # mkdir -p equivalent
            parts = remote_dir.split("/")
            for i in range(2, len(parts) + 1):
                d = "/".join(parts[:i])
                try:
                    sftp.stat(d)
                except FileNotFoundError:
                    try:
                        sftp.mkdir(d)
                    except Exception:
                        pass

        # Compare modification times to skip unchanged files
        if not force:
            try:
                remote_stat = sftp.stat(remote_path)
                local_mtime = local_path.stat().st_mtime
                if local_mtime <= remote_stat.st_mtime:
                    skipped += 1
                    continue
            except FileNotFoundError:
                pass  # file doesn't exist remotely yet — upload it

        sftp.put(str(local_path), remote_path)
        rel = str(local_path.relative_to(LOCAL_APP))
        print(f"  >> {rel}")
        uploaded += 1

    return uploaded, skipped


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Deploy Next Leads to production")
    parser.add_argument("--full", action="store_true", help="Force upload all files")
    parser.add_argument("--logs-only", action="store_true", help="Just tail container logs")
    parser.add_argument("--no-build", action="store_true", help="Sync files without rebuilding")
    args = parser.parse_args()

    print(f"Connecting to {USER}@{HOST}...")
    client = connect()
    print("Connected.\n")

    if args.logs_only:
        print("=== Logs: nextleads_api ===")
        run(client, "docker logs --tail 50 -f nextleads_api", stream=True)
        client.close()
        return

    # 1. Sync files
    print("Syncing files...")
    sftp = client.open_sftp()
    files = collect_local_files()
    uploaded, skipped = sync_files(sftp, files, force=args.full)
    sftp.close()

    if uploaded == 0:
        print(f"  No changes detected ({skipped} files already up to date).")
    else:
        print(f"\n  {uploaded} file(s) uploaded, {skipped} unchanged.\n")

    if args.no_build:
        print("Skipping rebuild (--no-build).")
        client.close()
        return

    if uploaded == 0 and not args.full:
        print("Nothing to rebuild.")
        client.close()
        return

    # 2. Rebuild container
    print("Rebuilding API container (this takes ~1-2 min)...")
    exit_code, _ = run(
        client,
        "cd /root && docker compose up -d --build api 2>&1",
        stream=True,
    )

    if exit_code != 0:
        print(f"\nERROR: docker compose exited with code {exit_code}")
        client.close()
        sys.exit(1)

    # 3. Wait for container to be healthy, then show recent logs
    print("\nWaiting for container to start...")
    time.sleep(5)

    print("\n=== Last 30 log lines ===")
    run(client, "docker logs --tail 30 nextleads_api 2>&1", stream=True)

    client.close()
    print("\nDeploy complete.")


if __name__ == "__main__":
    main()
