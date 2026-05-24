# Booking SaaS API

API REST para un sistema de reservas multi-negocio construida con NestJS.  
Diseñada con **Clean Architecture**, aplicando **Repository Pattern**, **validación de propiedad (IDOR Prevention)** y **autenticación JWT con roles**.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 |
| ORM | TypeORM 0.3 |
| Base de datos | PostgreSQL 17 |
| Autenticación | JWT (Passport) + Roles |
| Documentación | Swagger (OpenAPI) |
| Contenedores | Docker + Docker Compose |
| Lenguaje | TypeScript (strict mode) |

---

## Features

- **Autenticación JWT** con registro, login y refresh de token
- **Roles de usuario**: `user`, `admin`, `super-user`
- **CRUD completo** de usuarios, negocios y servicios
- **Paginación unificada** en todos los listados
- **Soft delete** en todas las entidades
- **Validación de propiedad (IDOR Prevention)**: cada usuario solo puede modificar sus propios recursos
- **Repositorio personalizado** desacopla la lógica de negocio del ORM
- **Documentación Swagger** en `/api`
- **Seed de datos** con 300 usuarios falsos + administrador

---

## Arquitectura

```
Cliente → Controller → Service → Repository → TypeORM → PostgreSQL
                              ↘
                      DTO Validation (class-validator)
                              ↘
                      Auth Guard + Role Guard + Ownership
```

Cada módulo sigue el patrón **Controller → Service → Repository**:

| Capa | Responsabilidad |
|---|---|
| **Controller** | Recibe la request, aplica guards y pipes |
| **Service** | Lógica de negocio, validaciones de ownership |
| **Repository** | Persistencia, consultas a la base de datos |

---

## Quick Start

```bash
# 1. Clonar
git clone <tu-repo>
cd booking-saas

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.template .env
# Editar .env con tus valores

# 4. Levantar PostgreSQL
docker compose up -d

# 5. Iniciar en modo desarrollo
pnpm start:dev

# 6. Documentación Swagger
# Abrir http://localhost:3000/api
```

## Comandos

| Comando | Descripción |
|---|---|
| `pnpm start:dev` | Dev con hot-reload |
| `pnpm build` | Compila a `dist/` |
| `pnpm lint` | ESLint + Prettier --fix |
| `pnpm test` | Tests unitarios (Jest) |
| `pnpm test:e2e` | Tests end-to-end |
| `pnpm seed` | Poblar DB con datos de prueba |

---

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/booking/auth/register` | ❌ | Registrar usuario |
| POST | `/booking/auth/login` | ❌ | Iniciar sesión |
| GET | `/booking/users` | ❌ | Listar usuarios |
| POST | `/booking/businesses` | ✅ | Crear negocio |
| GET | `/booking/businesses` | ❌ | Listar negocios |
| POST | `/booking/services/:businessId` | ✅ | Crear servicio |
| GET | `/booking/services` | ❌ | Listar servicios |
| GET | `/booking/services/:term` | ❌ | Buscar por UUID o nombre |
| PATCH | `/booking/services/:id` | ✅ | Actualizar servicio |
| DELETE | `/booking/services/:id` | ✅ | Eliminar servicio |

---

## Módulos

| Módulo | Estado | Patrón |
|---|---|---|
| `auth/` | ✅ Completo | JWT + Guards |
| `users/` | ✅ Completo | Repository Pattern |
| `businesses/` | ✅ Completo | Repository + Ownership |
| `services/` | ✅ Completo | Repository + Ownership |
| `seed/` | ✅ Completo | CLI + HTTP |

---

## Próximos pasos

- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions
- [ ] Motor de reservas (Bookings)
- [ ] Pasarela de pagos (Stripe)
- [ ] Despliegue en la nube

---

## Autor

**César Salazar** — Backend Developer  
[GitHub](https://github.com/Cesarrnerique13) · [LinkedIn](https://www.linkedin.com/in/cesar-salazar-223956368/)
