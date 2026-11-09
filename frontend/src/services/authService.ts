import { supabase } from './supabase'

// Nome da tabela criada no Table Editor (colunas: id, name, password)
const SESSION_KEY = 'gs_user'

export type AppUser = {
  id: number | string
  name: string
}

/**
 * Confere nome + senha direto na tabela.
 * Retorna o usuário se encontrar, ou null se não existir combinação igual.
 * Lança erro se a consulta ao Supabase falhar (URL/chave erradas, RLS, tabela inexistente...).
 */
export async function login(name: string, password: string): Promise<AppUser | null> {
    const { data, error } = await supabase.rpc('login_usuario', {
      p_name: name,
      p_password: password,
    })
  
    if (error) throw error
    if (!data) return null
  
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    return data as AppUser
  }

export function getSession(): AppUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AppUser) : null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
