import { supabase } from './supabase'
import { getSession } from './authService'

export type TipoOcorrencia =
  | 'invasao_territorio'
  | 'desmatamento'
  | 'exploracao_ilegal'
  | 'violencia'
  | 'conflito_fundiario'
  | 'contaminacao'
  | 'acesso_servicos'
  | 'outro'

// Os ids precisam ser iguais aos validados em backend/supabase/denuncias.sql
export const TIPOS_OCORRENCIA: Record<TipoOcorrencia, string> = {
  invasao_territorio: 'Invasão de território',
  desmatamento: 'Desmatamento',
  exploracao_ilegal: 'Exploração ilegal (garimpo, caça, pesca)',
  violencia: 'Violência ou ameaça',
  conflito_fundiario: 'Conflito fundiário',
  contaminacao: 'Contaminação / poluição',
  acesso_servicos: 'Falta de acesso a serviços (saúde, educação)',
  outro: 'Outro',
}

export type Municipio = { id: number; nome: string }

export type NovaDenunciaInput = {
  tipo: TipoOcorrencia
  dataOcorrido: string // yyyy-mm-dd
  titulo: string
  comunidade: string
  descricao: string
  municipio: Municipio
  ponto: { lat: number; lng: number } | null
}

export type DenunciaCriada = { id: number; protocolo: string; status: string }

/** Lista os municípios de São Paulo (UF 35) na API pública do IBGE. */
export async function listarMunicipiosSP(): Promise<Municipio[]> {
  const r = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios?orderBy=nome',
  )
  if (!r.ok) throw new Error('Falha ao carregar municípios')
  const dados = (await r.json()) as { id: number; nome: string }[]
  return dados.map((m) => ({ id: m.id, nome: m.nome }))
}

/** Centro aproximado do município (Nominatim/OSM). Retorna null se não achar. */
export async function centroDoMunicipio(nome: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const q = encodeURIComponent(`${nome}, São Paulo, Brasil`)
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${q}`,
    )
    if (!r.ok) return null
    const d = (await r.json()) as { lat: string; lon: string }[]
    return d[0] ? { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) } : null
  } catch {
    return null
  }
}

/**
 * Grava a denúncia no Supabase pela função `criar_denuncia`.
 * Nome, e-mail e id de quem denunciou NÃO são enviados daqui: o banco descobre
 * pelo token da sessão (tabela `sessoes` -> `usuarios`) e grava junto da denúncia.
 */
export async function criarDenuncia(d: NovaDenunciaInput): Promise<DenunciaCriada> {
  const sessao = getSession()
  if (!sessao) throw new Error('Entre na sua conta para enviar uma denúncia.')

  const { data, error } = await supabase.rpc('criar_denuncia', {
    p_token: sessao.token,
    p_tipo: d.tipo,
    p_data_ocorrido: d.dataOcorrido,
    p_titulo: d.titulo.trim(),
    p_comunidade: d.comunidade.trim(),
    p_descricao: d.descricao.trim(),
    p_municipio: d.municipio.nome,
    p_municipio_ibge: d.municipio.id,
    p_lat: d.ponto?.lat ?? null,
    p_lng: d.ponto?.lng ?? null,
  })

  if (error) throw error

  // Só considera enviada se o banco confirmou o registro (devolveu o protocolo)
  const criada = data as DenunciaCriada | null
  if (!criada?.protocolo) {
    throw new Error('O banco não confirmou o registro da denúncia. Tente novamente.')
  }
  return criada
}