import { supabase } from './supabase'

/**
 * Consulta pública de denúncias, usada pelas telas "Minhas denúncias" e
 * "Acompanhar denúncia". Lê a função `listar_denuncias_publicas` do Supabase
 * (que já devolve só denúncias não arquivadas e com lat/lng arredondados).
 */

export type DenunciaPublica = {
  mensagemConclusao: string
  mensagemEncaminhamento: string
  id: string
  protocolo: string
  tipo: string
  /** yyyy-mm-dd */
  dataOcorrido: string | null
  titulo: string
  comunidade: string
  municipio: string
  status: string
  /** timestamp (texto) de quando a denúncia foi recebida */
  recebidaEm: string
}

/** Denúncia como a RPC `listar_denuncias_publicas` devolve (usada no mapa público). */
export type DenunciaMapa = {
  id: string
  protocolo: string
  tipo: string
  data_ocorrido: string
  titulo: string
  comunidade: string | null
  municipio: string
  lat: number | null
  lng: number | null
  status: string
  created_at: string
}

/** Lista as denúncias públicas (não arquivadas, com coordenadas arredondadas). */
export async function listarDenunciasPublicas(): Promise<DenunciaMapa[]> {
  const { data, error } = await supabase.rpc('listar_denuncias_publicas')
  if (error) throw error
  return (data ?? []) as DenunciaMapa[]
}

// ---------------------------------------------------------------------------
// Etapas de andamento (ids precisam bater com o status gravado no banco)
// ---------------------------------------------------------------------------

export const ETAPAS = [
  { id: 'recebida', label: 'Recebida', descricao: 'Recebemos o seu relato. Ele aguarda triagem da equipe.' },
  { id: 'em_analise', label: 'Em análise', descricao: 'A equipe está avaliando as informações enviadas.' },
  { id: 'encaminhada', label: 'Encaminhada', descricao: 'O caso foi encaminhado para quem pode atuar sobre ele.' },
  { id: 'concluida', label: 'Concluída', descricao: 'A análise desta denúncia foi encerrada.' },
] as const

export type EtapaId = (typeof ETAPAS)[number]['id']

/** Converte o texto de status do banco ("Em análise", "em_analise"...) em uma etapa conhecida. */
export function identificarEtapa(status: string): EtapaId | null {
  const s = status
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')

  if (s === 'recebida' || s === 'recebido') return 'recebida'
  if (s.startsWith('em_anali') || s === 'analise') return 'em_analise'
  if (s.startsWith('encaminh')) return 'encaminhada'
  if (s.startsWith('conclu')) return 'concluida'
  return null
}

// ---------------------------------------------------------------------------
// Protocolo e consulta
// ---------------------------------------------------------------------------

export const normalizarProtocolo = (s: string) => s.trim().replace(/\s+/g, '').toUpperCase()

/**
 * Procura uma denúncia pelo protocolo. Retorna null se não existir
 * (ou se estiver arquivada, pois a função pública não devolve as arquivadas).
 */
export async function buscarDenunciaPorProtocolo(protocolo: string): Promise<DenunciaPublica | null> {
  const { data, error } = await supabase.rpc('buscar_denuncia_por_protocolo', {
    p_protocolo: protocolo,
  })
  if (error) throw error
  return (data ?? null) as DenunciaPublica | null
}

// ---------------------------------------------------------------------------
// Datas
// ---------------------------------------------------------------------------

const dd = (n: number) => String(n).padStart(2, '0')

/** yyyy-mm-dd -> dd/mm/aaaa (sem passar por Date, para não deslocar o dia) */
export function fmtDataIso(iso: string | null): string {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/**
 * created_at vem como texto do Postgres ("2026-11-12 10:00:00.123+00").
 * Ajusta para um formato que todo navegador entende e mostra dd/mm/aaaa.
 */
export function fmtRecebida(valor: string): string {
  if (!valor) return '—'
  let iso = valor.trim().replace(' ', 'T')
  if (/T.*[+-]\d{2}$/.test(iso)) iso += ':00' // "+00" -> "+00:00"
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : `${dd(d.getDate())}/${dd(d.getMonth() + 1)}/${d.getFullYear()}`
}
