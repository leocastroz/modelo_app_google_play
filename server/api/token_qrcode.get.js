import { defineEventHandler, getQuery } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

  // Obter o token da query string
  const query = getQuery(event);
  const token = query.token;
  console.log('Token received:', token);
  if (!token) {
    return { error: 'Token is required' };
  }

  try {
    const { data: record, error: queryError } = await supabase
      .from('sorteio_qrcode')
      .select('*')
      .eq('token', token)
      .single();

    if (queryError) {
      throw queryError;
    }

    return { record };
  } catch (error) {
    return { error: error.message };
  }
});