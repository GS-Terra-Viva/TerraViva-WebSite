/** Converte qualquer erro (Error, erro do Supabase, string) em uma mensagem amigável. */
export function msgErro(e: unknown): string {
    const m =
      typeof e === 'object' && e !== null && 'message' in e
        ? String((e as { message: unknown }).message)
        : String(e)
  
    if (m.includes('sessao_invalida')) return 'Sua sessão expirou. Entre novamente.'
    if (m.includes('mensagem_obrigatoria')) return 'Informe a mensagem sobre o processo.'
    if (m.includes('transicao_invalida')) return 'Este status não pode ser aplicado agora. Recarregue a página.'
    return m
  }