import { useState } from 'react'
import { TRILHAS } from '../data.js'
import TrilhaCard from './TrilhaCard.jsx'
import TrilhaDetalhe from './TrilhaDetalhe.jsx'

export default function ViewTrilhas() {
  const [busca, setBusca]         = useState('')
  const [inputBusca, setInput]    = useState('')
  const [filtroNivel, setFiltro]  = useState('all')
  const [selecionada, setSel]     = useState(null)

  const filtradas = TRILHAS.filter(t => {
    const matchNivel = filtroNivel === 'all' || t.nivel === filtroNivel
    const termo = busca.toLowerCase()
    const matchBusca = !termo ||
      t.nome.toLowerCase().includes(termo) ||
      t.tecnologia.toLowerCase().includes(termo)
    return matchNivel && matchBusca
  })

  function pesquisar(e) {
    e.preventDefault()
    setBusca(inputBusca)
  }

  if (selecionada) {
    return <TrilhaDetalhe trilha={selecionada} onBack={() => setSel(null)} />
  }

  return (
    <div>
      {/* Título */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white mb-1">Trilhas de Aprendizado</h1>
        <p className="text-gray-400">30 trilhas disponíveis — do básico ao avançado</p>
      </div>

      {/* Barra de busca */}
      <form onSubmit={pesquisar} className="flex gap-2 mb-4 max-w-xl">
        <input
          type="text"
          value={inputBusca}
          onChange={e => setInput(e.target.value)}
          placeholder="Buscar trilha… (ex: React, Python, AWS)"
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5
                     text-white placeholder-gray-500 text-sm outline-none
                     focus:border-orange-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-5 py-2.5
                     rounded-lg text-sm transition-colors"
        >
          🔍 Pesquisar
        </button>
        {busca && (
          <button
            type="button"
            onClick={() => { setBusca(''); setInput('') }}
            className="border border-gray-600 text-gray-400 hover:text-white px-3 py-2.5
                       rounded-lg text-sm transition-colors"
          >
            ✕
          </button>
        )}
      </form>

      {/* Filtros de nível */}
      <div className="flex gap-2 flex-wrap mb-8">
        {['all', 'Básico', 'Intermediário', 'Avançado'].map(n => (
          <button
            key={n}
            onClick={() => setFiltro(n)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all
              ${filtroNivel === n
                ? 'bg-blue-600 text-white border border-blue-600'
                : 'bg-gray-800 text-gray-400 border border-gray-600 hover:text-white hover:border-blue-500'
              }`}
          >
            {n === 'all' ? 'Todos' : n}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtradas.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-3">🔍</div>
          <p>Nenhuma trilha encontrada para <strong className="text-white">"{busca}"</strong></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtradas.map(t => (
            <TrilhaCard key={t.id} trilha={t} onClick={() => setSel(t)} />
          ))}
        </div>
      )}
    </div>
  )
}
