import { IsOptional, IsString, MinLength } from 'class-validator';
import { IsSlug } from 'src/common/validators/is-slug.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnviromentDto {
  @ApiProperty({
    example: 'produccion',
    description: 'Nombre único del entorno. Debe ser un slug (sin espacios, solo letras, números y guiones).',
    minLength: 3,
  })
  @MinLength(3)
  @IsString()
  @IsSlug()
  name: string;

  @ApiPropertyOptional({
    example: 'Entorno principal para despliegue en producción',
    description: 'Descripción opcional del entorno',
    minLength: 3,
    nullable: true,
  })
  @MinLength(3)
  @IsString()
  @IsOptional()
  description?: string | null;
}
