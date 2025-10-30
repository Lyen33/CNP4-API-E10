import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { IsSlug } from 'src/common/validators/is-slug.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariableDto {
  @ApiProperty({
    example: 'api_key',
    description: 'Nombre único de la variable. Debe ser un slug (sin espacios, solo letras, números y guiones).',
    minLength: 3,
  })
  @MinLength(3)
  @IsString()
  @IsSlug()
  name: string;

  @ApiProperty({
    example: '1234567890abcdef',
    description: 'Valor de la variable. Puede ser cualquier cadena.',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  value?: string;

  @ApiPropertyOptional({
    example: 'Clave de acceso para el servicio externo',
    description: 'Descripción opcional de la variable',
    minLength: 3,
    nullable: true,
  })
  @MinLength(3)
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la variable es sensible (por ejemplo, una contraseña o token)',
  })
  @IsBoolean()
  @IsOptional()
  is_sensitive: boolean;
}
