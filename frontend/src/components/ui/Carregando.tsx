type CarregandoProps = {
    texto?: string
    /** true: ocupa a tela toda (padrão). false: bloco menor, para usar dentro de uma página. */
    telaCheia?: boolean
  }
  
  const Carregando = ({ texto = 'Carregando...', telaCheia = true }: CarregandoProps) => {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex flex-col items-center justify-center gap-4 text-gray-600 ${
          telaCheia ? 'min-h-screen bg-[#f4f3ee]' : 'py-10'
        }`}
      >
        <span
          aria-hidden="true"
          className="h-10 w-10 rounded-full border-4 border-green-800/20 border-t-green-800 motion-safe:animate-spin"
        />
        <p className="text-sm font-semibold">{texto}</p>
      </div>
    )
  }
  
  export default Carregando