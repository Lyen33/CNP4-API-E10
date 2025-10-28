import { PartialType } from '@nestjs/mapped-types';
import { CreateEnviromentDto } from './create-enviroment.dto';

export class UpdateEnviromentDto extends PartialType(CreateEnviromentDto) {

    

}
