

## Plan: Sistema TOTP (Google Authenticator) para Meow

### Resumen
Proteger exclusivamente el write-up de Meow con autenticación TOTP compatible con Google Authenticator. El resto del portfolio no cambia.

### Pasos

**1. Instalar dependencia `otplib`**

**2. Marcar Meow como protegido en `Report.tsx`**
- Añadir `protected?: boolean` al tipo del registro de reports
- Poner `protected: true` solo en `meow-htb`

**3. Crear `src/components/WriteupGuard.tsx`**
- Props: `isProtected: boolean`, `children: ReactNode`
- Si `isProtected` es false → renderiza children directamente
- Si es true:
  - Comprueba `sessionStorage` key `totp_meow` con timestamp de expiración
  - Si sesión válida → muestra children + countdown visible (mm:ss) del tiempo restante
  - Si no → overlay estilo Heimdall (fondo `#0d0d0d`, bordes `#00ff41`, monospace, glow)
  - Input de 6 dígitos, botón VERIFICAR ACCESO
  - Validación: `authenticator.check(code, import.meta.env.VITE_TOTP_SECRET)`
  - Si `VITE_TOTP_SECRET` no está definido → mensaje informativo en el overlay
  - Éxito → `sessionStorage.setItem("totp_meow", JSON.stringify({ expires: Date.now() + 600000 }))`
  - Countdown de 10 min; al llegar a 0 limpia storage y vuelve a pedir código
  - `beforeunload` limpia sessionStorage

**4. Integrar en `Report.tsx`**
- En el return del componente, envolver el iframe de Meow con `<WriteupGuard isProtected={report.protected}>` dentro del `ReportPasswordGate` existente

### Archivos afectados
- `package.json` — nueva dependencia `otplib`
- `src/components/WriteupGuard.tsx` — componente nuevo
- `src/pages/Report.tsx` — marcar meow + envolver con WriteupGuard
- `src/vite-env.d.ts` — declarar `VITE_TOTP_SECRET` en ImportMetaEnv

### Notas de seguridad
- La validación TOTP ocurre en cliente con el secret en `VITE_TOTP_SECRET`. Esto es adecuado para un portfolio personal (no es un sistema bancario). El secret queda expuesto en el bundle JS, lo cual es aceptable para este caso de uso.
- No se modifican rutas, estilos globales ni otros write-ups.

