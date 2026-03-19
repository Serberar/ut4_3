# Ejercicios 3 y 4 - Realizados a partir de una prueba técnica real de 2024

API REST desarrollada con NestJS para la gestión de un taller de vehículos.
Permite gestionar clientes, presupuestos, trabajos y secciones.

## Tecnologías

- NestJS
- TypeORM
- MySQL
- Docker
- Swagger (OpenAPI)

## Instalación

```bash
npm install
```

Requiere un archivo `.env` en la raíz con las siguientes variables:

```
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3308
DB_USERNAME=linkia
DB_PASSWORD=linkia
DB_DATABASE=linkia
```

## Base de datos

La base de datos corre en Docker. Levantarla antes de arrancar la aplicación:

```bash
docker compose up -d
```

## Ejecución

```bash
# desarrollo
npm run start:dev

# producción
npm run start:prod
```

## Documentación de la API

La documentación se genera automáticamente con Swagger y está disponible en:

```
http://localhost:3000/api
```

Swagger recorre los decoradores del código (`@ApiTags`, `@ApiOperation`, `@ApiResponse`)
y genera una interfaz interactiva donde se pueden consultar y probar todos los endpoints.

## Refactorización

Durante la revisión del código se detectaron y corrigieron los siguientes problemas:

### Documentación Swagger incorrecta
- El endpoint `GET /budgets` tenía el summary `'Obtiene un presupuesto por su ID'` en lugar de `'Obtiene todos los presupuestos'`
- Los `@ApiResponse` de `GET /budgets` y `GET /budgets/:id` tenían las descripciones cruzadas
- El endpoint `GET /clients` no tenía `isArray: true` en su `@ApiResponse`

### Bugs en el código
- El soft delete en `BudgetService` y `WorkService` se hacía asignando `deletedAt` manualmente en lugar de usar `softDelete()` de TypeORM
- Los métodos `restoreBudget` y `restoreWork` comprobaban `!restoredWork` cuando debían comprobar `!result.affected`
- Se lanzaba `NotFoundException` cuando no se proporcionaba el ID de sección, siendo lo correcto `BadRequestException`
- Checks imposibles tras llamadas a métodos que ya lanzan `NotFoundException`
- El `userId` recibido en `createBudget` no se usaba, se usaba `budgetData.user` en su lugar
- Columnas de tipo `enum` sin `type: 'enum'` explícito en las entidades
- Imports sin usar en varios archivos