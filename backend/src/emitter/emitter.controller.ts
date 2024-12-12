import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { EmitterService } from './emitter.service';
import { CreateEmitterDto } from './dto/create-emitter.dto';
import { UpdateEmitterDto } from './dto/update-emitter.dto';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TypeOfPossessionEnum } from '../entities/person/farm.entity';

class CreateAddressDto {
  @ApiProperty()
  postalCode: string;
}

class SiteRegistryDto {
  @ApiProperty()
  registryNumber: string;

  @ApiProperty()
  registryBook: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  registryOfficeName: string;

  @ApiProperty()
  registryOfficeCity: string;

  @ApiProperty()
  registryOfficeState: string;

  @ApiProperty({ enum: TypeOfPossessionEnum })
  typeOfPossession: TypeOfPossessionEnum;
}

class DevelopmentSiteDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: CreateAddressDto;

  @ApiProperty()
  siteRegistry: SiteRegistryDto;
}

class FarmDto extends DevelopmentSiteDto {
  @ApiProperty()
  totalArea: number;

  @ApiProperty()
  cultivatedArea: number;
}

class EmitterDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  RG: string;

  @ApiProperty()
  RGEmitedBy: string;

  @ApiProperty()
  RGEmitedDate: string;

  @ApiProperty()
  maritalStatus: string;

  @ApiProperty({ required: false })
  matrimonialRegime?: string;

  @ApiProperty({ required: false })
  spouse?: EmitterDto;

  @ApiProperty()
  phone: string;

  @ApiProperty({ type: [FarmDto] })
  developmentSites: FarmDto[];
}

@ApiTags('Emitente')
@Controller('emitter')
export class EmitterController {
  constructor(private readonly emitterService: EmitterService) {}

  @Post()
  create(@Body() createEmitterDto: CreateEmitterDto) {
    return createEmitterDto;
    // return this.emitterService.create(createEmitterDto);
  }

  @Get()
  @ApiResponse({
    type: [EmitterDto],
  })
  findAll(): EmitterDto[] {
    // return this.emitterService.findAll() as unknown as EmitterDto[];
    return [];
  }

  @Get(':id')
  @ApiResponse({
    type: EmitterDto,
  })
  findOne(@Param('id') id: string): EmitterDto {
    return this.emitterService.getById(id) as unknown as EmitterDto;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmitterDto: UpdateEmitterDto) {
    return updateEmitterDto;
    // return this.emitterService.update(+id, updateEmitterDto);
  }
}
