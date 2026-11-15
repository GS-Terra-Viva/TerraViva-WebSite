import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MIN_SENHA = 6;
const inputCls =
  'w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-gray-300 text-sm font-bold mb-2';

function Register() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
          <p className="text-gray-400">Preencha os dados abaixo para se cadastrar.</p>
        </header>

        <form onSubmit={handleRegister}>
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
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className={inputCls}
            />
          </div>

          {/* Senha */}
          <div className="mb-6">
            <label htmlFor="password" className={labelCls}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder={`Mínimo de ${MIN_SENHA} caracteres`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className={inputCls}
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;