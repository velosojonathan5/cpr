import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CprService } from './cpr.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCprDto } from './dto/create-cpr.dto';

@ApiTags('CPR')
@Controller('cpr')
export class CprController {
  constructor(private readonly cprService: CprService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cprService.getById(id);
  }

  @Post()
  create(@Body() createCprDto: CreateCprDto): Promise<{ id: string }> {
    return this.cprService.create(createCprDto);
  }
}
