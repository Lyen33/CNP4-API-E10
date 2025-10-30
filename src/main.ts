import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI, 
  });

  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }) 
  );

  await app.listen(port);
  console.log(`App corriendo en el puerto ${port}`)
}
bootstrap();
