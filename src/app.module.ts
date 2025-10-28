import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnviromentsModule } from './enviroments/enviroments.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [EnviromentsModule, CommonModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
