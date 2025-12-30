import { defineEventHandler, readBody, setCookie, createError } from 'h3'

function extractCookieHeader(setCookieHeader: string | null) {
  if (!setCookieHeader) return ''
  const pairs = [...setCookieHeader.matchAll(/(^|,)\s*([^=;,\s]+=[^;]+)/g)].map(m => m[2])
  return pairs.join('; ')
}

async function fetchDistributions(cookieHeader: string, payloadOverride?: any) {
  const url = 'https://www.pass2u.net/api/v1/passes/distributions/data'
  const payload = payloadOverride ?? {
    modelPuid: 'SvO6cJ_7_wC5',
    pageSize: 25,
    pageNo: 1,
    searchItem: 'all'
  }
  return await $fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'content-type': 'application/json',
      'x-requested-with': 'XMLHttpRequest',
      referer: 'https://www.pass2u.net/passes/distributions',
      origin: 'https://www.pass2u.net',
      cookie: cookieHeader
    },
    body: payload
  })
}

export default defineEventHandler(async (event) => {
  const { email: bodyEmail, password: bodyPassword, distributionsPayload } = await readBody(event)
  const config = useRuntimeConfig(event)
  const email = bodyEmail || config.pass2uEmail
  const password = bodyPassword || config.pass2uPassword
  const ua =
    config.pass2uUserAgent ||
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36'

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Credenciais Pass2U ausentes' })
  }

  const loginUrlJson = 'https://www.pass2u.net/users/login'
  try {
    const res = await fetch(loginUrlJson, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/plain, */*',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': ua,
        origin: 'https://www.pass2u.net',
        referer: 'https://www.pass2u.net/users/login'
      },
      redirect: 'manual',
      body: JSON.stringify({ email, password })
    })

    if (res.status === 200 || res.status === 204 || res.status === 302) {
      const setCookieHeader = res.headers.get('set-cookie')
      const cookieHeader = extractCookieHeader(setCookieHeader)
      if (!cookieHeader) throw new Error('Login JSON não retornou cookie')

      // Consulta distributions imediatamente após login
      let distributions: any = null
      try {
        distributions = await fetchDistributions(cookieHeader, distributionsPayload)
      } catch (e: any) {
        distributions = { error: true, message: e?.data?.message || e?.message || 'Falha ao buscar distributions' }
      }

      setCookie(event, 'pass2u_cookie', encodeURIComponent(cookieHeader), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/'
      })

      return { ok: true, method: 'json', status: res.status, distributions }
    }
  } catch {
    // segue para fluxo com CSRF
  }

  // Fluxo com CSRF
  const loginPageUrl = 'https://www.pass2u.net/users/login'
  const getRes = await fetch(loginPageUrl, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'user-agent': ua
    },
    redirect: 'manual'
  })
  const html = await getRes.text()
  const metaMatch = html.match(/<meta\s+name=["']csrf-token["']\s+content=["']([^"']+)["']/i)
  const inputMatch = html.match(/name=["']authenticity_token["']\s+value=["']([^"']+)["']/i)
  const csrfToken = metaMatch?.[1] || inputMatch?.[1] || ''
  const setCookieHeader1 = getRes.headers.get('set-cookie')
  const baseCookies = extractCookieHeader(setCookieHeader1)

  const form = new URLSearchParams()
  form.set('email', email)
  form.set('password', password)
  if (csrfToken) form.set('authenticity_token', csrfToken)

  const postUrl = 'https://www.pass2u.net/users/login'
  const postRes = await fetch(postUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent': ua,
      origin: 'https://www.pass2u.net',
      referer: 'https://www.pass2u.net/users/login',
      cookie: baseCookies
    },
    body: form,
    redirect: 'manual'
  })

  if (![200, 204, 302].includes(postRes.status)) {
    const msg = `Falha no login Pass2U (status ${postRes.status})`
    throw createError({ statusCode: 401, statusMessage: msg })
  }

  const setCookieHeader2 = postRes.headers.get('set-cookie')
  const cookieHeader2 = extractCookieHeader(setCookieHeader2)
  const finalCookie = [baseCookies, cookieHeader2].filter(Boolean).join('; ')
  if (!finalCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Cookie de sessão não retornado' })
  }

  // Consulta distributions imediatamente após login
  let distributions: any = null
  try {
    distributions = await fetchDistributions(finalCookie, distributionsPayload)
  } catch (e: any) {
    distributions = { error: true, message: e?.data?.message || e?.message || 'Falha ao buscar distributions' }
  }

  setCookie(event, 'pass2u_cookie', encodeURIComponent(finalCookie), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/'
  })

  return { ok: true, method: 'csrf', status: postRes.status, distributions }
})