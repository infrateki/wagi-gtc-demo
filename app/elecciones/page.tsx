'use client'

import { useState } from 'react'

const ELECTION_DATE = new Date('2026-04-12T08:00:00-05:00')
const NOW = new Date()
const DAYS_LEFT = Math.ceil((ELECTION_DATE.getTime() - NOW.getTime()) / (1000 * 60 * 60 * 24))

const CANDIDATES = [
  {
    rank: 1,
    name: 'Rafael López Aliaga',
    party: 'Renovación Popular',
    color: '#3b82f6',
    poll: 11.4,
    antivoto: 38,
    trend: '→',
    perfil: 'Empresario ultraderechista, alcalde de Lima. Discurso de "mano dura" contra la criminalidad y reducción del Estado. Voz anti-izquierda más fuerte del espectro.',
    fortaleza: 'Consolidado en Lima, base fuerte en clases medias y altas, imagen de gestor.',
    debilidad: 'Polariza. Su estilo confrontacional le cierra puertas con electores moderados. Antivoto alto.',
    escenario2v: '⚡ Favorito en segunda vuelta vs Keiko. Moderado vs. otros candidatos.',
  },
  {
    rank: 2,
    name: 'Keiko Fujimori',
    party: 'Fuerza Popular',
    color: '#f97316',
    poll: 10.9,
    antivoto: 54,
    trend: '↗',
    perfil: 'Candidata presidencial por cuarta vez. Hija del expresidente Alberto Fujimori. Propuestas: seguridad, empleo y desregularización.',
    fortaleza: 'Base fujimorista leal (~10%), maquinaria partidaria consolidada, experiencia electoral.',
    debilidad: '54% de antivoto — el más alto del campo. Carga del legado de corrupción. Difícil ganar segunda vuelta.',
    escenario2v: '🔴 En segunda vuelta, el antivoto la hundiría ante casi cualquier rival. El "anti-Keiko" unifica a todos.',
  },
  {
    rank: 3,
    name: 'Alfonso López Chau',
    party: 'Ahora Nación',
    color: '#22c55e',
    poll: 6.5,
    antivoto: 18,
    trend: '↗',
    perfil: 'Ex funcionario público, tecnócrata. Propuesta de modernización del Estado y lucha anticorrupción. Perfil técnico, menos político.',
    fortaleza: 'Bajo antivoto, imagen de honestidad, crecimiento sostenido en encuestas.',
    debilidad: 'Sin base territorial sólida. Poca presencia mediática. Bajo reconocimiento fuera de Lima.',
    escenario2v: '🟡 Si pasa a segunda vuelta podría ganar por ser el "menos malo".',
  },
  {
    rank: 4,
    name: 'Wolfgang Grozo',
    party: 'Integridad Democrática',
    color: '#a855f7',
    poll: 5.1,
    antivoto: 22,
    trend: '↘',
    perfil: 'Candidato emergente con discurso de renovación política. Crecía en encuestas hasta revelarse sus reuniones con el empresario Zamir Villaverde (investigado por corrupción).',
    fortaleza: 'Captaba al electorado joven y desencantado. Apelaba al anti-establishment.',
    debilidad: '⚠️ Escándalo Villaverde: reuniones comprometedoras aún no reflejadas en encuestas. Tendencia bajista esperada.',
    escenario2v: '🟠 Escándalo puede costarle el paso a segunda vuelta.',
  },
  {
    rank: 5,
    name: 'Carlos Álvarez',
    party: 'País para Todos',
    color: '#eab308',
    poll: 4.0,
    antivoto: 15,
    trend: '→',
    perfil: 'Comediante reconvertido en político. Propuestas populistas centradas en bienestar social.',
    fortaleza: 'Alta recognocibilidad por su trayectoria en medios. Perfil cercano a la gente.',
    debilidad: 'No convence como candidato presidencial serio. Techo electoral bajo.',
    escenario2v: '⬜ Improbable segunda vuelta.',
  },
  {
    rank: 6,
    name: 'César Acuña',
    party: 'Alianza para el Progreso',
    color: '#ef4444',
    poll: 3.8,
    antivoto: 42,
    trend: '↘',
    perfil: 'Empresario educativo, gobernador regional. Tercer candidato con alta desconfianza del electorado.',
    fortaleza: 'Maquinaria regional fuerte, experiencia electoral, recursos.',
    debilidad: 'Antivoto de 42%. Imagen de compra de votos lo persigue.',
    escenario2v: '⬜ Improbable segunda vuelta dado su antivoto.',
  },
]

const ANALISIS = [
  {
    titulo: '🗳️ Primera vuelta: campo ultra-fragmentado',
    texto: 'Con el líder en solo 11.4%, ningún candidato puede ganar en primera vuelta (requiere 50%+1 o 30%+ con ventaja de 5pp sobre el segundo). La segunda vuelta es prácticamente inevitable.',
  },
  {
    titulo: '❌ El "anti-Keiko" como factor decisivo',
    texto: 'Con 54% de antivoto, Keiko Fujimori es la candidata que más unifica al electorado en su contra. Si pasa a segunda vuelta, sus rivales se beneficiarían del voto anti-fujimorista. Es su cuarto intento presidencial y el mismo patrón se repite.',
  },
  {
    titulo: '📊 37% de indecisos y ninguno',
    texto: 'El bloque de indecisos (15.2%) + voto blanco/viciado (21.5%) supera al líder. Esto significa que la carrera está completamente abierta y las encuestas pueden cambiar dramáticamente en las últimas semanas.',
  },
  {
    titulo: '⚠️ El efecto Grozo',
    texto: 'Wolfgang Grozo venía creciendo pero el escándalo de sus reuniones con Zamir Villaverde (investigado por corrupción en Odebrecht) aún no está reflejado en las encuestas de mediados de marzo. Podría derrumbar su candidatura.',
  },
]

const ESCENARIOS_2V = [
  { a: 'López Aliaga', b: 'Keiko', ganador: 'López Aliaga', prob: 75, razon: 'El anti-Keiko unifica al electorado. López Aliaga se convierte en el voto útil anti-fujimorismo.' },
  { a: 'López Aliaga', b: 'López Chau', ganador: 'Incierto', prob: 50, razon: 'López Chau tiene menos antivoto y perfil técnico. Sería la carrera más pareja.' },
  { a: 'Keiko', b: 'López Chau', ganador: 'López Chau', prob: 70, razon: 'El 54% de antivoto de Keiko convierte a cualquier rival con perfil moderado en favorito.' },
]

export default function EleccionesPage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-red-400 uppercase tracking-widest mb-1">🇵🇪 Análisis Electoral · INFRATEK AI</div>
              <h1 className="text-2xl font-black">¿Quién ganará las elecciones del Perú?</h1>
              <p className="text-zinc-400 text-sm mt-1">Elecciones Generales 2026 · Primera Vuelta: 12 de abril</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-4xl font-black text-red-400">{DAYS_LEFT}</div>
              <div className="text-zinc-500 text-xs">días restantes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

        {/* Polls bar chart */}
        <section>
          <h2 className="text-lg font-bold mb-1">Intención de voto — Datum Internacional, 16 mar 2026</h2>
          <p className="text-zinc-500 text-xs mb-5">Fuente: Infobae Perú · Encuesta Nacional · n≈1,200</p>
          <div className="space-y-3">
            {CANDIDATES.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setSelected(selected === i ? null : i)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-zinc-500 text-xs w-4">{c.rank}</span>
                  <span className="font-medium text-sm flex-1">{c.name}</span>
                  <span className="text-zinc-400 text-xs">{c.party}</span>
                  <span className="font-bold text-sm w-12 text-right">{c.poll}%</span>
                  <span className={`text-sm w-4 ${c.trend === '↗' ? 'text-green-400' : c.trend === '↘' ? 'text-red-400' : 'text-zinc-500'}`}>{c.trend}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4" />
                  <div className="flex-1 bg-zinc-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${(c.poll / 15) * 100}%`, backgroundColor: c.color }}
                    />
                  </div>
                  <div className="w-4" />
                  <div className="w-12" />
                  <div className="w-4" />
                </div>
                {selected === i && (
                  <div className="mt-3 ml-7 bg-zinc-900 rounded-xl p-4 border border-zinc-700 text-sm space-y-2">
                    <p className="text-zinc-300">{c.perfil}</p>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <div className="text-green-400 text-xs font-bold mb-1">✓ Fortaleza</div>
                        <p className="text-zinc-400 text-xs">{c.fortaleza}</p>
                      </div>
                      <div>
                        <div className="text-red-400 text-xs font-bold mb-1">✗ Debilidad</div>
                        <p className="text-zinc-400 text-xs">{c.debilidad}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-zinc-700">
                      <div className="text-xs text-zinc-500">Antivoto: <span className={`font-bold ${c.antivoto > 40 ? 'text-red-400' : c.antivoto > 25 ? 'text-yellow-400' : 'text-green-400'}`}>{c.antivoto}%</span></div>
                      <p className="text-zinc-400 text-xs mt-1">{c.escenario2v}</p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-zinc-600">
            <span>Indecisos: 15.2%</span>
            <span>Blanco/viciado: 21.5%</span>
            <span className="text-zinc-500">Click en candidato para análisis</span>
          </div>
        </section>

        {/* Analysis */}
        <section>
          <h2 className="text-lg font-bold mb-4">Factores clave</h2>
          <div className="space-y-3">
            {ANALISIS.map(a => (
              <div key={a.titulo} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="font-bold text-sm mb-1">{a.titulo}</div>
                <p className="text-zinc-400 text-sm">{a.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Segunda vuelta scenarios */}
        <section>
          <h2 className="text-lg font-bold mb-4">Escenarios de segunda vuelta</h2>
          <div className="space-y-3">
            {ESCENARIOS_2V.map(e => (
              <div key={e.a + e.b} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm">{e.a}</span>
                  <span className="text-zinc-600 text-xs">vs.</span>
                  <span className="font-bold text-sm">{e.b}</span>
                  <span className="ml-auto text-xs text-green-400 font-bold">Proyección: {e.ganador}</span>
                </div>
                <p className="text-zinc-400 text-sm">{e.razon}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prediction */}
        <section className="bg-gradient-to-br from-blue-900/30 to-zinc-900 border border-blue-700 rounded-2xl p-6">
          <div className="text-xs text-blue-400 uppercase tracking-widest mb-2">Proyección INFRATEK AI</div>
          <h2 className="text-xl font-black mb-3">¿Quién gana?</h2>
          <div className="space-y-3 text-sm text-zinc-300">
            <p><span className="font-bold text-white">Primera vuelta más probable:</span> López Aliaga y Keiko Fujimori pasan a segunda vuelta, con la posibilidad real de que López Chau desplace a Keiko si el escándalo Grozo redistribuye votos.</p>
            <p><span className="font-bold text-white">Segunda vuelta:</span> Si es López Aliaga vs Keiko, López Aliaga gana por márgenes amplios gracias al voto anti-Keiko que se une masivamente contra el fujimorismo.</p>
            <p><span className="font-bold text-white">Escenario sorpresa:</span> Si López Chau o un candidato con bajo antivoto llega a segunda vuelta contra Keiko, sería el nuevo presidente. El 37% de indecisos puede producir resultados inesperados.</p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-800 flex items-center justify-between">
            <div className="text-blue-300 font-bold">Ganador más probable: <span className="text-white">Rafael López Aliaga</span></div>
            <div className="text-zinc-500 text-xs">Confianza: media-alta · Datos al 16 mar 2026</div>
          </div>
          <p className="mt-3 text-zinc-600 text-xs">⚠️ Análisis basado en datos públicos de encuestadoras. No es endorsement político. Las elecciones son dinámicas y los indecisos pueden cambiar el resultado.</p>
        </section>

        <div className="text-center text-zinc-700 text-xs pb-4">
          Construido con INFRATEK AI · Análisis basado en datos de Datum Internacional, Ipsos Perú, Infobae, La República
        </div>
      </div>
    </div>
  )
}
