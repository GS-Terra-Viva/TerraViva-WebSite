import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

function Login() {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função de autenticação (consulta a tabela no Supabase)
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);

      const user = await login(username.trim(), password);

      if (!user) {
        setError('Usuário ou senha incorretos.');
        return;
      }

    } catch (err) {
      // Erro de conexão/configuração, não de credenciais
      console.error('Erro ao consultar o Supabase:', err);
      setError('Não foi possível consultar o banco. Veja o console (F12) para detalhes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">

        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo!
          </h1>

          <p className="text-gray-400">
            Entre com suas credenciais para continuar.
          </p>
        </header>

        <form onSubmit={handleLogin}>

          {/* Nome de usuário */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Nome de usuario
            </label>

            <input
              id="username"
              type="text"
              placeholder="Claudio"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Senha */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mensagem de erro */}
          {error && (
            <p className="text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
  Não tem conta? <Link to="/register" className="text-blue-400 hover:underline">Cadastre-se</Link>
</p>

      </div>
    </div>
  );
}

export default Login;
