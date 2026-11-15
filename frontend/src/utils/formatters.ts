/** 'yyyy-mm-dd' -> 'dd/mm/aaaa' sem passar por Date (evita deslocar o dia por fuso). */
export function formatarData(iso: string | null | undefined): string {
    if (!iso) return '—'
    const [a, m, d] = iso.slice(0, 10).split('-')
    return `${d}/${m}/${a}`
  }
  
  /** timestamptz ISO -> 'dd/mm/aaaa HH:MM' no fuso do navegador. */
  export function formatarDataHora(iso: string | null | undefined): string {
    if (!iso) return '—'
    const dt = new Date(iso)
    if (Number.isNaN(dt.getTime())) return '—'
    return dt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  }
  
  /** Date -> 'yyyy-mm-dd' no fuso local. */
  export function chaveDia(dt: Date): string {
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const d = String(dt.getDate()).padStart(2, '0')
    return `${dt.getFullYear()}-${m}-${d}`
  }
  