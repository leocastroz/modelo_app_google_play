// ...existing code...
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const url = 'https://integracao.precisaosistemas.com.br/api/login'

  // Use server-side runtime config / env for credentials — never accept credentials from client
  const config = useRuntimeConfig()
  const login = config?.inova?.login || process.env.INOVA_LOGIN
  const senha = config?.inova?.senha || process.env.INOVA_PASSWORD

  if (!login || !senha) {
    return {
      success: false,
      error: 'INOVA credentials not configured on server'
    }
  }

  const payload = { login, senha }

  try {
    const res = await $fetch(url, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      // importante: timeout de 6 segundos
      timeout: 6000,
      credentials: 'omit'
    })

    const accessToken = (res && (res as any).accessToken) || null

    return {
      success: true,
      accessToken
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || String(err)
    }
  }
})
// ...existing code...