import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import ViewTrilhas from './components/ViewTrilhas.jsx'
import ViewDesafio from './components/ViewDesafio.jsx'
import ViewCertificado from './components/ViewCertificado.jsx'

export default function App() {
  const [view, setView] = useState('trilhas')

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar view={view} setView={setView} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
        {view === 'trilhas'     && <ViewTrilhas />}
        {view === 'desafio'     && <ViewDesafio />}
        {view === 'certificado' && <ViewCertificado />}
      </main>

      <footer className="bg-gray-900 border-t border-gray-700 text-center py-4
                         text-xs text-gray-500">
        Feito com 🤖 <strong className="text-gray-300">IBM Bob AI</strong> + ☕ café
        &nbsp;·&nbsp; #DIO #BobAI #MCP
      </footer>
    </div>
  )
}
