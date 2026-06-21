import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Heart, Phone, MapPin, Clock, Star, ChevronDown, ArrowRight,
  Stethoscope, Syringe, Scissors, ShieldCheck, Microscope, Ambulance,
  CheckCircle2, Users, Award, Calendar, Mail, Instagram, Facebook,
  ChevronLeft, ChevronRight, Menu, X, Dog, Cat, Bird, Rabbit
} from "lucide-react";

const CLINIC_NAME = "Clínica Veterinaria Meneses";
const CEO = "Dr. Alfredo Meneses Gómez";
const ADDRESS = "Calle Real, 14 · Lepe, Huelva 21440";
const PHONE = "+34 959 38 00 00";
const EMAIL = "contacto@vetmeneses.es";
const HOURS = "Lun–Vie: 9:00–21:00 · Sáb: 9:00–14:00";

const services = [
  {
    icon: Stethoscope,
    title: "Consultas Generales",
    desc: "Diagnóstico y seguimiento integral de la salud de tu mascota con tecnología de última generación.",
    color: "from-teal-400 to-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: Syringe,
    title: "Vacunaciones",
    desc: "Planes de vacunación personalizados según la especie, edad y estilo de vida de tu animal.",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Scissors,
    title: "Cirugía Avanzada",
    desc: "Quirófano equipado con monitorización anestésica digital para intervenciones seguras y eficaces.",
    color: "from-cyan-400 to-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
  },
  {
    icon: Microscope,
    title: "Laboratorio Clínico",
    desc: "Analíticas completas de sangre, orina y citología con resultados en menos de 60 minutos.",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Ambulance,
    title: "Urgencias 24h",
    desc: "Servicio de urgencias las 24 horas para que tu mascota siempre tenga atención cuando la necesite.",
    color: "from-rose-400 to-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: ShieldCheck,
    title: "Medicina Preventiva",
    desc: "Desparasitaciones, control de peso, nutrición y revisiones periódicas para una vida larga y sana.",
    color: "from-violet-400 to-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
];

const stats = [
  { value: "15+", label: "Años de experiencia", icon: Award },
  { value: "8.500+", label: "Pacientes atendidos", icon: Heart },
  { value: "98%", label: "Clientes satisfechos", icon: Star },
  { value: "24/7", label: "Atención de urgencias", icon: Clock },
];

const testimonials = [
  {
    name: "María García",
    pet: "Luna (Labrador, 4 años)",
    text: "El Dr. Meneses es increíblemente profesional y atento. Mi perra Luna es tratada como si fuera suya. No cambiaría esta clínica por nada del mundo.",
    rating: 5,
    avatar: "MG",
  },
  {
    name: "Carlos Domínguez",
    pet: "Simón (Gato Persa, 7 años)",
    text: "Servicio excelente. Vinimos de urgencias a las 2 de la madrugada y nos atendieron enseguida. El equipo es muy humano y eficiente.",
    rating: 5,
    avatar: "CD",
  },
  {
    name: "Ana Romero",
    pet: "Kiki (Conejo Enano, 2 años)",
    text: "Llevamos a Kiki desde que era bebé. El seguimiento y los consejos de nutrición han sido fundamentales para su salud. Totalmente recomendada.",
    rating: 5,
    avatar: "AR",
  },
  {
    name: "Javier Moreno",
    pet: "Thor (Pastor Alemán, 6 años)",
    text: "La cirugía de Thor salió perfecta. El Dr. Meneses nos explicó todo con detalle antes y después. Profesionalidad y calidez a partes iguales.",
    rating: 5,
    avatar: "JM",
  },
];

const pets = [
  { icon: Dog, label: "Perros" },
  { icon: Cat, label: "Gatos" },
  { icon: Bird, label: "Aves" },
  { icon: Rabbit, label: "Exóticos" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function VetClinica() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "#servicios", label: "Servicios" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#equipo", label: "Equipo" },
    { href: "#testimonios", label: "Opiniones" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');
        .vet-font { font-family: 'Inter', sans-serif; }
        .vet-serif { font-family: 'Playfair Display', serif; }
        .vet-gradient { background: linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #7c3aed 100%); }
        .vet-gradient-text { background: linear-gradient(135deg, #0f766e, #0891b2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .vet-card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .vet-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .vet-blob { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
        .vet-paw { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='12'/%3E%3Ccircle cx='70' cy='30' r='10'/%3E%3Ccircle cx='15' cy='60' r='9'/%3E%3Ccircle cx='85' cy='60' r='9'/%3E%3Cellipse cx='50' cy='72' rx='20' ry='22'/%3E%3C/svg%3E"); }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* NAV */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 vet-font ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg shadow-teal-900/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl vet-gradient flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className={`font-bold text-lg leading-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
              Vet<span className="text-teal-400">Meneses</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-teal-400 ${
                  scrolled ? "text-gray-600" : "text-white/80"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                scrolled ? "text-gray-600 hover:text-teal-600" : "text-white/80 hover:text-white"
              }`}
            >
              <Phone className="w-4 h-4" />
              {PHONE}
            </a>
            <a
              href="#contacto"
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
            >
              Cita Online
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? "text-gray-700" : "text-white"}`}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 font-medium text-sm hover:text-teal-600 transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#contacto"
                  className="bg-teal-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center"
                >
                  Pedir Cita
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 vet-gradient">
          <div className="absolute inset-0 vet-paw bg-repeat" style={{ backgroundSize: "120px 120px" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
          {/* Animated blobs */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 vet-blob"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 vet-blob"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1], x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-400/20 vet-blob"
          />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center vet-font"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/30"
            >
              <MapPin className="w-3.5 h-3.5" />
              Lepe, Huelva · Costa de la Luz
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] mb-6 vet-serif"
            >
              El mejor cuidado
              <br />
              <span className="italic text-teal-200">para tu mejor</span>
              <br />
              amigo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-lg text-white/80 leading-relaxed mb-10 max-w-lg"
            >
              Más de 15 años cuidando a las mascotas de Lepe y toda la comarca con
              tecnología avanzada, atención personalizada y el amor que se merecen.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-full text-base hover:bg-teal-50 transition-all shadow-2xl shadow-black/20 hover:shadow-black/30"
              >
                <Calendar className="w-5 h-5" />
                Pedir Cita Ahora
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Ver Servicios
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Pet types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 flex items-center gap-6"
            >
              <span className="text-white/60 text-sm">Atendemos:</span>
              {pets.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/70 text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg">
                    <Stethoscope className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">Próximas citas</div>
                    <div className="text-white/60 text-sm">Hoy disponibles</div>
                  </div>
                </div>

                {[
                  { time: "10:00", service: "Consulta General", pet: "Max (Beagle)", color: "bg-teal-400" },
                  { time: "11:30", service: "Vacunación Anual", pet: "Luna (Siamés)", color: "bg-cyan-400" },
                  { time: "13:00", service: "Revisión Post-op", pet: "Rocky (Bulldog)", color: "bg-violet-400" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/10 border border-white/20 mb-3 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <div className={`w-1.5 h-12 rounded-full ${item.color}`} />
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">{item.service}</div>
                      <div className="text-white/60 text-xs">{item.pet}</div>
                    </div>
                    <div className="text-white/80 text-sm font-mono font-bold">{item.time}</div>
                  </motion.div>
                ))}

                <div className="mt-6 p-4 rounded-2xl bg-teal-500/30 border border-teal-400/30 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">Urgencias abiertas · 24 horas</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.a
          href="#servicios"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Explorar</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.a>
      </section>

      {/* STATS RIBBON */}
      <section className="bg-gray-950 py-12 vet-font">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <Icon className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <div className="text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicios" className="py-24 bg-gray-50 vet-font">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Nuestros Servicios
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-5 vet-serif">
              Todo lo que tu mascota
              <br />
              <span className="vet-gradient-text">necesita, en un lugar</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Ofrecemos una atención veterinaria completa, con instalaciones modernas y
              un equipo apasionado por el bienestar animal.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className={`${s.bg} border ${s.border} rounded-2xl p-7 vet-card-hover cursor-pointer group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-5 flex items-center gap-1 text-teal-600 text-sm font-semibold group-hover:gap-2 transition-all">
                  Saber más <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="nosotros" className="py-24 bg-white overflow-hidden vet-font">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-200 aspect-[4/3] flex items-center justify-center shadow-2xl">
              <div className="text-center p-12">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32 rounded-3xl vet-gradient mx-auto flex items-center justify-center shadow-2xl mb-6"
                >
                  <Heart className="w-16 h-16 text-white" fill="white" />
                </motion.div>
                <p className="text-teal-800 font-bold text-xl">Cuidando vidas desde 2009</p>
                <p className="text-teal-600 text-sm mt-2">Lepe, Huelva · Costa de la Luz</p>
              </div>

              <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400" fill="#fbbf24" />
                  ))}
                </div>
                <div>
                  <div className="text-gray-900 font-bold text-sm">5.0 / 5</div>
                  <div className="text-gray-400 text-xs">+850 reseñas</div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4">
                <div className="text-gray-900 font-black text-2xl">8.500+</div>
                <div className="text-gray-500 text-xs">Pacientes felices</div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 top-1/3 bg-teal-500 text-white rounded-2xl p-4 shadow-xl"
            >
              <CheckCircle2 className="w-8 h-8 mb-1" />
              <div className="text-xs font-bold">Colegiado N.º 4821</div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              Quiénes Somos
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 vet-serif leading-tight">
              Vocación,
              <br />
              <span className="vet-gradient-text">ciencia y amor</span>
              <br />
              por los animales
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              La <strong className="text-gray-700">{CLINIC_NAME}</strong> nació en 2009 de la mano del
              Dr. Alfredo Meneses Gómez con una misión clara: ofrecer a las mascotas de Lepe y la Costa
              de la Luz la atención veterinaria de más alto nivel, combinando tecnología punta con el trato
              cálido y personalizado que cada animal merece.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Hoy, somos un equipo de 8 profesionales especializados, con instalaciones renovadas,
              laboratorio propio y disponibilidad las 24 horas para urgencias. Porque para nosotros,
              tu mascota es parte de la familia.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                "Laboratorio propio en clínica",
                "Quirófano con monitorización digital",
                "Radiología digital y ecografía",
                "Urgencias 24h todos los días",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#contacto"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-teal-500/30"
            >
              Conocer más
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* TEAM / CEO */}
      <section id="equipo" className="py-24 bg-gradient-to-br from-gray-900 to-teal-950 vet-font overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-teal-400/20 text-teal-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Nuestro Equipo
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 vet-serif">
              Profesionales que
              <br />
              <span className="text-teal-300">aman lo que hacen</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* CEO Card - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-1 relative"
            >
              <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 vet-blob" />
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black mb-5 backdrop-blur-sm">
                    AM
                  </div>
                  <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    Fundador & Director
                  </div>
                  <h3 className="text-white font-black text-xl mb-1">{CEO}</h3>
                  <p className="text-teal-100 text-sm mb-5">Licenciado en Veterinaria (UCO) · Especialista en Cirugía y Medicina Interna</p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Con más de 15 años de experiencia clínica, el Dr. Meneses ha consagrado su carrera
                    al bienestar animal con especial enfoque en cirugía de tejidos blandos y medicina
                    interna de pequeños animales.
                  </p>
                  <div className="mt-6 flex gap-2">
                    {["Cirugía", "Med. Interna", "Exóticos"].map((tag) => (
                      <span key={tag} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rest of team */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                { initials: "LC", name: "Dra. Laura Cortés", role: "Veterinaria Senior", spec: "Dermatología · Nutrición", tags: ["Dermatología", "Nutrición"] },
                { initials: "PM", name: "Dr. Pablo Morales", role: "Veterinario", spec: "Traumatología · Ortopedia", tags: ["Traumatología", "Ortopedia"] },
                { initials: "SR", name: "Dra. Sara Ruiz", role: "Auxiliar Técnico", spec: "Cuidados intensivos · Lab.", tags: ["UCI", "Laboratorio"] },
                { initials: "JF", name: "José Fernández", role: "Administrativo", spec: "Atención al cliente · Citas", tags: ["Gestión", "Atención"] },
              ].map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-500/30 border border-teal-400/30 flex items-center justify-center text-teal-300 font-black text-sm mb-4">
                    {member.initials}
                  </div>
                  <h4 className="text-white font-bold mb-0.5">{member.name}</h4>
                  <p className="text-teal-300 text-xs font-medium mb-1">{member.role}</p>
                  <p className="text-white/50 text-xs mb-3">{member.spec}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.tags.map((t) => (
                      <span key={t} className="bg-white/10 text-white/60 text-xs px-2.5 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonios" className="py-24 bg-gray-50 vet-font">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Testimonios
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-5 vet-serif">
              Lo que dicen
              <br />
              <span className="vet-gradient-text">nuestros clientes</span>
            </h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400" fill="#fbbf24" />
                  ))}
                </div>
                <p className="text-gray-700 text-xl leading-relaxed italic mb-8 max-w-3xl mx-auto">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full vet-gradient flex items-center justify-center text-white text-sm font-bold">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-gray-900 font-bold">{testimonials[activeTestimonial].name}</div>
                    <div className="text-gray-400 text-sm">{testimonials[activeTestimonial].pet}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setActiveTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:border-teal-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === activeTestimonial ? "bg-teal-500 w-8" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
              <button
                onClick={() => setActiveTestimonial((p) => (p + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:border-teal-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 vet-gradient vet-font relative overflow-hidden">
        <div className="absolute inset-0 vet-paw bg-repeat opacity-30" style={{ backgroundSize: "100px 100px" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 vet-serif">
            Tu mascota merece la
            <br />
            mejor atención
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Pide tu cita ahora o llámanos. Estamos en Lepe, a tu lado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-full hover:bg-teal-50 transition-all shadow-xl"
            >
              <Phone className="w-5 h-5" />
              {PHONE}
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
            >
              <Calendar className="w-5 h-5" />
              Reservar Cita Online
            </a>
          </div>
        </motion.div>
      </section>

      {/* CONTACT */}
      <section id="contacto" className="py-24 bg-white vet-font">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              Contacto & Ubicación
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-6 vet-serif">
              Estamos en el
              <br />
              <span className="vet-gradient-text">corazón de Lepe</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Visítanos en nuestra clínica, llámanos o escríbenos. El equipo de{" "}
              <strong className="text-gray-700">VetMeneses</strong> estará encantado de ayudarte.
            </p>

            <div className="space-y-5">
              {[
                { icon: MapPin, label: "Dirección", value: ADDRESS, href: "https://maps.google.com" },
                { icon: Phone, label: "Teléfono", value: PHONE, href: `tel:${PHONE}` },
                { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
                { icon: Clock, label: "Horario", value: HOURS, href: undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-gray-800 font-medium hover:text-teal-600 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-gray-800 font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 flex items-center justify-center transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-gray-500 hover:text-teal-600" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
              <h3 className="text-gray-900 font-bold text-xl mb-6">Solicitar Cita</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 text-sm font-medium mb-1.5 block">Nombre</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium mb-1.5 block">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="6XX XXX XXX"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-1.5 block">Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 text-sm font-medium mb-1.5 block">Mascota</label>
                    <input
                      type="text"
                      placeholder="Nombre y especie"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium mb-1.5 block">Servicio</label>
                    <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all">
                      <option value="">Seleccionar...</option>
                      <option>Consulta General</option>
                      <option>Vacunación</option>
                      <option>Cirugía</option>
                      <option>Urgencia</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-1.5 block">Mensaje</label>
                  <textarea
                    rows={3}
                    placeholder="Cuéntanos brevemente el motivo de la consulta..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all resize-none"
                  />
                </div>
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Enviar Solicitud de Cita
                </button>
                <p className="text-gray-400 text-xs text-center">
                  Nos pondremos en contacto en menos de 2 horas en horario de apertura.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 py-12 vet-font">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl vet-gradient flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <div className="text-white font-bold">VetMeneses</div>
                <div className="text-gray-500 text-xs">Clínica Veterinaria · Lepe, Huelva</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-teal-400 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Phone className="w-4 h-4 text-teal-400" />
              <a href={`tel:${PHONE}`} className="hover:text-teal-400 transition-colors">{PHONE}</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-gray-600 text-xs">
            <p>© 2024 {CLINIC_NAME}. Todos los derechos reservados.</p>
            <p className="flex items-center gap-1.5">
              Hecho con <Heart className="w-3 h-3 text-rose-400" fill="#fb7185" /> para los animales de Lepe
            </p>
            <p>Director médico: {CEO}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
