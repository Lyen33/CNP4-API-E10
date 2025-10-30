// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('token')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async getToken(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) return { error: 'Invalid credentials' };
    return this.authService.login(user);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('verify')
  async verifyToken(@Body() body: { accessToken: string }) {
    return this.authService.verify(body.accessToken);
  }
}
