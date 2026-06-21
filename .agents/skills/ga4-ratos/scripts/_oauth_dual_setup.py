#!/usr/bin/env python3
"""
Script temporario: refaz o OAuth do google-ads-ratos incluindo o scope do
Analytics (analytics.readonly), pra reusar o mesmo refresh_token nas duas skills.
Roda uma vez e pode ser apagado depois.
"""

import hashlib
import os
import re
import socket
import sys
import webbrowser
from urllib.parse import unquote

GADS_ENV_PATH = os.path.expanduser("~/.claude/skills/google-ads-ratos/.env")
SCOPES = [
    "https://www.googleapis.com/auth/adwords",
    "https://www.googleapis.com/auth/analytics.readonly",
]
SERVER = "127.0.0.1"


def load_env_file(path):
    env = {}
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("export "):
                line = line[7:]
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def find_free_port(start=8080, end=8090):
    for port in range(start, end + 1):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.bind((SERVER, port))
            s.close()
            return port
        except OSError:
            continue
    return None


def main():
    from google_auth_oauthlib.flow import Flow

    env = load_env_file(GADS_ENV_PATH)
    client_id = env.get("GOOGLE_ADS_CLIENT_ID", "").strip()
    client_secret = env.get("GOOGLE_ADS_CLIENT_SECRET", "").strip()

    if not client_id or not client_secret:
        print("ERRO: GOOGLE_ADS_CLIENT_ID/SECRET nao encontrados em", GADS_ENV_PATH)
        sys.exit(1)

    port = find_free_port()
    if not port:
        print("ERRO: nenhuma porta livre entre 8080-8090.")
        sys.exit(1)

    redirect_uri = f"http://{SERVER}:{port}"

    client_config = {
        "installed": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }

    flow = Flow.from_client_config(client_config, scopes=SCOPES)
    flow.redirect_uri = redirect_uri

    passthrough_val = hashlib.sha256(os.urandom(1024)).hexdigest()
    authorization_url, _ = flow.authorization_url(
        access_type="offline",
        state=passthrough_val,
        prompt="consent",
        include_granted_scopes="true",
    )

    print()
    print("=" * 60)
    print("  AUTORIZACAO GOOGLE ADS + ANALYTICS")
    print("=" * 60)
    print()
    print("Abre esta URL no browser (ou ela vai abrir sozinha):")
    print()
    print(f"  {authorization_url}")
    print()
    print(f"Aguardando callback em {redirect_uri} ...")
    print()

    webbrowser.open(authorization_url)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((SERVER, port))
    sock.listen(1)

    try:
        connection, _ = sock.accept()
        data = connection.recv(4096).decode("utf-8")
    except KeyboardInterrupt:
        print("\nCancelado pelo usuario.")
        sock.close()
        sys.exit(1)

    match = re.search(r"GET\s\/\?(.*?)\s", data)
    if not match:
        print("ERRO: callback invalido recebido do Google.")
        connection.close()
        sock.close()
        sys.exit(1)

    params = {}
    for pair in match.group(1).split("&"):
        if "=" in pair:
            k, v = pair.split("=", 1)
            params[k] = unquote(v)

    if "error" in params:
        print(f"ERRO do Google: {params['error']}")
        connection.close()
        sock.close()
        sys.exit(1)

    code = params.get("code", "")
    if not code:
        print("ERRO: nenhum authorization code recebido.")
        connection.close()
        sock.close()
        sys.exit(1)

    html = (
        "<html><head><meta charset='utf-8'></head><body style='font-family:sans-serif;"
        "display:flex;align-items:center;justify-content:center;height:100vh;background:#FAF7F2;'>"
        "<div style='text-align:center;'>"
        "<h1 style='color:#4CAF50;'>Pronto!</h1>"
        "<p style='color:#57534E;font-size:1.2rem;'>Autorizado com sucesso (Ads + Analytics). Pode fechar esta aba.</p>"
        "</div></body></html>"
    )
    response = f"HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n\r\n{html}"
    connection.sendall(response.encode())
    connection.close()
    sock.close()

    flow.fetch_token(code=code)
    refresh_token = flow.credentials.refresh_token

    if not refresh_token:
        print("ERRO: Google nao retornou refresh token.")
        print("  Revogue o app em https://myaccount.google.com/permissions e tente de novo.")
        sys.exit(1)

    # Salva no .env do google-ads-ratos (substitui GOOGLE_ADS_REFRESH_TOKEN)
    with open(GADS_ENV_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    if "GOOGLE_ADS_REFRESH_TOKEN=" in content:
        content = re.sub(
            r"GOOGLE_ADS_REFRESH_TOKEN=.*",
            f'GOOGLE_ADS_REFRESH_TOKEN="{refresh_token}"',
            content,
        )
    else:
        content = content.rstrip("\n") + f'\nGOOGLE_ADS_REFRESH_TOKEN="{refresh_token}"\n'

    with open(GADS_ENV_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Novo refresh token salvo em {GADS_ENV_PATH}")
    print("Token agora cobre: Google Ads + Analytics readonly")


if __name__ == "__main__":
    main()
