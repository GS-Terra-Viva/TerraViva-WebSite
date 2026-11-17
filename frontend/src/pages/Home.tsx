import Navbar from "../components/ui/NavBar"
import { MapPin, FileText, ShieldCheck } from "lucide-react"
import Footer from "../components/ui/Footer";

import heroImg from "../assets/pages/home/img_2.png";
import potesImg from "../assets/pages/home/potes.png";
import mapaSP from "../assets/pages/home/mapaSP.svg";
import florestaImg from "../assets/pages/home/floresta.png";
import indigenaImg from "../assets/pages/home/ind2.png";
import { Link } from "react-router-dom";
import IMAGE_HERO from "../assets/pages/home/texto_hero.png"

const Home = () => {
  return (
    <div>
        <Navbar/>

{/*HERO*/}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImg})`
        }}        
      >

        <div className="absolute top-1/2 right-[12%] -translate-y-1/2">
        <img src={IMAGE_HERO} className="w-130 translate-y-26 pointer-events-none select-none" />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-full"
    style={{
      background: "linear-gradient(to bottom, transparent, #0B120D)"
    }}/>

      </section>

{/*DENUNCIA - CTA*/}
      <section className="relative bg-[#0B120D] px-8 pt-16 pb-24 md:px-20">

        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="text-3xl font-black leading-tight text-[#E53935] md:text-5xl">
             A terra tem voz. <br/> Sua denúncia também.
          </h2>

          <div className="flex flex-col items-start gap-5">
            <p className="text-sm" style={{ color: "#FAF0D4" }}>Respeito ao território. Cuidado com quem relata.
            </p>
            <Link
               to="/nova-denuncia"
               className="rounded-sm bg-[#B3261E] px-8 py-4 text-center text-sm font-bold transition-colors hover:bg-[#D32F2F]" style={{ color: "#FAF0D4" }}>
                Registrar uma denúncia
            </Link>
            </div>
        </div> 

        <svg
          className="absolute bottom-[-1px] left-0 w-full h-20"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 65 C400 20 850 120 1440 30 L1440 100 L0 100 Z"
            fill="#12241B"
          />
        </svg>

      </section>

{/*COMO FUNCIONA*/}
      <section className="bg-[#12241B] px-8 pt-8 pb-16 md:px-20">
        <div className="mx-auto max-w-7xl">

          <h2 className="text-3xl font-bold text-[#F5A000]">
            Sua voz abre caminhos.
          </h2>

          <p className="mt-3 text-sm font-bold uppercase text-[#77857C]">
            Do relato ao acompanhamento
          </p>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* CARD 01 */}
            <div className="rounded-md bg-[#2D4D40] p-6">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFF5E6]">01</span>
                <MapPin size={22} color="#FFF5E6" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-semibold text-[#FFF5E6]">
                Localize o ocorrido
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#A9B9AF]">
                Indique o município e o ponto no mapa de São Paulo.
                Uma referência próxima já ajuda.
              </p>
            </div>

            {/* CARD 02 */}
            <div className="rounded-md bg-[#2D4D40] p-6">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFF5E6]">02</span>
                <FileText size={22} color="#FFF5E6" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-semibold text-[#FFF5E6]">
                Conte o que aconteceu
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#A9B9AF]">
                Descreva a situação e adicione fotos ou documentos,
                sem colocar ninguém em risco.
              </p>
            </div>

            {/* CARD 03 */}
            <div className="rounded-md bg-[#2D4D40] p-6">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFF5E6]">03</span>
                <ShieldCheck size={22} color="#FFF5E6" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-semibold text-[#FFF5E6]">
                Acompanhe o relato
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#A9B9AF]">
                Consulte o protocolo e veja as atualizações da
                equipe responsável pela análise.
              </p>
            </div>

          </div>
        </div>
      </section>

{/*IMG POTES E TERRITÓRIOS*/}
      <section className="bg-[#12241B]">

        <div className="h-[450px] w-full overflow-hidden md:h-[650px]">
          <img
            src={potesImg}
            alt="Artesanato indígena"
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div
          className="relative bg-cover bg-center px-8 py-24 md:px-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(91, 20, 9, 0.91), rgba(91, 20, 9, 0.91)),
              url(${florestaImg})
            `,
          }}
        >
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">

            <div>
              <p className="mb-6 text-xs font-bold uppercase text-[#D69A45]">
                UM OLHAR PARA SÃO PAULO
              </p>

              <h2 className="text-4xl font-bold leading-tight text-[#FAF0D4] md:text-5xl">
                Cada território importa.
                <br />
                Cada relato, também.
              </h2>

              <p className="mt-6 max-w-md text-base leading-relaxed text-[#FAF0D4]">
                Invasões, desmatamento, queimadas e contaminação
                ameaçam a vida e os direitos dos povos indígenas.
              </p>

              <p className="mt-8 text-base font-medium leading-relaxed text-[#D69A45]">
                Nosso ponto de partida é São Paulo.
                <br />
                A defesa é de todos os territórios.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <img
                src={mapaSP}
                alt="Mapa ilustrativo do estado de São Paulo"
                className="h-auto w-full rounded-lg"
              />
            </div>

          </div>
        </div>

      </section>

{/*IMG INDIGENA E SEGURANÇA*/}
      <section className="bg-[#0B120D]">

        <div className="h-[350px] w-full overflow-hidden md:h-[600px]">
          <img
            src={indigenaImg}
            alt="Mulher indígena"
            className="h-full w-full object-cover object-top"
          />
        </div>

        
      <div className="bg-[#12241B] px-8 py-16 md:px-20 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">

          <div>
            <p className="mb-5 text-xs font-bold uppercase text-[#FAF0D4]">
              CUIDADO TAMBÉM É PROTEÇÃO
            </p>

            <h2 className="text-3xl font-bold leading-tight text-[#FAF0D4] md:text-4xl">
              Não coloque sua
              <br />
              segurança em risco.
            </h2>
          </div>

          <div className="space-y-8">
            <p className="text-sm leading-relaxed text-[#FAF0D4]">
              Registre apenas o que puder com segurança. Não se aproxime
              de áreas de conflito nem confronte os envolvidos para obter
              evidências.
            </p>

            <p className="text-sm leading-relaxed text-[#FAF0D4]">
              Sua localização exata não aparece em uma lista pública.
              Consulte nossa política de privacidade antes de enviar.
            </p>
          </div>

        </div>
      </div>


      </section>


{/*CTA 2*/}
      <section className="relative bg-black px-8 pb-20 md:px-20">

        <div className="mx-auto max-w-7xl">
          <div className="flex h-[4px] w-full">
            <div className="w-[33.33%] bg-[#E53935]" />
            <div className="w-[33.34%] bg-[#C5873D]" />
            <div className="w-[33.33%] bg-[#E53935]" />
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 pt-16 md:flex-row md:items-center">

          <h2
            className="text-3xl font-bold leading-tight md:text-5xl"
            style={{ color: "#C5833E" }}
          >
            O silêncio não protege.
            <br />
            A sua voz pode ajudar.
          </h2>

          <div className="flex flex-col items-start gap-5">
            <p className="invisible text-sm" aria-hidden="true">
              Respeito ao território. Cuidado com quem relata.
            </p>

            <Link
              to="/nova-denuncia"
              className="rounded-sm bg-[#B3261E] px-8 py-4 text-center text-sm font-bold transition-colors hover:bg-[#D32F2F]"
              style={{ color: "#FAF0D4" }}
            >
              Registrar uma denúncia
            </Link>
          </div>

        </div>
      </section>


{/*FOOTER*/}
      <Footer  />
      
    </div>
  )
}

export default Home
