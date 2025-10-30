import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  //carga de variable de entorno para el puerto de ejecucion
  const config_env = app.get(ConfigService);
  const port = config_env.get<number>('PORT') || 3000;
  
  //configuracion de swagger
  const config_swag = new DocumentBuilder()
    .setTitle('CNP3 RESTful API')
    .setDescription('Documentación de la API para entornos y variables')
    .setVersion('1.0')
    .addBearerAuth() // Para autenticación JWT
    .build();

  const document = SwaggerModule.createDocument(app, config_swag);

  // Endpoint /schema/
  app.use('/schema', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  // Endpoint /swagger-ui/
  SwaggerModule.setup('/swagger-ui', app, document);

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
