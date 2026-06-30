import { Body, Controller, Get, Post } from '@nestjs/common';
import { SdrService } from './sdr.service';

@Controller('sdrs')
export class SdrController {
  constructor(private readonly sdrService: SdrService) {}

  @Post()
  create(@Body() body: { nome: string; whatsapp: string }) {
    return this.sdrService.create(body);
  }

  @Get()
  findAll() {
    return this.sdrService.findAll();
  }
}
