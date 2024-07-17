import { PartialType } from '@nestjs/swagger';
import { CreateCprDto } from './create-cpr.dto';

export class UpdateCprDto extends PartialType(CreateCprDto) {}
