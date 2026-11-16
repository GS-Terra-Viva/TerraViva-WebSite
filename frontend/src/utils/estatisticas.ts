import {
  ORDEM_STATUS,
  type DenunciaLista,
  type StatusDenuncia,
  type TipoOcorrencia,
} from '../services/denuncias'
import type { UsuarioLista } from '../services/authService'
import { chaveDia } from './formatters'

const DIA_CURTO = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

/** Quantidade de denúncias em cada status. */
export function contarPorStatus(denuncias: DenunciaLista[]): Record<StatusDenuncia, number> {
  const m = Object.fromEntries(ORDEM_STATUS.map((s) => [s, 0])) as Record<StatusDenuncia, number>
  for (const d of denuncias) if (d.status in m) m[d.status] += 1
  return m
}

/** Relatos por dia e por tipo nos últimos `periodo` dias (pela data de recebimento). */
export function agruparPorDia(denuncias: DenunciaLista[], periodo: number) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dias = Array.from({ length: periodo }, (_, i) => {
    const dt = new Date(hoje)
    dt.setDate(hoje.getDate() - (periodo - 1 - i))
    return { chave: chaveDia(dt), rotulo: DIA_CURTO.format(dt).replace('.', ''), total: 0 }
  })
  const indice = new Map(dias.map((d) => [d.chave, d]))
  const tipos = new Map<TipoOcorrencia, number>()

  for (const d of denuncias) {
    const dia = indice.get(chaveDia(new Date(d.created_at)))
    if (!dia) continue
    dia.total += 1
    tipos.set(d.tipo, (tipos.get(d.tipo) ?? 0) + 1)
  }

  const porTipo = [...tipos.entries()]
    .map(([tipo, total]) => ({ tipo, total }))
    .sort((a, b) => b.total - a.total)

  return { dias, porTipo }
}

/** As `n` denúncias mais recentes. */
export function maisRecentes(denuncias: DenunciaLista[], n: number): DenunciaLista[] {
  return [...denuncias]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, n)
}

/**
 * Resumo dos usuários. A lista não traz data de cadastro,
 * então "mais recentes" = maiores ids.
 */
export function resumirUsuarios(usuarios: UsuarioLista[]) {
  const admins = usuarios.filter((u) => u.role === 'admin').length
  return {
    admins,
    comuns: usuarios.length - admins,
    ultimos: [...usuarios].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5),
  }
}
