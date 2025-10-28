import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Enviroment, EnviromentSchema } from './entities/mongo/enviroment.entity';
import { Variable, VariableSchema } from './entities/mongo/variable.entity';
import { MongoEnviromentService } from './Adapters/database/mongo/mongo-enviroment.service';
import { MongoVariableService } from './Adapters/database/mongo/mongo-variable.service';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest-CNP3' as string, { //TODO: CONFIGURAR VARIABLES DE ENTORNO
            dbName: 'nest-CNP3'
        }),
        MongooseModule.forFeature([{ name: Enviroment.name, schema: EnviromentSchema }]),
        MongooseModule.forFeature([{ name: Variable.name, schema: VariableSchema }]),
    ],
    providers: [
        { provide: 'MongoEnviromentService', useClass: MongoEnviromentService },
        { provide: 'MongoVariableService', useClass: MongoVariableService },
    ],
    exports: [
        'MongoEnviromentService', 
        'MongoVariableService' 
    ]
})
export class CommonModule {}
