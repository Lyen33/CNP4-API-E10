import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, Version, Req } from '@nestjs/common';
import { EnviromentsService } from './enviroments.service';
import { CreateEnviromentDto } from './dto/create-enviroment.dto';
import { UpdateEnviromentDto } from './dto/update-enviroment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SlugValidationPipe } from 'src/common/pipes/SlugValidationPipe';

@Controller('enviroments')
export class EnviromentsController {
  constructor(private readonly enviromentsService: EnviromentsService) {}

  @Get(':env_name.json')
  @Version('1')
  async getMassConsumption(@Param('env_name', new SlugValidationPipe) envName: string){
    // Regresar .json con todas las variables de un enviroment listas para cargarse
    return await this.enviromentsService.handleMassConsumption(envName);
  }

  @Get()
  @Version('1')
  async listAll(@Req() req: Request, @Query() paginationDto: PaginationDto) {
    const url = req.url; // /v1/environments?page=1&per_page=10
    const baseUrl = url.split('?')[0];
    //Listado de todos los entornos
    return await this.enviromentsService.listAll(paginationDto, baseUrl);
  }

  @Post()
  @Version('1')
  async create(@Body() createEnviromentDto: CreateEnviromentDto) {
    //Crear un nuevo entorno
    return await this.enviromentsService.create(createEnviromentDto);
  }

  @Get(':env_name')
  @Version('1')
  async findOne(@Param('env_name', new SlugValidationPipe) envName: string) {
    //Obtener los detalles de un entorno
    return await this.enviromentsService.findOne(envName);
  }

  @Put(':env_name')
  @Version('1')
  async totalUpdate(@Param('env_name', new SlugValidationPipe) envName: string, @Body()  createEnviromentDto: CreateEnviromentDto){
    //Actualizar un entorno existente (si no existe, crea uno nuevo y te devuelve el objeto entero)
    return await this.enviromentsService.totalUpdate(envName, createEnviromentDto);
  }

  @Patch(':env_name')
  @Version('1')
  async partialUpdate(@Param('env_name', new SlugValidationPipe) envName: string, @Body() updateEnviromentDto: UpdateEnviromentDto) {
    //Actualizar parcialmente un entorno
    return await this.enviromentsService.partialUpdate(envName, updateEnviromentDto);
  }

  @Delete(':env_name')
  @Version('1')
  async remove(@Param('env_name', new SlugValidationPipe) envName: string) {
    //Eliminar un enviroment y sus variables hijas
    return await this.enviromentsService.remove(envName);
  }
}
