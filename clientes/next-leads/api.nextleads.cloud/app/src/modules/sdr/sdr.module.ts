import { Module } from '@nestjs/common';
import { SdrController } from './sdr.controller';
import { SdrService } from './sdr.service';

@Module({
  controllers: [SdrController],
  providers: [SdrService],
  exports: [SdrService],
})
export class SdrModule {}
