'use client'

import { useState } from 'react'

const INCONSISTENCIAS = [
  {
    id: 'INC-001',
    partida: 'C.01.02',
    nombre: 'Concreto f\'c=280 kg/cm²',
    tipo: 'CRÍTICO',
    problema: 'La Especificación Técnica exige curado de 14 días. La Base de Medición y Pago no incluye pago por curado. El plano estructural E-08 muestra nota "curado mínimo 7 días".',
    docs: ['ETP Sección 3.2.1', 'BMP-Item 4.5', 'Plano E-08'],
  },
  {
    id: 'INC-002',
    partida: 'E.03.07',
    nombre: 'Acero de Refuerzo fy=4200 kg/cm²',
    tipo: 'ALTO',
    problema: 'La Planilla de Cotización usa la unidad "kg" pero la Base de Medición y Pago establece "ton". El precio unitario difiere en factor 1000.',
    docs: ['Planilla Cotización Fila 47', 'BMP-Item 7.2', 'ETP Sección 5.1'],
  },
  {
    id: 'INC-003',
    partida: 'A.04.01',
    nombre: 'Impermeabilización de Cisterna',
    tipo: 'ALTO',
    problema: 'El plano sanitario S-03 indica membrana asfáltica de 4mm. La Especificación Técnica solo define membrana de 3mm. La BMP no especifica espesor.',
    docs: ['Plano S-03', 'ETP Sección 8.4.2', 'BMP-Item 12.1'],
  },
  {
    id: 'INC-004',
    partida: 'S.02.03',
    nombre: 'Tubería HDPE DN200',
    tipo: 'MEDIO',
    problema: 'Partida aparece en Planilla de Cotización pero no está identificada en los planos sanitarios ni en la Especificación Técnica correspondiente.',
    docs: ['Planilla Cotización Fila 89', 'ETP (no encontrado)', 'Planos S-01 a S-07 (no encontrado)'],
  },
  {
    id: 'INC-005',
    partida: 'M.01.05',
    nombre: 'Ventanas de Aluminio Sistema 35',
    tipo: 'MEDIO',
    problema: 'La ETP exige acabado anodizado natural. El plano de arquitectura A-12 indica acabado color Champagne. La BMP no especifica color.',
    docs: ['ETP Sección 11.2', 'Plano A-12 Detalle 4', 'BMP-Item 15.3'],
  },
]

const DOCS = [
  { id: 'etp', label: 'Especificaciones Técnicas', icon: '📋', ext: 'PDF / DOCX' },
  { id: 'bmp', label: 'Bases de Medición y Pago', icon: '📐', ext: 'PDF / DOCX' },
  { id: 'planilla', label: 'Planilla de Cotización', icon: '📊', ext: 'XLSX / CSV' },
  { id: 'planos', label: 'Planos del Proyecto', icon: '🗺️', ext: 'PDF / DWG / IFC' },
]

type Phase = 'upload' | 'analyzing' | 'results'

export default function CostapiApp() {
  const [phase, setPhase] = useState<Phase>('upload')
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState(0)
  const [activeFilter, setActiveFilter] = useState<string>('TODOS')

  const allUploaded = DOCS.every(d => uploaded[d.id])

  function handleUpload(id: string) {
    setUploaded(prev => ({ ...prev, [id]: true }))
  }

  function startAnalysis() {
    setPhase('analyzing')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setPhase('results')
          return 100
        }
        return p + 5
      })
    }, 120)
  }

  const filtered = activeFilter === 'TODOS'
    ? INCONSISTENCIAS
    : INCONSISTENCIAS.filter(i => i.tipo === activeFilter)

  const counts = {
    CRÍTICO: INCONSISTENCIAS.filter(i => i.tipo === 'CRÍTICO').length,
    ALTO: INCONSISTENCIAS.filter(i => i.tipo === 'ALTO').length,
    MEDIO: INCONSISTENCIAS.filter(i => i.tipo === 'MEDIO').length,
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-green-400 uppercase tracking-widest mb-1">WAGI · Powered by INFRATEK AI</div>
            <h1 className="text-xl font-bold">Análisis de Consistencia Documental</h1>
            <p className="text-zinc-400 text-sm mt-0.5">COSAPI · Área de Propuestas y Licitaciones</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-zinc-400">Agentes activos</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* PHASE 1: UPLOAD */}
        {phase === 'upload' && (
          <div>
            <h2 className="text-lg font-bold mb-2">1. Carga los documentos del proyecto</h2>
            <p className="text-zinc-400 text-sm mb-6">
              El agente leerá todos los documentos y cruzará automáticamente la información para detectar inconsistencias entre especificaciones, bases de pago, planillas y planos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {DOCS.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => handleUpload(doc.id)}
                  className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
                    uploaded[doc.id]
                      ? 'border-green-600 bg-green-900/20'
                      : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900'
                  }`}
                >
                  <div className="text-3xl mb-3">{doc.icon}</div>
                  <div className="font-bold text-sm mb-1">{doc.label}</div>
                  <div className="text-zinc-500 text-xs">{doc.ext}</div>
                  {uploaded[doc.id] ? (
                    <div className="mt-3 text-green-400 text-xs font-bold">✓ Documento cargado</div>
                  ) : (
                    <div className="mt-3 text-zinc-600 text-xs">Click para cargar</div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={startAnalysis}
              disabled={!allUploaded}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                allUploaded
                  ? 'bg-green-500 hover:bg-green-400 text-black'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {allUploaded ? '→ Analizar Inconsistencias' : `Carga los ${DOCS.filter(d => !uploaded[d.id]).length} documento(s) restante(s)`}
            </button>
          </div>
        )}

        {/* PHASE 2: ANALYZING */}
        {phase === 'analyzing' && (
          <div className="py-16 text-center">
            <div className="text-5xl mb-6">🤖</div>
            <h2 className="text-xl font-bold mb-2">Analizando documentos...</h2>
            <p className="text-zinc-400 text-sm mb-8">
              El agente está leyendo y cruzando {DOCS.length} documentos simultáneamente
            </p>
            <div className="bg-zinc-800 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-zinc-400 text-sm mb-8">{progress}% completado</div>
            <div className="text-left bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-xs text-zinc-500 font-mono space-y-1">
              {progress > 10 && <div className="text-green-400">✓ Leyendo Especificaciones Técnicas (PDF)...</div>}
              {progress > 25 && <div className="text-green-400">✓ Procesando Bases de Medición y Pago...</div>}
              {progress > 45 && <div className="text-green-400">✓ Indexando Planilla de Cotización (487 partidas)...</div>}
              {progress > 60 && <div className="text-green-400">✓ Analizando planos (23 láminas)...</div>}
              {progress > 75 && <div className="text-yellow-400">⚡ Cruzando referencias entre documentos...</div>}
              {progress > 90 && <div className="text-yellow-400">⚡ Clasificando inconsistencias por criticidad...</div>}
            </div>
          </div>
        )}

        {/* PHASE 3: RESULTS */}
        {phase === 'results' && (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Inconsistencias detectadas</h2>
                <p className="text-zinc-400 text-sm mt-1">
                  Análisis de 487 partidas · 23 láminas de planos · 4 documentos
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-red-400">{INCONSISTENCIAS.length}</div>
                <div className="text-zinc-500 text-xs">inconsistencias</div>
              </div>
            </div>

            {/* Summary pills */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {[
                { label: 'TODOS', count: INCONSISTENCIAS.length, color: 'zinc' },
                { label: 'CRÍTICO', count: counts.CRÍTICO, color: 'red' },
                { label: 'ALTO', count: counts.ALTO, color: 'orange' },
                { label: 'MEDIO', count: counts.MEDIO, color: 'yellow' },
              ].map(f => (
                <button
                  key={f.label}
                  onClick={() => setActiveFilter(f.label)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    activeFilter === f.label
                      ? 'bg-green-400 text-black border-green-400'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            {/* Results list */}
            <div className="space-y-4">
              {filtered.map(inc => (
                <div key={inc.id} className={`bg-zinc-900 rounded-xl p-5 border ${
                  inc.tipo === 'CRÍTICO' ? 'border-red-700' :
                  inc.tipo === 'ALTO' ? 'border-orange-700' : 'border-yellow-700'
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-zinc-500 text-xs font-bold">{inc.id}</span>
                        <span className="text-zinc-500 text-xs">·</span>
                        <span className="text-zinc-500 text-xs font-mono">{inc.partida}</span>
                      </div>
                      <div className="font-bold">{inc.nombre}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold shrink-0 ${
                      inc.tipo === 'CRÍTICO' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                      inc.tipo === 'ALTO' ? 'bg-orange-900/50 text-orange-300 border border-orange-700' :
                      'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                    }`}>
                      {inc.tipo}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-3">{inc.problema}</p>
                  <div className="flex gap-2 flex-wrap">
                    {inc.docs.map(d => (
                      <span key={d} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700">{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-8 bg-green-900/20 border border-green-700 rounded-xl p-5">
              <div className="text-green-400 font-bold mb-1">¿Qué sigue?</div>
              <p className="text-zinc-300 text-sm">Este análisis habría tomado 2-3 semanas de revisión manual. El agente lo completó en segundos. Con WAGI, tu equipo puede procesar cualquier proyecto antes de cotizar.</p>
              <div className="mt-3 text-xs text-zinc-500">infratek.ai · WAGI Platform · Construido en vivo en GTC 2026 Lima 🇵🇪</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
