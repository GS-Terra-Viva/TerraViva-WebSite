import { supabase } from './supabase'

const SESSION_KEY = 'gs_user'

export type UserRole = 'user' | 'admin'

export type AppUser = {
  id: number | string
  name: string
  email: string
  role: UserRole
  token: string
}

const VALID_ROLES: UserRole[] = ['user', 'admin']

export async function login(name: string, password: string): Promise<AppUser | null> {
  const { data, error } = await supabase.rpc('login_usuario', {
    p_name: name,
    p_password: password,
  })

  if (error) throw error
  if (!data) return null

  if (!VALID_ROLES.includes(data.role) || !data.token) {
    throw new Error('login_usuario retornou role/token inválido.')
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(data))
  return data as AppUser
}

export function getSession(): AppUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const user = JSON.parse(raw) as Partial<AppUser>
    if (!user.role || !VALID_ROLES.includes(user.role) || !user.token) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return user as AppUser
  } catch {
    return null
  }
}

export async function verifySession(): Promise<AppUser | null> {
  const local = getSession()
  if (!local) return null

  const { data, error } = await supabase.rpc('sessao_atual', { p_token: local.token })

  if (error) throw error

  if (!data) {
    localStorage.removeItem(SESSION_KEY) 
    return null
  }

  const user = { ...(data as Omit<AppUser, 'token'>), token: local.token }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  const local = getSession()
  localStorage.removeItem(SESSION_KEY)
  if (local) {
    supabase.rpc('logout_usuario', { p_token: local.token }).then(() => {})
  }
}

export async function register(name: string, email: string, password: string): Promise<void> {
  const { error } = await supabase.from('usuarios').insert({ name, email, password })
  if (error) throw error
}

export type UsuarioLista = {
  id: number
  name: string
  email: string
  role: UserRole
}

export async function listarUsuarios(): Promise<UsuarioLista[]> {
  const local = getSession()
  if (!local) throw new Error('sessao_invalida')

  const { data, error } = await supabase.rpc('listar_usuarios', { p_token: local.token })
  if (error) throw error
  return (data ?? []) as UsuarioLista[]
}

export async function excluirUsuario(id: number): Promise<void> {
  const local = getSession()
  if (!local) throw new Error('sessao_invalida')

  const { error } = await supabase.rpc('excluir_usuario', { p_token: local.token, p_id: id })
  if (error) throw error
}