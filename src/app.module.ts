import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnviromentsModule } from './enviroments/enviroments.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EnviromentsModule, 
    CommonModule,
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
    }),
    AuthModule
    ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
