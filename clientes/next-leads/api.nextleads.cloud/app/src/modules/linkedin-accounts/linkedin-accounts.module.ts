import { Module } from '@nestjs/common';
import { LinkedinAccountsController } from './linkedin-accounts.controller';

@Module({
  controllers: [LinkedinAccountsController],
})
export class LinkedinAccountsModule {}
