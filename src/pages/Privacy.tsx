import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto font-mono space-y-6 text-sm leading-relaxed">
        <header className="border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Heindall · Documento legal</p>
          <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-muted-foreground text-xs">Última actualización: 19 de abril de 2026</p>
        </header>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">1. Responsable del tratamiento</h2>
          <p>
            Yoandy Ramírez Delgado, titular del sitio Heindall (<a href="https://yoandy-portfolio.lovable.app" className="text-primary hover:underline">yoandy-portfolio.lovable.app</a>),
            actúa como responsable del tratamiento de los datos personales recogidos. Contacto:{" "}
            <a href="mailto:yoandyramirezdelgado@gmail.com" className="text-primary hover:underline">
              yoandyramirezdelgado@gmail.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">2. Datos que tratamos</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><b>Email</b> — al solicitar acceso o registrarse en el área restringida.</li>
            <li><b>Dirección IP y user-agent</b> — para control de abuso (rate limiting) y registro de auditoría.</li>
            <li><b>Datos técnicos del navegador</b> — únicamente para correcto funcionamiento del sitio.</li>
          </ul>
          <p className="mt-2">No utilizamos cookies de seguimiento ni publicidad. No se realiza perfilado.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">3. Base jurídica y finalidades</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><b>Consentimiento</b> (art. 6.1.a GDPR) — acceso voluntario al área restringida.</li>
            <li><b>Interés legítimo</b> (art. 6.1.f GDPR) — protección frente a ataques (bruteforce, scraping).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">4. Plazo de conservación</h2>
          <p>
            Los registros de auditoría (IP, intentos) se conservan un máximo de 90 días.
            Las cuentas autorizadas se mantienen mientras el usuario no solicite su supresión.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">5. Encargados del tratamiento</h2>
          <p>
            Los datos se procesan en infraestructura de <b>Supabase</b> (proveedor de backend) y <b>Lovable</b> (hosting).
            Ambos cumplen con GDPR y mantienen Cláusulas Contractuales Tipo (CCT) cuando es aplicable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">6. Tus derechos</h2>
          <p>
            Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
            (arts. 15-22 GDPR) escribiendo a{" "}
            <a href="mailto:yoandyramirezdelgado@gmail.com" className="text-primary hover:underline">
              yoandyramirezdelgado@gmail.com
            </a>. También puedes presentar reclamación ante la AEPD (<a href="https://www.aepd.es" className="text-primary hover:underline">aepd.es</a>).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">7. Medidas de seguridad</h2>
          <p>
            Aplicamos cifrado en tránsito (TLS 1.3), Row Level Security en base de datos, autenticación multifactor (TOTP) en
            áreas administrativas, rate limiting persistente, validación HIBP de contraseñas y CSP con cabeceras de seguridad.
          </p>
        </section>

        <footer className="pt-6 border-t border-border">
          <Link to="/" className="text-primary hover:underline">← Volver al inicio</Link>
        </footer>
      </article>
    </div>
  );
};

export default Privacy;
