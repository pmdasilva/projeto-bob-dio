import { formatData } from '../data.js'
import { NIVEL_COLORS } from './nivelColors.js'

export default function TrilhaDetalhe({ trilha: t, onBack }) {
  const temPromo = t.promocoes?.desconto && t.promocoes.desconto !== '0%'
  const { badge, text } = NIVEL_COLORS[t.nivel] || NIVEL_COLORS['Intermediário']

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 border border-gray-600 text-gray-400 hover:text-white
                   hover:border-gray-400 px-4 py-2 rounded-lg text-sm transition-colors"
      >
        ← Voltar
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-1">{t.nome}</h2>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            🔧 {t.tecnologia}
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge} ${text}`}>
              {t.nivel}
            </span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { num: t.numero_de_modulos, lbl: 'Módulos' },
          { num: t.xp_total.toLocaleString('pt-BR'), lbl: 'XP Total' },
          { num: t.badges_disponiveis.length, lbl: 'Badges' },
          { num: t.lives_ao_vivo.length, lbl: 'Lives' },
        ].map(s => (
          <div key={s.lbl} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-orange-400">{s.num}</div>
            <div className="text-xs text-gray-400 mt-1">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Promoção */}
      {temPromo && (
        <div className="bg-amber-500/5 border border-amber-500/25 rounded-xl p-5 mb-6">
          <h3 className="text-amber-400 font-bold mb-2">🔥 Promoção Ativa</h3>
          <div className="text-3xl font-black text-amber-400 mb-1">{t.promocoes.desconto} OFF</div>
          <p className="text-sm text-gray-300">{t.promocoes.descricao}</p>
          <p className="text-xs text-gray-500 mt-1">Válido até {formatData(t.promocoes.validade)}</p>
        </div>
      )}

      {/* Badges + Lives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-4">🏅 Badges Conquistáveis</h3>
          <div className="flex flex-wrap gap-2">
            {t.badges_disponiveis.map(b => (
              <span key={b} className="bg-gray-700 border border-gray-600 text-white
                                       text-xs px-3 py-1 rounded-lg">
                🏅 {b}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-4">🎙️ Próximas Lives</h3>
          <div className="flex flex-col gap-3">
            {t.lives_ao_vivo.map((l, i) => (
              <div key={i} className="border-l-2 border-orange-500 pl-3">
                <div className="text-sm font-semibold text-white">{l.titulo}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  📅 {formatData(l.data)} às {l.horario} · 👤 {l.instrutor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
