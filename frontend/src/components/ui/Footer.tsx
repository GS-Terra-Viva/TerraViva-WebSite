
const Footer = () => {
  return (
    <footer className="bg-black px-6 pb-8 md:px-12">
      <div className="mx-auto w-full border-t border-[#26352C] pt-8">

        <div className="flex flex-col justify-between gap-8 md:flex-row">

          <div>
            <h2 className="text-xl font-bold" style={{ color: "#FAF0D4" }}>
              TERRA VIVA
            </h2>

            <p className="mt-2 text-sm text-[#A9B9AF]">
              Pelos territórios. Pelos direitos. Pela vida.
            </p>
          </div>

          <nav className="flex flex-wrap items-start gap-5 text-sm" aria-label="Navegação do rodapé">
            <a href="/sobre" style={{ color: "#FAF0D4" }}>
              O projeto
            </a>

            <a href="/#como-funciona" style={{ color: "#FAF0D4" }}>
              Como funciona
            </a>

            <a href="/privacidade" style={{ color: "#FAF0D4" }}>
              Privacidade
            </a>

            <a href="/contato" style={{ color: "#FAF0D4" }}>
              Contato
            </a>
          </nav>

        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 text-px text-[#8A968D] md:flex-row">
          <p>© 2026 Terra Viva · Conceito de plataforma de denúncias</p>
          <p>São Paulo, Brasil</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
