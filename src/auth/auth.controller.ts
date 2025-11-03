import { Controller, Post, Body, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('token')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Autenticar usuario y obtener accessToken + refreshToken' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: '1234' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Tokens generados correctamente' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async getToken(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) return { error: 'Invalid credentials' };
    return this.authService.login(user);
  }

  @Post('refresh')
  @Version('1')
  @ApiOperation({ summary: 'Obtener nuevo accessToken usando refreshToken' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Nuevo accessToken generado' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('verify')
  @Version('1')
  @ApiOperation({ summary: 'Verificar si un accessToken es válido' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
      required: ['accessToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Token válido con payload decodificado' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  async verifyToken(@Body() body: { accessToken: string }) {
    return this.authService.verify(body.accessToken);
  }
}
