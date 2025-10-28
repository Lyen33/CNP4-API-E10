import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateEnviromentDto } from './dto/create-enviroment.dto';
import { UpdateEnviromentDto } from './dto/update-enviroment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import type { DatabaseAdapter } from 'src/common/interfaces/databaseAdapter.interface';
import { Enviroment } from 'src/common/entities/mongo/enviroment.entity';
import { normalizeStrings } from 'src/common/helpers/normalizeStrings.function';
import { Variable } from 'src/common/entities/mongo/variable.entity';

@Injectable()
export class EnviromentsService {
  constructor(
    @Inject('MongoEnviromentService') private readonly databaseEnv: DatabaseAdapter<Enviroment>,
    @Inject('MongoVariableService') private readonly databaseVar: DatabaseAdapter<Variable>
  ) {}

  async create(createEnviromentDto: CreateEnviromentDto) {
    const data = normalizeStrings(createEnviromentDto);
    return await this.databaseEnv.create({
      ...data,
      description: data.description ?? null,
    });
  }

  async listAll(paginationDto: PaginationDto, baseUrl: string) {
    const { page = 1, per_page = 10 } = paginationDto;
    return await this.databaseEnv.findAll({}, page, per_page, baseUrl);
  }

  async findOne(envName: string) {
    return await this.databaseEnv.find({ name: envName });
  }

  async totalUpdate(envName: string, createEnviromentDto: CreateEnviromentDto) {
    const data = normalizeStrings(createEnviromentDto);
    return await this.databaseEnv.update({ name: envName }, data);
  }

  async partialUpdate(envName: string, updateEnviromentDto: UpdateEnviromentDto) {
    if (Object.entries(updateEnviromentDto).length === 0) {
      throw new BadRequestException(`Cannot update enviroment if body request is empty`);
    }
    const data = normalizeStrings(updateEnviromentDto);
    return await this.databaseEnv.update({ name: envName }, data);
  }

  async remove(envName: string) {
    await this.databaseEnv.delete({ name: envName });
  }

  async handleMassConsumption(envName: string) {
    // Nos aseguramos que exista el enviroment
    const env = await this.databaseEnv.find({ name: envName });

    // Buscamos las variables del enviroment
    const { results: variables } = await this.databaseVar.findAll(
      { enviromentName: env.name },
      1, // page
      Number.MAX_SAFE_INTEGER, // per_page: get all
      '' // baseUrl not needed here
    );

    // construimos el mapa de pares de clave valor
    const output: Record<string, string> = {};
    for (const variable of variables) {
      output[variable.name] = variable.value;
    }

    return output;
  }
}
