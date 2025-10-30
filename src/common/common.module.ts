import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Enviroment, EnviromentSchema } from './entities/mongo/enviroment.entity';
import { Variable, VariableSchema } from './entities/mongo/variable.entity';
import { MongoEnviromentService } from './Adapters/database/mongo/mongo-enviroment.service';
import { MongoVariableService } from './Adapters/database/mongo/mongo-variable.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: config.get<string>('MONGO_DB_NAME'),
        retryAttempts: 10,
        retryDelay: 5000
      }),
    }),
    MongooseModule.forFeature([{ name: Enviroment.name, schema: EnviromentSchema }]),
    MongooseModule.forFeature([{ name: Variable.name, schema: VariableSchema }]),
  ],
  providers: [
    { provide: 'MongoEnviromentService', useClass: MongoEnviromentService },
    { provide: 'MongoVariableService', useClass: MongoVariableService },
  ],
  exports: ['MongoEnviromentService', 'MongoVariableService'],
})
export class CommonModule {}
