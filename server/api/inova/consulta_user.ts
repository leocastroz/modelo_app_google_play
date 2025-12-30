// ...existing code...
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const url = 'https://integracao.precisaosistemas.com.br/api/v1/Integracao/usuario'

  // lê body enviado pelo cliente (conteúdo de consulta)
  const body = (await readBody(event)) as Record<string, any> | null
  const payload = body || {}

  // exige header Authorization (espera "Bearer <token>") — não aceite token no body
  const incomingAuth = (event.node.req.headers['authorization'] as string) || null
  const authHeader = incomingAuth || null

  if (!authHeader) {
    return {
      success: false,
      error: 'Missing Authorization header. Client must send Authorization: Bearer <token> (token from localStorage "inovaAccessToken").'
    }
  }

  try {
    const res = await $fetch(url, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader
      },
      // timeout de 6 segundos para evitar bloqueio prolongado
      timeout: 6000,
      credentials: 'omit'
    })

    // normaliza resposta para sempre retornar um array de objetos em `data`
    let parsed: any = res
    try {
      if (typeof res === 'string') {
        parsed = JSON.parse(res)
      } else if (res && typeof res === 'object' && typeof (res as any).data === 'string') {
        parsed = JSON.parse((res as any).data)
      } else if (res && typeof res === 'object' && (res as any).data) {
        parsed = (res as any).data
      }

      if (!Array.isArray(parsed)) {
        if (parsed && typeof parsed === 'object') {
          const arr = Object.values(parsed).find(v => Array.isArray(v))
          if (arr) parsed = arr
          else parsed = [parsed]
        } else {
          parsed = [parsed]
        }
      }
    } catch (e) {
      parsed = []
    }

    return {
      success: true,
      data: parsed
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || String(err)
    }
  }
})
// ...existing code...