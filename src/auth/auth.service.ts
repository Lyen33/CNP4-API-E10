// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Aquí deberiamos consultar la base de datos, pero que pereza xd
    const user = { username: 'admin', passwordHash: await bcrypt.hash('1234', 10), role:'admin' };

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (isMatch) {
      return { username: user.username, role: 'admin' };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign({ username: payload.username, role: payload.role }, { expiresIn: '15m' });
      return { accessToken };
    } catch (error) {
      console.error('❌ Error al verificar refresh token:', error.message);
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }


  async verify(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { valid: true, payload };
    } catch {
      return { valid: false };
    }
  }
}
