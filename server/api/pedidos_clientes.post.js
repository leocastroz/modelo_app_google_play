import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Basic validation
  const required = ['nome_pedido', 'nome_cliente', 'pontos_pedido']
  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === '') {
      return sendError(event, createError({ statusCode: 400, statusMessage: `Campo '${key}' é obrigatório.` }))
    }
  }

  const id = body.id !== undefined ? Number(body.id) : undefined
  const created_at = body.created_at || new Date().toISOString()
  const user_id = body.user_id !== undefined ? String(body.user_id) : undefined
  const cpf_cliente = body.cpf_cliente !== undefined ? String(body.cpf_cliente) : undefined
  const contato_cliente = body.contato_cliente !== undefined ? String(body.contato_cliente) : undefined
  const nome_pedido = String(body.nome_pedido)
  const nome_cliente = String(body.nome_cliente)
  const pontos_pedido = Number(body.pontos_pedido)
  const pedido_liberado = Boolean(body.pedido_liberado)

  if (Number.isNaN(pontos_pedido)) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Campo pontos_pedido deve ser numérico.' }))
  }

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Server misconfiguration: Supabase env vars missing.' }))
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  const payload = {
    ...(id !== undefined ? { id } : {}),
    created_at,
    user_id,
    cpf_cliente,
    contato_cliente,
    nome_pedido,
    nome_cliente,
    pontos_pedido,
    pedido_liberado
  }

  try {
    const { data, error } = await supabase.from('pedidos_clientes').insert([payload]).select()
    if (error) {
      return sendError(event, createError({ statusCode: 500, statusMessage: error.message }))
    }
    return {
      success: true,
      data: Array.isArray(data) && data.length ? data[0] : data
    }
  } catch (err) {
    return sendError(event, createError({ statusCode: 500, statusMessage: String(err) }))
  }
})
