import { useState } from 'react'
import { TRILHAS, CATEGORIAS, ENUNCIADOS, XP_CONFIG, getPlaygroundUrl } from '../data.js'

export default function ViewDesafio() {
  const [tecSel,  setTec]      = useState(TRILHAS[0].tecnologia)
  const [catSel,  setCat]      = useState('')
  const [desafio, setDesafio]  = useState(null)

  function gerar() {
    const trilha    = TRILHAS.find(t => t.tecnologia === tecSel)
    const nivel     = trilha?.nivel || 'Intermediário'
    const categoria = catSel || CATEGORIAS[Math.floor(Math.random() * CATEGORIAS.length)]
    const cfg       = XP_CONFIG[nivel] || XP_CONFIG['Intermediário']
    const enunciado = ENUNCIADOS[categoria] || `Resolva um problema de ${categoria} usando ${tecSel}.`
    const url       = getPlaygroundUrl(tecSel)

    setDesafio({ tecnologia: tecSel, nivel, categoria, cfg, enunciado, url })
    setTimeout(() => document.getElementById('desafio-result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white mb-1">⚔️ Gerar Desafio de Código</h1>
        <p className="text-gray-400">Selecione a tecnologia e categoria para receber um desafio calibrado ao nível da trilha.</p>
      </div>

      {/* Formulário */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-lg mb-8 flex flex-col gap-4">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Tecnologia</label>
          <select
            value={tecSel}
            onChange={e => setTec(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg
                       px-3 py-2.5 text-sm outline-none focus:border-orange-500 transition-colors"
          >
            {TRILHAS.map(t => (
              <option key={t.id} value={t.tecnologia}>{t.tecnologia} — {t.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">
            Categoria <span className="text-gray-500 normal-case">(opcional)</span>
          </label>
          <select
            value={catSel}
            onChange={e => setCat(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg
                       px-3 py-2.5 text-sm outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">🎲 Sortear aleatoriamente</option>
            {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <button
          onClick={gerar}
          className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold
                     px-6 py-2.5 rounded-lg text-sm transition-all self-start"
        >
          ⚔️ Gerar Desafio
        </button>
      </div>

      {/* Resultado */}
      {desafio && (
        <div id="desafio-result" className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-700">
            <div>
              <h2 className="text-lg font-extrabold text-white">⚔️ {desafio.tecnologia}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{desafio.categoria}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30
                               px-3 py-1 rounded-full font-semibold">
                ⭐ {desafio.cfg.xp.toLocaleString('pt-BR')} XP
              </span>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30
                               px-3 py-1 rounded-full font-semibold">
                ⏱️ {desafio.cfg.tempo}
              </span>
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30
                               px-3 py-1 rounded-full font-semibold">
                🎯 {desafio.nivel}
              </span>
            </div>
          </div>

          {/* Enunciado */}
          <div className="mb-5">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-3">📝 Enunciado</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono
                            bg-gray-900 rounded-lg p-4 leading-relaxed border border-gray-700">
              {desafio.enunciado}
            </pre>
          </div>

          {/* Dicas */}
          <div className="mb-6">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-3">💡 Dicas</h3>
            <ul className="text-sm text-gray-300 space-y-1 pl-4 list-disc">
              <li>Comece pelos casos mais simples (happy path).</li>
              <li>Trate os casos extremos: array vazio, null, zero.</li>
              <li>Escreva um teste antes de implementar (TDD).</li>
            </ul>
          </div>

          {/* Critérios */}
          <div className="mb-6">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-3">✅ Critérios de Aceite</h3>
            <ul className="text-sm text-gray-300 space-y-1 pl-4 list-disc">
              <li>Todos os casos de teste passam.</li>
              <li>Sem uso de bibliotecas externas.</li>
              <li>Código limpo e comentado.</li>
            </ul>
          </div>

          {/* CTA — resolver online */}
          <div className="bg-blue-500/5 border border-blue-500/25 rounded-xl p-4 flex flex-col sm:flex-row
                          items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Pronto para resolver?</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Abra o playground online recomendado para <strong className="text-white">{desafio.tecnologia}</strong> e resolva agora mesmo.
              </p>
            </div>
            <a
              href={desafio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold
                         px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2"
            >
              💻 Resolver Online
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
