import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import IMAGEM_LATERAL from '../assets/pages/login/loginimage.png';

const MIN_SENHA = 6;
const inputCls =
  'w-full px-4 py-3.5 rounded-md bg-white text-gray-900 placeholder-gray-500 border border-gray-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-60';
const labelCls = 'block mb-2 text-sm font-bold text-white';

function Register() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const nome = name.trim();
    const mail = email.trim();

    if (!nome || !mail || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(mail)) {
      setError('Informe um e-mail válido.');
      return;
    }

    if (password.length < MIN_SENHA) {
      setError(`A senha deve ter pelo menos ${MIN_SENHA} caracteres.`);
      return;
    }

    try {
      setLoading(true);

      // Insere em `usuarios` e já faz login (redireciona conforme a role)
      const user = await register(nome, mail, password);

      if (!user) {
        setError('Conta criada, mas não foi possível entrar. Tente fazer login.');
      }
    } catch (err) {
      console.error('Erro ao cadastrar no Supabase:', err);
      setError('Não foi possível concluir o cadastro. Veja o console (F12) para detalhes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex bg-[#2f4d40] text-white">
      <aside className="hidden lg:flex w-[44%] shrink-0 flex-col overflow-hidden bg-[#13231c]">
        <div
          className="relative flex-1 min-h-0 bg-[#1f3a2c] bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,0)), url('${IMAGEM_LATERAL}')`,
            backgroundSize: '100% 100%, 100% auto', 
            backgroundPosition: 'center, bottom',
          }}
        >
          <div className="absolute top-10 left-12 text-2xl font-extrabold tracking-wide">
            TERRA VIVA
          </div>
        </div>

        <div className="flex h-1.5 shrink-0">
          <div className="flex-1 bg-red-700" />
          <div className="flex-1 bg-yellow-600" />
          <div className="flex-1 bg-red-700" />
        </div>

        <div className="flex flex-col shrink-0 px-12 pt-6 pb-4">
          <p className="text-sm font-bold tracking-wide text-yellow-500">TERRITÓRIO É VIDA.</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-[#f6efd8]">
            Junte a sua voz a essa resistência.
          </h2>
          <p className="mt-3 max-w-md text-base text-gray-300">
            Crie sua conta para registrar denúncias e acompanhar os próximos passos de cada relato.
          </p>
          <p className="mt-6 text-xs tracking-wide text-gray-400">TERRA VIVA / SÃO PAULO</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col px-6 sm:px-10 lg:px-16 py-6 lg:overflow-y-auto">
        <nav className="flex items-center justify-between gap-4 text-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#e8e4d0] hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar para o início
          </Link>

          <p className="text-[#c9d3c8]">
            Já tem uma conta?{' '}
            <Link to="/login" className="ml-2 font-bold text-white hover:underline">
              Entrar
            </Link>
          </p>
        </nav>

        <div className="flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-lg">
            <p className="text-sm font-bold tracking-wide text-[#a9c0b0]">CRIE SUA CONTA</p>
            <h1 className="mt-3 text-5xl font-bold text-[#f6efd8]">Seja bem-vindo.</h1>
            <p className="mt-3 text-lg text-[#a9c0b0]">Preencha os dados abaixo para se cadastrar.</p>

            <form onSubmit={handleRegister} className="mt-8">
              {/* Nome completo */}
              <div className="mb-5">
                <label htmlFor="name" className={labelCls}>
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="name"
                  className={inputCls}
                />
              </div>

              {/* E-mail */}
              <div className="mb-5">
                <label htmlFor="email" className={labelCls}>
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seunome@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="email"
                  className={inputCls}
                />
              </div>

              {/* Senha */}
              <div className="mb-6">
                <label htmlFor="password" className={labelCls}>
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder={`Mínimo de ${MIN_SENHA} caracteres`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="new-password"
                    className={`${inputCls} pr-14`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((v) => !v)}
                    title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
                  >
                    {mostrarSenha ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="mb-4 text-sm font-semibold text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-between px-6 py-4 rounded-md bg-[#b93a2c] hover:bg-[#a33125] text-white text-lg font-bold transition-colors disabled:opacity-60"
              >
                {loading ? 'Cadastrando...' : 'Criar minha conta'}
                <ArrowRight size={22} />
              </button>
            </form>

            {/* Aviso de cuidado */}
            <div className="mt-8 flex gap-4 p-5 rounded-md bg-[#e8ede4] text-gray-700">
              <ShieldCheck size={28} className="shrink-0 mt-0.5 text-green-800" />
              <div>
                <p className="font-bold text-green-900">Um espaço de cuidado</p>
                <p className="mt-1 text-sm">
                  Sua identidade não aparece na lista pública de denúncias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;