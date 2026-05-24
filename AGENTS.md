# Booking API — AGENTS.md

_Instrucciones para OpenCode + Hoja de ruta de aprendizaje del desarrollador._

---

## Stack (verificado)

- **Framework:** NestJS 11
- **ORM:** TypeORM 0.3 con PostgreSQL 17
- **Auth:** JWT (Passport) con decorator compuesto `@Auth()`
- **Documentación:** Swagger UI en `/api`
- **Package manager:** pnpm (no npm/yarn)
- **Lint/Format:** ESLint 9 flat config + Prettier (singleQuote, trailingComma all)

---

## Quick Reference

| Comando | Efecto |
|---|---|
| `pnpm start:dev` | Dev con hot-reload |
| `pnpm build` | Compila a `dist/` |
| `pnpm lint` | ESLint + Prettier --fix |
| `pnpm test` | Jest unit tests (`*.spec.ts`, rootDir: `src/`) |
| `pnpm test:e2e` | E2E con config `test/jest-e2e.json` |
| `pnpm seed` | Seed CLI: 300 usuarios fake + admin vía faker |

**Base de datos:** PostgreSQL en Docker (`docker compose up -d`), puerto **5433** (no 5432).  
**Global prefix:** `/booking` (`src/main.ts:34`).  
**Path alias:** `@/*` → `src/*` (`tsconfig.json`).  
**TypeORM:** `synchronize: true` + `SnakeNamingStrategy`.

---

## Current Architecture — Module Map

| Módulo | Estado | Patrón | Notas |
|---|---|---|---|
| `auth/` | ✅ Completo | JWT Strategy + Custom Decorator + Guards | `@Auth(...roles)` compuesto |
| `users/` | ✅ Completo | Repository + Service + Controller | CRUD, paginación, soft delete |
| `businesses/` | ✅ Completo | Repository + Service + Controller | Ownership validation, paginación |
| `services/` | ✅ Completo | Repository + Service + Controller | Ownership validation, paginación |
| `common/` | ⚡ Mínimo | — | PaginationDto/Interface, errores DB |
| `seed/` | ✅ Completo | CLI + endpoint HTTP | 300 users + admin |

---

## Conventions (verificadas en código)

- **Repositorios custom**: cada módulo tiene su propio `*repository.ts`. El servicio nunca usa el repositorio de TypeORM directamente.
- **DTOs**: class-validator + class-transformer para validación de entrada.
- **Paginación unificada**: `PaginationDto` (page/limit) → `PaginationInterface` (data, total, page, limit, totalPages).
- **Soft delete**: `@DeleteDateColumn()` y `softDelete()`/`softRemove()` en todas las entidades.
- **Errores DB**: `handleDBExceptions()` centraliza códigos PostgreSQL 23505 (unique violation) y 23503 (FK violation) en `src/common/db/`.
- **Snake case**: `SnakeNamingStrategy` para tablas y columnas en PostgreSQL.
- **Normalización**: `@BeforeInsert`/`@BeforeUpdate` para limpiar emails y slugs.
- **Auth en escritura**: endpoints POST/PATCH/DELETE protegidos con `@Auth()`.

---

## Target Architecture — Design Patterns Roadmap

Patrones que ya aplicas (debes entenderlos y defenderlos en entrevistas):

### Repository Pattern (✅ implementado en users, businesses, services)
**Propósito:** Separar la lógica de persistencia de la lógica de negocio.  
**Por qué importa:** Si cambias de TypeORM a Prisma o de PostgreSQL a MongoDB, solo reescribes el repositorio — el servicio y controlador quedan intactos.  
**En entrevista:** "Desacoplo el ORM mediante el Repository Pattern para que la capa de negocio no dependa de la tecnología de persistencia."

### Ownership Validation / IDOR Prevention (✅ implementado en businesses, services)
**Propósito:** Evitar que un usuario autenticado modifique recursos de otros usuarios.  
**Vocabulario:** IDOR (Insecure Direct Object Reference) — vulnerabilidad donde un atacante modifica recursos ajenos solo con adivinar su UUID.  
**Regla de oro:** `Usuario → Propietario del Negocio → Servicio.` Cada capa debe validar la propiedad antes de escribir.

### Pagination Standard (✅ implementado en users, businesses, services)
**Propósito:** Consistencia en toda la API.

### Strategy Pattern (📌 meta — no implementado)
**Propósito:** Intercambiar algoritmos sin modificar el controlador (ej: Stripe ↔ PayPal ↔ MercadoPago).  

### Factory Pattern (📌 meta — no implementado)
**Propósito:** Crear objetos condicionalmente sin exponer la lógica de instanciación.

---

## Mentorship Contract

Este agente opera como **Tech Lead**. Reglas de comportamiento:

1. **No complacencia**: código subóptimo, acoplado o frágil se rechaza con explicación constructiva.
2. **Pattern-first**: antes de implementar, preguntará "¿qué patrón aplica aquí?" y "¿cuál es el trade-off?".
3. **Preguntas de producto**: edge cases, validaciones, y restricciones de negocio antes de escribir código.
4. **Pair programming activo**: señalará el error, explicará el concepto teórico, y guiará con preguntas — no dará la solución masticada.
5. **Tech Vocabulary**: al final de cada review importante, incluirá 3–5 términos técnicos en inglés con definición contextualizada.

---

## Known Gaps & Vulnerabilities (inventario vivo)

| # | Problema | Archivo | Gravedad |
|---|---|---|---|
| 1 | No hay tests unitarios (`*.spec.ts`) | — | 🟡 Calidad |
| 2 | Test e2e espera "Hello World!" falso positivo | `test/app.e2e-spec.ts` | 🟡 Calidad |
| 3 | No hay CI/CD configurado | — | 🟡 Entrega |

---

## Tech Vocabulary

Términos que aparecen en cada review. Internalízalos.

| Término | Definición | En tu código |
|---|---|---|
| **Repository Pattern** | Capa intermedia entre negocio y DB que abstrae el ORM | `users.repository.ts`, `business.repository.ts`, `services.repository.ts` |
| **IDOR** | Vulnerabilidad donde un atacante accede/modifica recursos ajenos | Evitado en `services/` y `businesses/` |
| **Ownership** | Validación de que el usuario autenticado es dueño del recurso | `businesses.service.ts`, `services.service.ts` |
| **Loose Coupling** | Módulos que dependen de interfaces/contratos, no de implementaciones concretas | Servicio → Repositorio |
| **Soft Delete** | Borrado lógico: el registro no se elimina, se marca con timestamp | `@DeleteDateColumn()`, `softDelete()` |

---

_Última actualización: 2026-05-21. Mantené este archivo vivo — actualizalo cuando corrijas un gap o implementes un nuevo patrón._
