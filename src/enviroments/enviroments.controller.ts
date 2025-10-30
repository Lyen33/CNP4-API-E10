import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Version,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnviromentsService } from './enviroments.service';
import { CreateEnviromentDto } from './dto/create-enviroment.dto';
import { UpdateEnviromentDto } from './dto/update-enviroment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SlugValidationPipe } from 'src/common/pipes/SlugValidationPipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enviroments')
export class EnviromentsController {
  constructor(private readonly enviromentsService: EnviromentsService) {}

  // ✅ Público: no requiere autenticación
  @Get(':env_name.json')
  @Version('1')
  async getMassConsumption(@Param('env_name', new SlugValidationPipe) envName: string) {
    return await this.enviromentsService.handleMassConsumption(envName);
  }

  // ✅ Requiere autenticación, cualquier rol
  @Get()
  @Version('1')
  async listAll(@Req() req: Request, @Query() paginationDto: PaginationDto) {
    const baseUrl = req.url.split('?')[0];
    return await this.enviromentsService.listAll(paginationDto, baseUrl);
  }

  // 🔒 Solo rol 'admin' puede crear
  @Post()
  @Version('1')
  @Roles('admin')
  async create(@Body() createEnviromentDto: CreateEnviromentDto) {
    return await this.enviromentsService.create(createEnviromentDto);
  }

  // ✅ Requiere autenticación, cualquier rol
  @Get(':env_name')
  @Version('1')
  async findOne(@Param('env_name', new SlugValidationPipe) envName: string) {
    return await this.enviromentsService.findOne(envName);
  }

  // 🔒 Solo rol 'admin' puede hacer total update
  @Put(':env_name')
  @Version('1')
  @Roles('admin')
  async totalUpdate(
    @Param('env_name', new SlugValidationPipe) envName: string,
    @Body() createEnviromentDto: CreateEnviromentDto,
  ) {
    return await this.enviromentsService.totalUpdate(envName, createEnviromentDto);
  }

  // 🔒 Solo rol 'admin' puede hacer partial update
  @Patch(':env_name')
  @Version('1')
  @Roles('admin')
  async partialUpdate(
    @Param('env_name', new SlugValidationPipe) envName: string,
    @Body() updateEnviromentDto: UpdateEnviromentDto,
  ) {
    return await this.enviromentsService.partialUpdate(envName, updateEnviromentDto);
  }

  // 🔒 Solo rol 'admin' puede eliminar
  @Delete(':env_name')
  @Version('1')
  @Roles('admin')
  async remove(@Param('env_name', new SlugValidationPipe) envName: string) {
    return await this.enviromentsService.remove(envName);
  }
}
