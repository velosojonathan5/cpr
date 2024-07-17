import { Controller, Post, Body } from '@nestjs/common';
import { CprPhysicService } from './cpr-physic.service';
import { CreateCprPhysicDto } from './dto/create-cpr-physic.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CPR Física')
@Controller('cpr/cpr-physic')
export class CprPhysicController {
  constructor(private readonly cprPhysicService: CprPhysicService) {}

  @Post()
  create(@Body() createCprPhysicDto: CreateCprPhysicDto) {
    return this.cprPhysicService.create(createCprPhysicDto);
  }
}
