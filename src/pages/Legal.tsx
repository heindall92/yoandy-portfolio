import { Link } from "react-router-dom";

const Legal = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto font-mono space-y-6 text-sm leading-relaxed">
        <header className="border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Heindall · Documento legal</p>
          <h1 className="text-3xl font-bold mb-2">Aviso Legal</h1>
          <p className="text-muted-foreground text-xs">Última actualización: 19 de abril de 2026</p>
        </header>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">1. Titularidad del sitio</h2>
          <p>
            En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE),
            se informa que el titular de este sitio web es:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><b>Titular:</b> Yoandy Ramírez Delgado</li>
            <li><b>Sitio:</b> yoandy-portfolio.lovable.app</li>
            <li><b>Contacto:</b> <a href="mailto:yoandyramirezdelgado@gmail.com" className="text-primary hover:underline">yoandyramirezdelgado@gmail.com</a></li>
            <li><b>Naturaleza:</b> portfolio profesional de ciberseguridad ofensiva (sin actividad comercial directa).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">2. Objeto</h2>
          <p>
            Este sitio publica writeups educativos de ejercicios de pentesting realizados en plataformas legales y autorizadas
            (HackTheBox, TryHackMe, HackMyVM, etc.). Todo el contenido es con fines didácticos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">3. Propiedad intelectual</h2>
          <p>
            El contenido (textos, código, diagramas) es propiedad de su autor salvo indicación expresa.
            Está prohibida su reproducción total o parcial sin autorización previa por escrito.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">4. Uso responsable</h2>
          <p>
            La información publicada tiene exclusivamente fin educativo. El uso de las técnicas descritas contra sistemas
            sin autorización expresa del propietario es ilegal y constituye delito según el Código Penal (arts. 197 ter y 264).
            El autor no se responsabiliza del uso indebido por parte de terceros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">5. Limitación de responsabilidad</h2>
          <p>
            El titular no garantiza la disponibilidad continua del servicio ni la ausencia de errores.
            No se responsabiliza de daños derivados del uso o imposibilidad de uso del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">6. Legislación aplicable</h2>
          <p>
            Las relaciones derivadas del uso de este sitio se rigen por la legislación española y europea (GDPR, LSSI-CE).
            Para cualquier controversia, las partes se someten a los Juzgados y Tribunales del domicilio del usuario consumidor.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">7. Política de Privacidad</h2>
          <p>
            Para conocer cómo tratamos los datos personales, consulta la{" "}
            <Link to="/privacy" className="text-primary hover:underline">Política de Privacidad</Link>.
          </p>
        </section>

        <footer className="pt-6 border-t border-border">
          <Link to="/" className="text-primary hover:underline">← Volver al inicio</Link>
        </footer>
      </article>
    </div>
  );
};

export default Legal;
