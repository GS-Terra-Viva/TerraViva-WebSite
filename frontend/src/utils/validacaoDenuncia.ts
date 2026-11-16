import { chaveDia } from './formatters'

export type ErrosDenuncia = Partial<
  Record<'tipo' | 'data' | 'titulo' | 'descricao' | 'municipio' | 'declaro', string>
>

export type CamposDenuncia = {
  tipo: string
  data: string
  titulo: string
  descricao: string
  municipioId: string
  declaro: boolean
}

/** Valida o formulário de nova denúncia. Retorna um objeto vazio se estiver tudo certo. */
export function validarDenuncia(c: CamposDenuncia): ErrosDenuncia {
  const e: ErrosDenuncia = {}
  if (!c.tipo) e.tipo = 'Selecione o tipo de ocorrência.'
  if (!c.data) e.data = 'Informe a data do ocorrido.'
  else if (c.data > chaveDia(new Date())) e.data = 'A data não pode ser no futuro.'
  if (!c.titulo.trim()) e.titulo = 'Resuma o ocorrido em uma frase.'
  if (!c.descricao.trim()) e.descricao = 'Descreva o que aconteceu.'
  if (!c.municipioId) e.municipio = 'Selecione o município.'
  if (!c.declaro) e.declaro = 'É necessário declarar que as informações são verdadeiras.'
  return e
}
