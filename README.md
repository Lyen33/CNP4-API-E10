# 🚀 API REST con NestJS + Docker (Práctica 3 - Computación en la Nube)

<p align="center"> <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS Logo" width="60" height="60"/> &nbsp;&nbsp;&nbsp;&nbsp; <img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" alt="Docker Logo" width="60" height="60"/> </p>

API REST construida con [NestJS](https://nestjs.com/) y respaldada por una base de datos MongoDB en contenedor gracias a [Docker](https://www.docker.com/). Este proyecto está listo para ejecutarse en modo de desarrollo con solo dos comandos.

---

## 🛠️ Requisitos

- [Node.js](https://nodejs.org/) instalado
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) instalados

---

## ⚙️ Ejecución en modo desarrollo

1. **Levanta el contenedor de MongoDB**:

   ```bash
   docker compose -f docker-compose.dev.yaml up -d

3. **Instalar dependencias de desarrollo**:

   ```bash
   npm i

2. **Ejecutar el proyecto en modo de desarrollo. Corre en localhost:3000 por defecto**:

   ```bash
   npm run start:dev

---

## 🚀 Despliegue con Docker Compose

Este proyecto está listo para ejecutarse en producción usando contenedores Docker. Solo necesitas seguir estos pasos:

1. **Renombrar el archivo de entorno: copia el archivo .env.template y renómbralo como .env. Luego configura las variables de entorno según tu entorno de ejecución**:

   ```bash
   cp .env.template .env

3. **Ejecutar Docker Compose: levanta la aplicación y la base de datos MongoDB en segundo plano**:

   ```bash
   docker compose up -d

2. **Acceder a la API: Una vez desplegado, la API estará disponible en http://localhost:3000 (o en la IP pública de tu máquina si estás en una VM o servidor).**:

- Swagger UI: http://localhost:3000/swagger-ui
- Endpoint de autenticación: POST http://localhost:3000/token