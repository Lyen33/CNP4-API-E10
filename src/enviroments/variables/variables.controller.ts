import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Req, Query, Put } from '@nestjs/common';
import { VariablesService } from './variables.service';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SlugValidationPipe } from 'src/common/pipes/SlugValidationPipe';

@Controller('/enviroments/:env_name/variables')
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) {}

  @Get()
  @Version('1')
  async listAll(@Req() req: Request, @Query() paginationDto: PaginationDto, @Param('env_name', new SlugValidationPipe) envName: string ) {
    const url = req.url; // /v1/environments/{var_name}/variables?page=1&per_page=10
    const baseUrl = url.split('?')[0];
    //Listado de todas las variables de entorno
    return await this.variablesService.listAll(paginationDto, baseUrl, envName);
  }

  @Post()
  @Version('1')
  async create(@Body() createVariableDto: CreateVariableDto, @Param('env_name', new SlugValidationPipe) envName: string) {
    //Crear una nueva variable para un entorno
    return await this.variablesService.create(createVariableDto, envName);
  }

  @Get(':var_name')
  @Version('1')
  async findOne(@Param('var_name', new SlugValidationPipe) varName: string, @Param('env_name', new SlugValidationPipe) envName: string) {
    //Obtener los detalles de una variable de entorno
    return await this.variablesService.findOne(varName, envName);
  }

  @Put(':var_name')
  @Version('1')
  async totalUpdate(@Param('var_name', new SlugValidationPipe) varName: string, @Body()  createVariableDto: CreateVariableDto, @Param('env_name', new SlugValidationPipe) envName: string){
    //Actualizar un una variable existente (si no existe, crea una nueva y te devuelve el objeto entero)
    return await this.variablesService.totalUpdate(varName, createVariableDto, envName);
  }

  @Patch(':var_name')
  @Version('1')
  async partialUpdate(@Param('var_name', new SlugValidationPipe) varName: string, @Body() updateEnviromentDto: UpdateVariableDto, @Param('env_name', new SlugValidationPipe) envName: string) {
    //Actualizar parcialmente una variable de entorno
    return await this.variablesService.partialUpdate(varName, updateEnviromentDto, envName);
  }

  @Delete(':var_name')
  @Version('1')
  async remove(@Param('var_name', new SlugValidationPipe) varName: string, @Param('env_name', new SlugValidationPipe) envName: string) {
    //Eliminar una variable de entorno
    return await this.variablesService.remove(varName, envName);
  }
}
