// ...existing code...
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const url = 'https://integracao.precisaosistemas.com.br/api/v1/Integracao/usuarios'

  // lê body enviado pelo cliente; fallback para cnpj hardcoded
  const body = (await readBody(event)) as Record<string, any> | null
  const payload = body && Object.keys(body).length
    ? body
    : { cnpj: '16723042000190' }

  // tenta obter header Authorization (espera "Bearer <token>")
  const incomingAuth = (event.node.req.headers['authorization'] as string) || null
  // também aceita token no body (campo token) para conveniência
  const tokenFromBody = body && (body.token || body.accessToken) ? (body.token || body.accessToken) : null
  const authHeader = incomingAuth || (tokenFromBody ? `Bearer ${tokenFromBody}` : null)

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

      // se não for array, tenta extrair o primeiro array dentro do objeto
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
      data: parsed,
      raw: res
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || String(err)
    }
  }
})
// ...existing code...