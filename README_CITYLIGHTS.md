# 🏢 City Lights - Sistema de Administración de Edificio

API REST desarrollada con NestJS para la gestión y administración del edificio City Lights.

## 🚀 Características

- **Autenticación JWT** con verificación por email
- **Sistema de roles** (público, usuario, administrador)
- **Verificación por OTP** (códigos de 6 dígitos)
- **Envío de emails** con Resend
- **Base de datos** PostgreSQL con Prisma ORM
- **Validación robusta** de datos
- **Arquitectura modular** con NestJS

## 🛡️ Roles del Sistema

- **Public**: Acceso a rutas públicas
- **User**: Residentes del edificio
- **Admin**: Administradores del edificio

## 📧 Sistema de Verificación

- Registro con verificación por email automática
- Códigos OTP de 6 dígitos con expiración de 15 minutos
- Máximo 3 intentos por código
- Reenvío de códigos disponible

## 🔧 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones de base de datos
npx prisma migrate dev

# Poblar base de datos con datos iniciales
pnpm run seed

# Iniciar en modo desarrollo
pnpm run start:dev
```

## 📱 Endpoints Principales

### Autenticación (Públicos)
- `POST /auth/register` - Registro de usuario
- `POST /auth/verify-email` - Verificar email con OTP
- `POST /auth/resend-verification` - Reenviar código
- `POST /auth/login` - Iniciar sesión

### Administración (Solo Admin)
- `GET /users` - Listar usuarios
- `GET /roles` - Gestionar roles
- `POST /users` - Crear usuarios

## 🔑 Variables de Entorno

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/citylights_db"
JWT_SECRET="tu_clave_secreta_muy_segura_min_32_chars"
RESEND_API_KEY="re_tu_api_key_de_resend"
FROM_EMAIL="citylights.new@gmail.com"
```

## 👤 Credenciales por Defecto

**Administrador:**
- Email: `admin@citylights.com`
- Password: `admin123`

## 🏗️ Tecnologías

- **Framework**: NestJS
- **Base de datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT
- **Emails**: Resend
- **Validación**: class-validator
- **Encriptación**: bcrypt

## 📚 Documentación

Ver `API_DOCS.md` para documentación completa de la API.

## 🤝 Desarrollo

```bash
# Modo desarrollo
pnpm run start:dev

# Compilar
pnpm run build

# Ejecutar linter
pnpm run lint

# Ejecutar tests
pnpm run test
```

---

© 2025 City Lights - Sistema de Administración de Edificio