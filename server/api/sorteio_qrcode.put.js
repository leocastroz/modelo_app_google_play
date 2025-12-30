// server/api/sorteio_qrcode.put.js
import { defineEventHandler, readBody } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(); // Obtém as variáveis de ambiente configuradas no Nuxt
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

  try {
    const body = await readBody(event); // Lê o corpo da requisição
    console.log('BODY SORTEIO ->', body);

    const { data, error } = await supabase
      .from('sorteio_qrcode') // Nome da tabela no Supabase
      .update([body]); // Atualiza os dados com base no corpo recebido

    if (error) {
      throw error; // Lança o erro caso ocorra
    }

    return data; // Retorna os dados atualizados
  } catch (error) {
    return { error: error.message }; // Retorna o erro em caso de falha
  }
});