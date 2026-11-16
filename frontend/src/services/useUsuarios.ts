import { useCallback, useEffect, useState } from 'react'
import { excluirUsuario, listarUsuarios, type UsuarioLista } from '../services/authService'
import { msgErro } from '../utils/erros'

/** Carrega os usuários (admin) e expõe a exclusão, mantendo a lista local em dia. */
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioLista[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch((e) => {
        console.error(e)
        setErro(msgErro(e))
      })
      .finally(() => setCarregando(false))
  }, [])

  /** Exclui o usuário e o remove da lista. Repassa o erro para a tela mostrar no modal. */
  const excluir = useCallback(async (id: number) => {
    await excluirUsuario(id)
    setUsuarios((lista) => lista.filter((u) => u.id !== id))
  }, [])

  return { usuarios, carregando, erro, excluir }
}
