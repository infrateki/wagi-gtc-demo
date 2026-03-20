'use client'

import { useState } from 'react'

// CONFIG — updated live based on audience diagnostic
const CONFIG = {
  projectName: "Proyecto Piloto GTC 2026",
  company: "Constructora Perú",
  activeModules: ['rfi', 'dashboard', 'clashes', 'reportes'],
}

const MODULES = {
  dashboard: { label: 'Dashboard KPIs', icon: '📊', color: 'green' },
  rfi: { label: 'Control RFIs', icon: '📋', color: 'blue' },
  clashes: { label: 'Coordinación BIM', icon: '🔧', color: 'orange' },
  reportes: { label: 'Reportes Auto', icon: '📄', color: 'purple' },
  cambios: { label: 'Control Cambios', icon: '⚡', color: 'yellow' },
  valorizaciones: { label: 'Valorizaciones', icon: '💰', color: 'red' },
}

// Sample data — will be customized based on audience answers
const SAMPLE_RFIS = [
  { id: 'RFI-001', title: 'Conflicto entre viga V-12 y ducto HVAC-03', status: 'ABIERTO', days: 18, priority: 'CRÍTICO' },
  { id: 'RFI-002', title: 'Especificación de acero de refuerzo en zapata Z-08', status: 'EN REVISIÓN', days: 7, priority: 'ALTO' },
  { id: 'RFI-003', title: 'Detalle de impermeabilización en junta de dilatación', status: 'RESPONDIDO', days: 3, priority: 'MEDIO' },
]

const SAMPLE_KPIS = [
  { label: 'Avance Físico', value: '67%', target: '72%', delta: '-5%', status: 'warning' },
  { label: 'Avance Financiero', value: '71%', target: '70%', delta: '+1%', status: 'ok' },
  { label: 'RFIs Abiertos', value: '23', target: '<10', delta: '+13', status: 'critical' },
  { label: 'SPI (Cronograma)', value: '0.93', target: '≥0.95', delta: '-0.02', status: 'warning' },
  { label: 'CPI (Costo)', value: '1.02', target: '≥0.95', delta: '+0.07', status: 'ok' },
  { label: 'RFIs >15 días', value: '8', target: '0', delta: '+8', status: 'critical' },
]

const SAMPLE_CLASHES = [
  { id: 'CLH-047', description: 'Viga metálica vs. tubería hidráulica DN100', location: 'Nivel 4 - Eje C-7', severity: 'Duro', status: 'SIN RESOLVER' },
  { id: 'CLH-048', description: 'Ducto HVAC vs. cable bandeja eléctrica', location: 'Nivel 2 - Área Técnica', severity: 'Duro', status: 'SIN RESOLVER' },
  { id: 'CLH-049', description: 'Columna C-23 vs. tubería desagüe DN200', location: 'Sótano 1', severity: 'Duro', status: 'EN PROCESO' },
]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'ABIERTO': 'bg-red-900/50 text-red-300 border border-red-700',
    'EN REVISIÓN': 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
    'RESPONDIDO': 'bg-green-900/50 text-green-300 border border-green-700',
    'SIN RESOLVER': 'bg-red-900/50 text-red-300 border border-red-700',
    'EN PROCESO': 'bg-blue-900/50 text-blue-300 border border-blue-700',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || 'bg-zinc-800 text-zinc-400'}`}>
      {status}
    </span>
  )
}

function KPICard({ label, value, target, delta, status }: typeof SAMPLE_KPIS[0]) {
  const colors = { ok: 'border-green-700 bg-green-900/20', warning: 'border-yellow-700 bg-yellow-900/20', critical: 'border-red-700 bg-red-900/20' }
  const textColors = { ok: 'text-green-400', warning: 'text-yellow-400', critical: 'text-red-400' }
  return (
    <div className={`p-4 rounded-xl border ${colors[status as keyof typeof colors]}`}>
      <div className="text-zinc-400 text-xs mb-1">{label}</div>
      <div className={`text-3xl font-black ${textColors[status as keyof typeof textColors]}`}>{value}</div>
      <div className="text-zinc-500 text-xs mt-1">Meta: {target} <span className={delta.startsWith('-') ? 'text-red-400' : 'text-green-400'}>{delta}</span></div>
    </div>
  )
}

export default function WagiDemo() {
  const [activeTab, setActiveTab] = useState<string>('dashboard')

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-green-400 uppercase tracking-widest mb-1">WAGI — Plataforma de Gestión Inteligente</div>
          <h1 className="text-xl font-bold">{CONFIG.projectName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-zinc-400">INFRATEK AI — Agentes activos</span>
        </div>
      </div>

      {/* Nav */}
      <div className="border-b border-zinc-800 px-6 flex gap-1 overflow-x-auto">
        {CONFIG.activeModules.map(mod => {
          const m = MODULES[mod as keyof typeof MODULES]
          return (
            <button key={mod}
              onClick={() => setActiveTab(mod)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === mod ? 'border-green-400 text-green-400' : 'border-transparent text-zinc-400 hover:text-white'
              }`}>
              {m.icon} {m.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-lg font-bold mb-4">Estado del Proyecto — Semana 24</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {SAMPLE_KPIS.map(kpi => <KPICard key={kpi.label} {...kpi} />)}
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-sm font-bold text-green-400 mb-2">🤖 WAGI — Análisis Automático</div>
              <p className="text-zinc-300 text-sm">El avance físico está 5% por debajo de lo programado. Principal causa: 23 RFIs abiertos generan espera en cuadrillas de estructura. Se recomienda priorizar respuesta a RFIs críticos en próximas 48 horas para recuperar SPI.</p>
            </div>
          </div>
        )}

        {activeTab === 'rfi' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Control de RFIs</h2>
              <div className="text-sm text-red-400 font-medium">⚠️ 8 RFIs con más de 15 días sin respuesta</div>
            </div>
            <div className="space-y-3">
              {SAMPLE_RFIS.map(rfi => (
                <div key={rfi.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">{rfi.id}</div>
                      <div className="font-medium text-sm">{rfi.title}</div>
                      <div className="text-xs text-zinc-500 mt-1">{rfi.days} días en espera</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={rfi.status} />
                      <span className={`text-xs font-bold ${rfi.priority === 'CRÍTICO' ? 'text-red-400' : rfi.priority === 'ALTO' ? 'text-yellow-400' : 'text-zinc-400'}`}>
                        {rfi.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clashes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Coordinación BIM — Interferencias Activas</h2>
              <div className="text-sm text-red-400 font-medium">⚠️ 47 interferencias duras sin resolver</div>
            </div>
            <div className="space-y-3">
              {SAMPLE_CLASHES.map(c => (
                <div key={c.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">{c.id} · {c.location}</div>
                      <div className="font-medium text-sm">{c.description}</div>
                      <div className="text-xs text-yellow-500 mt-1">Tipo: {c.severity}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reportes' && (
          <div>
            <h2 className="text-lg font-bold mb-4">Generación Automática de Reportes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Reporte Semanal de Avance', 'Informe de RFIs para Subcontratistas', 'Dashboard Ejecutivo (PDF)', 'Reporte de Valorizaciones'].map(r => (
                <div key={r} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{r}</div>
                    <div className="text-xs text-zinc-500 mt-1">Generado automáticamente · WAGI</div>
                  </div>
                  <button className="text-xs bg-green-900/50 text-green-400 border border-green-700 px-3 py-1.5 rounded-lg hover:bg-green-900">
                    Generar PDF
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-zinc-900 rounded-xl p-4 border border-green-800">
              <div className="text-sm font-bold text-green-400 mb-1">⏱️ Tiempo ahorrado esta semana</div>
              <div className="text-4xl font-black text-white">6.5 horas</div>
              <div className="text-zinc-400 text-xs mt-1">Antes: reportes manuales en Excel</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="text-xs text-zinc-600">Construido en vivo · GTC 2026 Lima · INFRATEK AI</div>
        <div className="text-xs text-green-400">infratek.ai</div>
      </div>
    </div>
  )
}
