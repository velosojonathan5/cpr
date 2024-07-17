import { PartialType } from '@nestjs/swagger';
import { CreateEmitterDto } from './create-emitter.dto';

export class UpdateEmitterDto extends PartialType(CreateEmitterDto) {}
