import { defineEventHandler, readBody } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

  if (event.req.method === 'POST') {
    console.log('POST');
    try {
      const body = await readBody(event);
      
      // Verificar se já existe registro com cpf_user e date_user
      const { data: existingRecord, error: searchError } = await supabase
        .from('list_resets')
        .select('id')
        .eq('cpf_user', body.cpf_user)
        .eq('date_user', body.date_user)
        .single();

      if (existingRecord) {
        // Se existir, atualiza a senha baseado no ID
        console.log('Atualizando senha para ID:', existingRecord.id);
        const { data, error } = await supabase
          .from('list_resets')
          .update({ password_user: body.password_user })
          .eq('id', existingRecord.id);

        if (error) throw error;
        return data;
      } else {
        // Se não existir, cria novo registro (comportamento original)
        // Ignora erro de busca se for "não encontrado" para prosseguir com insert
        if (searchError && searchError.code !== 'PGRST116') {
           throw searchError;
        }

        const { data, error } = await supabase
          .from('list_resets')
          .insert([body]);

        if (error) throw error;
        return data;
      }
    } catch (error) {
      return { error: error.message };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});