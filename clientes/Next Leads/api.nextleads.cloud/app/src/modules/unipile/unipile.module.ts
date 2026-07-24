import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UnipileController } from './unipile.controller';
import { UnipileService } from './unipile.service';
import { UnipileCron } from './unipile.cron';

@Module({
  imports: [BullModule.registerQueue({ name: 'messages' })],
  controllers: [UnipileController],
  providers: [UnipileService, UnipileCron],
})
export class UnipileModule {}
