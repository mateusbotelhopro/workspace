import { Controller, Post, UseGuards } from '@nestjs/common';
import { ResponseSlaService } from './response-sla.service';
import { InternalSecretGuard } from '../../infra/auth/internal-secret.guard';

@Controller('response-sla')
@UseGuards(InternalSecretGuard)
export class ResponseSlaController {
  constructor(private readonly responseSlaService: ResponseSlaService) {}

  @Post('check')
  checkPendingResponses() {
    return this.responseSlaService.checkPendingResponses();
  }
}
