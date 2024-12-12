import { Controller } from '@nestjs/common';
import { CreditorService } from './creditor.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Credor')
@Controller('creditor')
export class CreditorController {
  constructor(private readonly creditorService: CreditorService) {}

  // @Post()
  // create(@Body() createCreditorDto: CreateCreditorDto) {
  //   return this.creditorService.create(createCreditorDto);
  // }

  // @Get()
  // findAll() {
  //   return this.creditorService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.creditorService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCreditorDto: UpdateCreditorDto,
  // ) {
  //   return this.creditorService.update(+id, updateCreditorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.creditorService.remove(+id);
  // }
}
