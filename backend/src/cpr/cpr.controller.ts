import { Controller, Get, Param, Delete } from '@nestjs/common';
import { CprService } from './cpr.service';
import { ApiTags } from '@nestjs/swagger';
import { CprEntity } from '../entities/cpr/cpr.entity';

@ApiTags('CPR')
@Controller('cpr')
export class CprController {
  constructor(private readonly cprService: CprService<CprEntity>) {}

  @Get()
  findAll() {
    // return this.cprService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cprService.getById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCprDto: UpdateCprDto) {
  //   return this.cprService.update(+id, updateCprDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.cprService.remove(+id);
  }
}
