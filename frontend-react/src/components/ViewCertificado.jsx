import { useState, useRef } from 'react'
import { TRILHAS, gerarCodigoCertificado, formatData } from '../data.js'

export default function ViewCertificado() {
  const [nome,      setNome]   = useState('')
  const [tecSel,    setTec]    = useState(TRILHAS[0].tecnologia)
  const [cert,      setCert]   = useState(null)
  const [copiado,   setCop]    = useState(false)
  const certRef = useRef(null)

  function gerar() {
    if (!nome.trim()) { alert('Por favor, insira seu nome completo.'); return }
    const trilha = TRILHAS.find(t => t.tecnologia === tecSel)
    if (!trilha) return
    const ano    = new Date().getFullYear()
    const codigo = gerarCodigoCertificado(trilha.id, nome.trim(), ano)
    const data   = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    setCert({ nome: nome.trim(), trilha, codigo, data })
    setTimeout(() => certRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
  }

  function copiarLink() {
    navigator.clipboard.writeText(
      `https://www.dio.me/certificate/${cert.codigo}`
    ).then(() => { setCop(true); setTimeout(() => setCop(false), 2500) })
  }

  function imprimir() {
    window.print()
  }

  const shareText = cert
    ? `🏆 Acabei de concluir a ${cert.trilha.nome} na @DIO_oficial! Certificado: ${cert.codigo} #DIO #BobAI`
    : ''

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white mb-1">🏆 Emitir Certificado</h1>
        <p className="text-gray-400">Preencha os dados para gerar seu certificado da trilha concluída.</p>
      </div>

      {/* Formulário */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-lg mb-10 flex flex-col gap-4">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Seu nome completo</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && gerar()}
            placeholder="Ex: Ana Lima"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg
                       px-3 py-2.5 text-sm outline-none placeholder-gray-500
                       focus:border-orange-500 transition-colors"
          />
        </div>
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
        <button
          onClick={gerar}
          className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold
                     px-6 py-2.5 rounded-lg text-sm transition-all self-start"
        >
          🏆 Emitir Certificado
        </button>
      </div>

      {/* Certificado estilo PDF */}
      {cert && (
        <div ref={certRef} className="max-w-2xl">

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-2 mb-4 print:hidden">
            <button
              onClick={imprimir}
              className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold
                         px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              🖨️ Salvar / Imprimir PDF
            </button>
            <button
              onClick={copiarLink}
              className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold
                         px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copiado ? '✅ Link copiado!' : '🔗 Copiar Link'}
            </button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.dio.me/certificate/' + cert.codigo)}&summary=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold
                         px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LinkedInIcon /> LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold
                         px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <XIcon /> X / Twitter
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + '\nhttps://www.dio.me/certificate/' + cert.codigo)}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-green-700 hover:bg-green-600 text-white text-xs font-bold
                         px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
          </div>

          {/* Cartão PDF */}
          <div id="cert-pdf" className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl
                                         border border-gray-200 print:shadow-none print:rounded-none">
            {/* Topo colorido */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <div className="text-2xl font-black tracking-tight">🤖 DIO</div>
                  <div className="text-sm opacity-80">Digital Innovation One</div>
                </div>
                <div className="text-white text-right">
                  <div className="text-xs opacity-70 uppercase tracking-widest">Certificado de Conclusão</div>
                  <div className="font-mono text-sm font-bold mt-1">{cert.codigo}</div>
                </div>
              </div>
            </div>

            {/* Corpo */}
            <div className="px-8 py-8">
              <p className="text-sm text-gray-500 mb-1 uppercase tracking-widest">Certificamos que</p>
              <h2 className="text-3xl font-black text-gray-900 mb-5 border-b-2 border-orange-400 pb-4">
                {cert.nome}
              </h2>

              <p className="text-sm text-gray-500 mb-1">concluiu com êxito a trilha de aprendizado:</p>
              <h3 className="text-xl font-extrabold text-gray-800 mb-4">{cert.trilha.nome}</h3>

              {/* Detalhes da trilha */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { lbl: 'Tecnologia',    val: cert.trilha.tecnologia },
                  { lbl: 'Nível',         val: cert.trilha.nivel },
                  { lbl: 'Módulos',       val: cert.trilha.numero_de_modulos },
                ].map(s => (
                  <div key={s.lbl} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <div className="font-bold text-gray-800 text-sm">{s.val}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.lbl}</div>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">🏅 Badges Conquistadas</p>
                <div className="flex flex-wrap gap-2">
                  {cert.trilha.badges_disponiveis.map(b => (
                    <span key={b} className="bg-orange-50 text-orange-700 border border-orange-200
                                             text-xs px-3 py-1 rounded-full font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rodapé do cert */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-400">
                <span>📅 Emitido em {cert.data}</span>
                <span className="font-mono text-gray-500">🔑 {cert.codigo}</span>
              </div>
              <div className="mt-2 text-xs text-blue-500 hover:underline">
                <a href={`https://www.dio.me/certificate/${cert.codigo}`} target="_blank" rel="noopener noreferrer">
                  Verificar em dio.me/certificate/{cert.codigo}
                </a>
              </div>
            </div>

            {/* Rodapé da marca */}
            <div className="bg-gray-50 border-t border-gray-100 px-8 py-3 text-xs text-gray-400 text-center">
              Feito com 🤖 IBM Bob AI · #DIO #BobAI #MCP
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Ícones inline ── */
function LinkedInIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853
               0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9
               1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
               7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782
               13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0
               1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24
               22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401
               6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161
               17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
               -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475
               -.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
               .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207
               -.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
               -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096
               3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085
               1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.521 5.855L.057 23.925
               a.5.5 0 00.617.617l6.07-1.464A11.942 11.942 0 0012 24c6.627 0 12-5.373
               12-12S18.627 0 12 0zm0 21.9a9.87 9.87 0 01-5.03-1.381l-.36-.214-3.733.9.919-3.633
               -.234-.374A9.862 9.862 0 012.1 12C2.1 6.527 6.527 2.1 12 2.1c5.474 0 9.9 4.427
               9.9 9.9 0 5.474-4.426 9.9-9.9 9.9z"/>
    </svg>
  )
}
