import { PartialType } from '@nestjs/swagger';
import { CreateCprPhysicDto } from './create-cpr-physic.dto';

export class UpdateCprPhysicDto extends PartialType(CreateCprPhysicDto) {}
