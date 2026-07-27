import { Controller, Post, UseGuards } from '@nestjs/common';
import { UnipileService } from './unipile.service';
import { InternalSecretGuard } from '../../infra/auth/internal-secret.guard';

@Controller('unipile')
@UseGuards(InternalSecretGuard)
export class UnipileController {
  constructor(private readonly unipileService: UnipileService) {}

  @Post('sync')
  syncMessages() {
    return this.unipileService.syncMessages();
  }
}
