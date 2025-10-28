import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseAdapter } from 'src/common/interfaces/databaseAdapter.interface';
import { Enviroment } from 'src/common/entities/mongo/enviroment.entity';
import { Variable } from 'src/common/entities/mongo/variable.entity';

@Injectable()
export class MongoEnviromentService implements DatabaseAdapter<Enviroment> {
  constructor(
    @InjectModel(Enviroment.name) private enviromentmodel: Model<Enviroment>,
    @InjectModel(Variable.name) private variablemodel: Model<Variable>,
  ) {}

  async findAll(
    query: Record<string, any>,
    page: number,
    per_page: number,
    baseUrl: string,
  ) {
    const skip = (page - 1) * per_page;
    const rawResults = await this.enviromentmodel
      .find(query)
      .skip(skip)
      .limit(per_page)
      .exec();

    const results = rawResults.map((doc) => {
      const obj: any = doc.toObject();
      delete obj._id;
      delete obj.__v;
      return obj;
    });

    const total = await this.enviromentmodel.countDocuments(query);
    const totalPages = Math.ceil(total / per_page);

    return {
      count: total,
      total_pages: totalPages,
      page,
      per_page,
      next: page + 1 <= totalPages ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null,
      previous: page - 1 > 0 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null,
      results,
    };
  }

  async find(query: Record<string, any>) {
    const enviroment = await this.enviromentmodel.findOne(query).exec();
    if (!enviroment) {
      throw new NotFoundException(`Enviroment not found with query ${JSON.stringify(query)}`);
    }

    const obj: any = enviroment.toObject();
    delete obj._id;
    delete obj.__v;
    return obj as Enviroment;
  }

  async create(data: Partial<Enviroment>) {
    const newEnv = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const created = await this.enviromentmodel.create(newEnv);
      const obj: any = created.toObject();
      delete obj._id;
      delete obj.__v;
      return obj as Enviroment;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Enviroment already exists: ${JSON.stringify(error.keyValue)}`);
      }
      throw new InternalServerErrorException(`Can't create enviroment`);
    }
  }

  async update(query: Record<string, any>, data: Partial<Enviroment>) {
    const env = await this.find(query); // returns object without _id
    const fullDoc = await this.enviromentmodel.findOne(query).exec(); // get full doc with _id
    if (!fullDoc) {
      throw new NotFoundException(`Enviroment not found with query ${JSON.stringify(query)}`);
    }
    const updated = {
      ...fullDoc.toObject(),
      ...data,
      updated_at: new Date().toISOString(),
    };

    try {
      const result = await this.enviromentmodel.findByIdAndUpdate(fullDoc._id, updated, {
        new: true,
      });
      if (!result) {
        throw new NotFoundException(`Enviroment not found with query ${JSON.stringify(query)}`);
      }
      const obj: any = result.toObject();
      delete obj._id;
      delete obj.__v;
      return obj as Enviroment;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Duplicate enviroment: ${JSON.stringify(error.keyValue)}`);
      }
      throw new InternalServerErrorException('Failed to update enviroment');
    }
  }

  async delete(query: Record<string, any>) {
    const env = await this.enviromentmodel.findOne(query).exec();
    if (!env) {
      throw new NotFoundException(`Enviroment not found with query ${JSON.stringify(query)}`);
    }

    try {
      await this.variablemodel.deleteMany({ enviromentName: env.name });
      await this.enviromentmodel.findByIdAndDelete(env._id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete enviroment and its variables');
    }
  }
}
