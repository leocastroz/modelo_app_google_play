import { defineEventHandler, getQuery } from 'h3';
import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js'

const secretKey = '!@£$%&*()-_=+[]{};:,.<>?/~`'

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  // Obter o token da query string
  const query = getQuery(event);
  const cpf_user = query.cpf_user;
  const date_user = query.date_user;
  const new_password = query.new_password;
  // console.log('Token received:', cpf_user, date_user);
  if (!cpf_user) return { error: 'cpf_user is required' };

  try {
    const { data: record, error: queryError } = await supabase.from('list_resets').select('*').eq('date_user', date_user).eq('cpf_user', cpf_user).single();
    // console.log('RETORNO CPF :', record);
    if (queryError) throw queryError;

    if (record) {
      // console.log('Record found:', record.password_user);
      const decryptedPassword = decryptPassword(record.password_user);
      // console.log('Decrypted Password:', decryptedPassword);
      if (!decryptedPassword) {
        console.error('Erro: A senha descriptografada está vazia. Verifique a chave secreta ou o formato dos dados.');
        return { error: 'Falha ao descriptografar senha' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: record.cpf_user + '@gmail.com',
        password: decryptedPassword,
      });

      // console.log('SIGN IN data:', data);
      // console.log('SIGN IN error:', error);   

      if (data?.user) {
        const decryptedNewPassword = decryptPassword(new_password);

        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
          password: decryptedNewPassword
        });
        // console.log('ALTERANDO senha:', decryptedNewPassword);
        // console.log('ALTERANDO data:', updateData);
        // console.log('ALTERANDO error:', updateError);
      }
    }

    // return { record };
    return { code: 200, message: 'Update completed' };  
  } catch (error) {
    return { error: error.message };
  }
});