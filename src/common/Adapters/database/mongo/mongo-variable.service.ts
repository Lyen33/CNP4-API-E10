import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseAdapter } from 'src/common/interfaces/databaseAdapter.interface';
import { Variable } from 'src/common/entities/mongo/variable.entity';

@Injectable()
export class MongoVariableService implements DatabaseAdapter<Variable> {
  constructor(
    @InjectModel(Variable.name) private variablemodel: Model<Variable>,
  ) {}

  async findAll(
    query: Record<string, any>,
    page: number,
    per_page: number,
    baseUrl: string,
  ) {
    const skip = (page - 1) * per_page;
    const rawResults = await this.variablemodel.find(query).skip(skip).limit(per_page).exec();

    const results = rawResults.map((doc) => {
      const obj: any = doc.toObject();
      if ('_id' in obj) delete obj._id;
      if ('__v' in obj) delete obj.__v;
      return obj;
    });

    const total = await this.variablemodel.countDocuments(query);
    const totalPages = Math.ceil(total / per_page);

    return {
      count: total,
      total_pages: totalPages,
      page,
      per_page,
      next: page + 1 < totalPages ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null,
      previous: page - 1 > 0 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null,
      results,
    };
  }

  async find(query: Record<string, any>) {
    const variable = await this.variablemodel.findOne(query).exec();
    if (!variable) {
      throw new NotFoundException(`Variable not found with query ${JSON.stringify(query)}`);
    }

    const obj: any = variable.toObject();
    if ('_id' in obj) delete obj._id;
    if ('__v' in obj) delete obj.__v;
    return obj as Variable;
  }

  async create(data: Partial<Variable>) {
    const newVar = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const created = await this.variablemodel.create(newVar);
      const obj: any = created.toObject();
      if ('_id' in obj) delete obj._id;
      if ('__v' in obj) delete obj.__v;
      return obj as Variable;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Variable already exists: ${JSON.stringify(error.keyValue)}`);
      }
      throw new InternalServerErrorException(`Can't create variable`);
    }
  }

  async update(query: Record<string, any>, data: Partial<Variable>) {
    const variable = await this.variablemodel.findOne(query).exec();
    if (!variable) {
      throw new NotFoundException(`Variable not found with query ${JSON.stringify(query)}`);
    }

    const updated = {
      ...variable.toObject(),
      ...data,
      updated_at: new Date().toISOString(),
    };

    try {
      const result = await this.variablemodel.findByIdAndUpdate(variable._id, updated, {
        new: true,
      });

      const obj: any = result?.toObject();
      if (!obj) throw new InternalServerErrorException('Update failed unexpectedly');
      if ('_id' in obj) delete obj._id;
      if ('__v' in obj) delete obj.__v;
      return obj as Variable;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update variable');
    }
  }

  async delete(query: Record<string, any>) {
    const variable = await this.variablemodel.findOne(query).exec();
    if (!variable) {
      throw new NotFoundException(`Variable not found with query ${JSON.stringify(query)}`);
    }

    try {
      await this.variablemodel.findByIdAndDelete(variable._id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete variable');
    }
  }
}
