import { STATUS_DENUNCIA, TIPOS_OCORRENCIA, type DenunciaLista } from '../services/denuncias'
import { chaveDia, formatarData, formatarDataHora } from './formatters'

/** Gera e baixa um CSV (separador ";", com BOM para abrir certo no Excel) das denúncias. */
export function exportarCsv(linhas: DenunciaLista[]) {
  const cab = [
    'Protocolo', 'Título', 'Tipo', 'Status', 'Data do ocorrido', 'Recebida em',
    'Município', 'Comunidade', 'Descrição', 'Latitude', 'Longitude', 'Denunciante', 'E-mail',
  ]
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const corpo = linhas.map((d) =>
    [
      d.protocolo, d.titulo, TIPOS_OCORRENCIA[d.tipo] ?? d.tipo,
      STATUS_DENUNCIA[d.status] ?? d.status, formatarData(d.data_ocorrido),
      formatarDataHora(d.created_at), d.municipio, d.comunidade, d.descricao,
      d.lat, d.lng, d.usuario_nome, d.usuario_email,
    ].map(esc).join(';'),
  )
  const csv = '\uFEFF' + [cab.map(esc).join(';'), ...corpo].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `denuncias-${chaveDia(new Date())}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
