import { useMemo, useState } from 'react'
import type { UsuarioLista } from '../services/authService'

/** Busca por nome/e-mail, filtro por tipo de conta e totais da lista de usuários. */
export function useFiltroUsuarios(usuarios: UsuarioLista[]) {
  const [busca, setBusca] = useState('')
  const [filtroRole, setFiltroRole] = useState<'todos' | 'admin' | 'user'>('todos')

  const totais = useMemo(
    () => ({
      total: usuarios.length,
      admins: usuarios.filter((u) => u.role === 'admin').length,
      comuns: usuarios.filter((u) => u.role === 'user').length,
    }),
    [usuarios],
  )

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return usuarios.filter(
      (u) =>
        (filtroRole === 'todos' || u.role === filtroRole) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    )
  }, [usuarios, busca, filtroRole])

  return { busca, setBusca, filtroRole, setFiltroRole, totais, filtrados }
}
