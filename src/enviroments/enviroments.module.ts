import { Module } from '@nestjs/common';
import { EnviromentsService } from './enviroments.service';
import { EnviromentsController } from './enviroments.controller';
import { VariablesModule } from './variables/variables.module';
import { CommonModule } from 'src/common/common.module';


@Module({
  controllers: [EnviromentsController],
  providers: [EnviromentsService],
  imports: [
    VariablesModule,
    CommonModule
    ],
})
export class EnviromentsModule {}
