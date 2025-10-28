import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
import { Variable } from 'src/common/entities/mongo/variable.entity';
import type { DatabaseAdapter } from 'src/common/interfaces/databaseAdapter.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { normalizeStrings } from 'src/common/helpers/normalizeStrings.function';

@Injectable()
export class VariablesService {
  constructor(
    @Inject('MongoVariableService') private readonly database: DatabaseAdapter<Variable>
  ) {}

  async create(createVariableDto: CreateVariableDto, envName: string) {
    const data = normalizeStrings(createVariableDto);
    return await this.database.create({
      ...data,
      enviromentName: envName,
      description: data.description ?? null,
    });
  }

  async listAll(paginationDto: PaginationDto, baseUrl: string, envName: string) {
    const { page = 1, per_page = 10 } = paginationDto;
    return await this.database.findAll({ enviromentName: envName }, page, per_page, baseUrl);
  }

  async findOne(varName: string, envName: string) {
    return await this.database.find({ name: varName, enviromentName: envName });
  }

  async totalUpdate(varName: string, createVariableDto: CreateVariableDto, envName: string) {
    const data = normalizeStrings(createVariableDto);
    return await this.database.update({ name: varName, enviromentName: envName }, data);
  }

  async partialUpdate(varName: string, updateVariableDto: UpdateVariableDto, envName: string) {
    if (Object.entries(updateVariableDto).length === 0) {
      throw new BadRequestException(`Cannot update variable if body request is empty`);
    }
    const data = normalizeStrings(updateVariableDto);
    return await this.database.update({ name: varName, enviromentName: envName }, data);
  }

  async remove(varName: string, envName: string) {
    await this.database.delete({ name: varName, enviromentName: envName });
  }
}
