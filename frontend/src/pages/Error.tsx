import { Link } from 'react-router-dom'
import logo from '../assets/pages/erro/logo.png'
import img404 from '../assets/pages/erro/404.png'

const Error = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-[#14231c] text-[#faf0d4]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0,0,0,.5) 50%, rgba(0,0,0,.3) 63%, rgba(0,0,0,0) 96%)',
      }}
    >
      <img src={logo} draggable="false" alt="Terra Viva" className="w-72 sm:w-[300px] max-w-full" />

      <img
        src={img404}
        alt="404"
        className="mt-6 w-full max-w-[756px] opacity-75"
        draggable="false"
      />

      <h1 className="-mt-2 text-center text-4xl sm:text-5xl font-bold">Página não encontrada</h1>

      <p className="mt-6 max-w-md text-center text-md sm:text-lg leading-snug">
        A página que você procura não existe, foi removida ou está temporariamente indisponível.
      </p>

      <Link
        to="/"
        className="mt-12 px-6 py-3 rounded-lg border border-black bg-[#a01f0f] hover:bg-[#8a1a0d] text-lg font-bold transition-colors"
      >
        Voltar tela de início.
      </Link>
    </div>
  )
}

export default Error