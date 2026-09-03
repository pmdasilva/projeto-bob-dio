// Navbar com navegação entre as 3 views
export default function Navbar({ view, setView }) {
  const tabs = [
    { id: 'trilhas',      label: '📚 Trilhas' },
    { id: 'desafio',      label: '⚔️ Desafio' },
    { id: 'certificado',  label: '🏆 Certificado' },
  ]

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="text-2xl">🤖</span>
          <span className="text-white">DIO <span className="text-orange-500">Trilhas</span></span>
        </div>

        {/* Tabs */}
        <nav className="flex gap-2 flex-wrap justify-end">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${view === t.id
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500'
                  : 'text-gray-400 border border-transparent hover:text-white hover:border-gray-600 hover:bg-gray-800'
                }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
