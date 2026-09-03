import { NIVEL_COLORS } from './nivelColors.js'

export default function TrilhaCard({ trilha: t, onClick }) {
  const temPromo = t.promocoes?.desconto && t.promocoes.desconto !== '0%'
  const { badge, text } = NIVEL_COLORS[t.nivel] || NIVEL_COLORS['Intermediário']

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 border border-gray-700 rounded-xl p-5 cursor-pointer
                 hover:-translate-y-1 hover:border-orange-500 hover:shadow-xl
                 transition-all duration-200 group relative overflow-hidden"
    >
      {/* barra top no hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r
                      from-orange-500 to-amber-400 scale-x-0 group-hover:scale-x-100
                      transition-transform duration-300 origin-left" />

      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-bold text-sm text-white leading-tight">{t.nome}</h3>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${badge} ${text}`}>
          {t.nivel}
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-4">🔧 {t.tecnologia}</p>

      <div className="flex gap-4 text-xs text-gray-400 mb-4">
        <span>📦 <strong className="text-white">{t.numero_de_modulos}</strong> módulos</span>
        <span>⭐ <strong className="text-white">{t.xp_total.toLocaleString('pt-BR')}</strong> XP</span>
      </div>

      {temPromo && (
        <span className="text-xs font-bold px-2.5 py-1 rounded-md
                         bg-amber-500/10 text-amber-400 border border-amber-500/30">
          🔥 {t.promocoes.desconto} OFF
        </span>
      )}
    </div>
  )
}
