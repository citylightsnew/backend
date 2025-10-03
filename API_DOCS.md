# API de Autenticación y Roles - City Lights

## 🔐 Endpoints de Autenticación (Públicos)

### Registro de Usuario
```
POST /auth/register
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "MiPassword123!"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Usuario registrado exitosamente. Por favor verifica tu email.",
  "user": {
    "id": "cm1xu8xyz...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "verified": false
  },
  "needsVerification": true
}
```

**Nota:** Después del registro, se envía automáticamente un código de verificación de 6 dígitos al email del usuario. El código expira en 15 minutos.

### Verificación de Email
```
POST /auth/verify-email
```

**Body:**
```json
{
  "email": "juan@example.com",
  "code": "123456"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Email verificado exitosamente",
  "user": {
    "id": "cm1xu8xyz...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "verified": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Reenviar Código de Verificación
```
POST /auth/resend-verification
```

**Body:**
```json
{
  "email": "juan@example.com"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Nuevo código de verificación enviado"
}
```

### Login de Usuario
```
POST /auth/login
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "MiPassword123!"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "cm1xu8xyz...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "verified": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🛡️ Endpoints Protegidos

### Usando el Token
Para acceder a rutas protegidas, incluye el token en el header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Niveles de Acceso

#### 🟢 Públicas (sin autenticación)
- `GET /public` - Información pública
- `GET /public/health` - Health check
- `POST /auth/register` - Registro
- `POST /auth/verify-email` - Verificar email con código OTP
- `POST /auth/resend-verification` - Reenviar código de verificación
- `POST /auth/login` - Login

#### 🟡 Usuario y Admin (requiere USER o ADMIN)
- `GET /` - Endpoint principal

#### 🔴 Solo Admin (requiere ADMIN)
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `GET /users/:id` - Ver usuario específico
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario
- `GET /roles` - Listar roles
- `POST /roles` - Crear rol
- `GET /roles/:id` - Ver rol específico
- `PATCH /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

## 📝 Validaciones de Contraseña

La contraseña debe cumplir con:
- Mínimo 8 caracteres
- Máximo 128 caracteres
- Al menos 1 letra minúscula
- Al menos 1 letra mayúscula
- Al menos 1 número
- Al menos 1 carácter especial (@$!%*?&)

## 🎭 Roles del Sistema

1. **public** - Sin acceso especial
2. **user** - Acceso a rutas de usuario (rol por defecto al registrarse)
3. **admin** - Acceso completo al sistema

## ⚠️ Códigos de Error

- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (token inválido o faltante)
- `403` - Forbidden (sin permisos suficientes)
- `409` - Conflict (email ya existe en registro)
- `404` - Not Found (recurso no encontrado)

## � Sistema de Verificación por Email

### Flujo de Verificación:
1. **Registro**: Usuario se registra → se envía código OTP de 6 dígitos
2. **Verificación**: Usuario ingresa código → cuenta se activa y recibe token
3. **Reenvío**: Si no recibe el código, puede solicitar uno nuevo

### Códigos OTP:
- **Duración**: 15 minutos
- **Formato**: 6 dígitos numéricos
- **Intentos**: Máximo 3 intentos por código
- **Seguridad**: Códigos hasheados en base de datos

## �🔧 Variables de Entorno

Asegúrate de configurar:
```env
JWT_SECRET=tu_clave_secreta_muy_segura_min_32_chars
DATABASE_URL=postgresql://usuario:password@localhost:5432/db
RESEND_API_KEY=re_tu_api_key_de_resend
FROM_EMAIL=citylights.new@gmail.com
```

### Configuración de Resend:
1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio o usar dominio de prueba
3. Obtener API key del dashboard
4. Configurar variable `RESEND_API_KEY`

## 👤 Credenciales Administrador por Defecto

**Usuario Admin:**
- Email: `admin@citylights.com`
- Password: `admin123`
- Rol: `admin`

Este usuario tiene acceso completo a todas las funciones del sistema de administración del edificio.

---

## 📧 Configuración de Resend para Envío de Emails

### 🚀 Configuración Rápida (Para Desarrollo)

**Paso 1**: Crear cuenta en Resend
1. Ve a [resend.com](https://resend.com) y crea una cuenta
2. Confirma tu email de registro

**Paso 2**: Obtener API Key
1. Ve al Dashboard de Resend
2. Clic en "API Keys" en el menú lateral
3. Clic en "Create API Key"
4. Dale un nombre (ej: "City Lights Development")
5. Copia la API key que genera

**Paso 3**: Configurar Variables de Entorno
```env
RESEND_API_KEY=re_tu_api_key_copiada_aqui
```

**Paso 4**: Usar Dominio de Desarrollo
El código ya está configurado para usar `onboarding@resend.dev` que funciona inmediatamente sin configuración adicional.

### ✅ ¡Listo! Ya puedes enviar emails de verificación.

---

## 🏗️ Configuración de Dominio Propio (Para Producción)

### ¿Por qué necesitas un dominio propio?
- Mayor confiabilidad de entrega
- Emails menos propensos a ir a spam  
- Imagen más profesional
- Sin limitaciones de Resend

### Paso 1: Adquirir un Dominio

**Opciones Recomendadas:**
- **Namecheap**: ~$12/año - [namecheap.com](https://namecheap.com)
- **Cloudflare**: ~$9/año - [cloudflare.com](https://cloudflare.com)
- **GoDaddy**: ~$15/año - [godaddy.com](https://godaddy.com)
- **Google Domains**: ~$12/año - [domains.google](https://domains.google)

**Ejemplos de dominios:**
- `citylights.com`
- `citylights.co` 
- `citylights.app`
- `citylights.site`

### Paso 2: Agregar Dominio en Resend

1. **Ir a Resend Dashboard**: [resend.com/domains](https://resend.com/domains)
2. **Clic en "Add Domain"**
3. **Ingresar tu dominio**: (ej: `citylights.com`)
4. **Copiar los registros DNS** que te muestra Resend

### Paso 3: Configurar DNS en tu Proveedor

Resend te dará registros como estos:

**Registros MX (Mail Exchange):**
```
Tipo: MX
Nombre: @
Valor: mx1.resend.com
Prioridad: 10

Tipo: MX  
Nombre: @
Valor: mx2.resend.com
Prioridad: 20
```

**Registro TXT (SPF):**
```
Tipo: TXT
Nombre: @
Valor: "v=spf1 include:_spf.resend.com ~all"
```

**Registro CNAME (DKIM):**
```
Tipo: CNAME
Nombre: resend._domainkey
Valor: resend._domainkey.resend.com
```

### Paso 4: Agregar Registros en tu Proveedor

**En Namecheap:**
1. Panel de Control → Domain List
2. Clic en "Manage" junto a tu dominio
3. Ir a "Advanced DNS"
4. Agregar cada registro copiando exactamente los valores

**En Cloudflare:**
1. Dashboard → Tu dominio → DNS → Records
2. Clic en "Add record"
3. Agregar cada registro según los valores de Resend

**En GoDaddy:**
1. My Products → DNS
2. Agregar registros en la sección correspondiente

### Paso 5: Verificar Dominio

1. **Esperar propagación**: 24-48 horas (puede ser más rápido)
2. **En Resend**: El estatus cambiará a "Verified" ✅
3. **Verificar manualmente**: Usa herramientas como [mxtoolbox.com](https://mxtoolbox.com)

### Paso 6: Actualizar Código

Una vez verificado, actualiza el email service:

```typescript
// En src/mail/email.service.ts
from: 'noreply@citylights.com', // Tu dominio verificado
```

### 🔍 Verificación y Testing

**Verificar Registros DNS:**
```bash
# Verificar MX records
dig MX citylights.com

# Verificar TXT records  
dig TXT citylights.com

# Verificar CNAME
dig CNAME resend._domainkey.citylights.com
```

**Testing de Emails:**
- Envía un email de prueba desde Resend Dashboard
- Verifica que llegue a inbox (no spam)
- Prueba con diferentes proveedores (Gmail, Outlook, etc.)

### ⚠️ Problemas Comunes

**Email va a spam:**
- Verifica que todos los registros DNS estén correctos
- Agrega registro DMARC opcional
- Usa contenido profesional en emails

**Dominio no se verifica:**
- Espera más tiempo para propagación DNS
- Verifica que copiaste exactamente los registros
- Contacta soporte de tu proveedor de dominio

**Error de autenticación:**
- Verifica que RESEND_API_KEY esté correcta
- Regenera API key si es necesario

### 💡 Tips Adicionales

- **Subdominio**: Puedes usar `mail.citylights.com` en lugar del dominio principal
- **Múltiples emails**: Configura `noreply@`, `support@`, `admin@` 
- **Monitoreo**: Resend te da estadísticas de entrega
- **Rate limits**: Plan gratuito tiene límites, considera upgrade para producción

### 📞 Soporte

Si tienes problemas:
1. **Documentación Resend**: [resend.com/docs](https://resend.com/docs)
2. **Soporte Resend**: [resend.com/support](https://resend.com/support)
3. **Comunidad**: Discord de Resend
```

### Configuración de Resend:
1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio o usar dominio de prueba
3. Obtener API key del dashboard
4. Configurar variable `RESEND_API_KEY`