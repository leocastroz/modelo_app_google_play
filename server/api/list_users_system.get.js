import { defineEventHandler } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

  try {
    const { data, error } = await supabase
      .from('users_sorteio_qrcode')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    return { error: error.message };
  }
});