export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      modelId?: string
      passId?: string
      payload?: any
      // optional fallback key (not recommended for prod)
      apiKey?: string
      utmSource?: string
    }>(event)

    const { modelId, passId, payload } = body || {}
    if (!modelId || !passId || !payload) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'modelId, passId e payload são obrigatórios' 
      })
    }

   
    const config = useRuntimeConfig()
    const apiKey = 'd207ac53fd40b35aaa8ad14020571feb'
    // const apiKey = config.PASS2U_API_KEY || body.apiKey
    if (!apiKey) {
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'PASS2U_API_KEY não configurada no servidor' 
      })
    }

    const utm = body.utmSource || 'nuxt_app'
    const url = `https://api.pass2u.net/v2/models/${encodeURIComponent(modelId)}/passes/${encodeURIComponent(passId)}?utm_source=${encodeURIComponent(utm)}`
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'x-api-key': apiKey as string,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const text = await res.text()
    if (!res.ok) {
      throw createError({ 
        statusCode: res.status, 
        statusMessage: `Pass2U update error: ${text}` 
      })
    }
    
    let data: any
    try { 
      data = JSON.parse(text) 
    } catch { 
      data = text 
    }
    
    return { ok: true, data }
  } catch (err: any) {
    // Normalize error
    if (err?.statusCode) throw err
    throw createError({ 
      statusCode: 500, 
      statusMessage: err?.message || 'Erro interno ao atualizar o passe' 
    })
  }
})