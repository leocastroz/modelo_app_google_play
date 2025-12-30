<script setup>
import { vMaska } from "maska/vue"
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'

const cpf = ref('');
const responseCreateCard = ref(null);
const retornoConsultaUser = ref([]);


const emailadm = ref('');
const passwordadm = ref('');
const nomecompleto = ref('');
const cpfcadastro = ref('');


const cleanCpf = (cpf) => cpf.replace(/\D/g, '');

const secretKey = '!@£$%&*()-_=+[]{};:,.<>?/~`'


const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, secretKey).toString()
}

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}


const supabase = useSupabaseClient();
const loading = ref(false);
const numeroTelefone = ref('');
const dataDeNascimento = ref('');
const changeModal = ref('login'); // 'login', 'register', 'forget'
const showPassword = ref(false);
const senhaUsuario = ref('');
const novaSenha = ref('');
const confirmeNovaSenha = ref('');
const dataNascimentoError = ref('');
const cpfError = ref('');

const validateCpf = () => {
  const cpfValue = cpfcadastro.value;
  if (!cpfValue) {
    cpfError.value = '';
    return true;
  }

  const cleaned = cleanCpf(cpfValue);

  if (cleaned.length !== 11) {
    cpfError.value = 'CPF incompleto';
    return false;
  }

  if (/^(\d)\1{10}$/.test(cleaned)) {
    cpfError.value = 'CPF inválido (dígitos repetidos)';
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) {
    cpfError.value = 'CPF inválido';
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) {
    cpfError.value = 'CPF inválido';
    return false;
  }

  cpfError.value = '';
  return true;
};

const validateDataNascimento = () => {
  const dateString = dataDeNascimento.value;
  if (!dateString) {
    dataNascimentoError.value = '';
    return true;
  }
  if (dateString.length !== 10) {
    dataNascimentoError.value = 'Data incompleta';
    return false;
  }

  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    dataNascimentoError.value = 'Data inválida';
    return false;
  }

  if (date > today) {
    dataNascimentoError.value = 'Data não pode ser futura';
    return false;
  }

  const age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  
  let calculatedAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    calculatedAge--;
  }

  if (calculatedAge > 100) {
    dataNascimentoError.value = 'Idade inválida (maior que 100 anos)';
    return false;
  }

  dataNascimentoError.value = '';
  return true;
};


const handleChange = async (event) => {
  changeModal.value = event
  showPassword.value = false
  dataNascimentoError.value = ''
  cpfError.value = ''
  dataDeNascimento.value = ''
  cpfcadastro.value = ''
}

const handleResetPassword = async () => {
  const isDataValid = validateDataNascimento();
  const isCpfValid = validateCpf();
  if (!isDataValid || !isCpfValid) return;
  loading.value = true;
  const cleanedCpf = cleanCpf(cpfcadastro.value) // return ex: 00000000000
  // console.log('Solicitando reset de senha para CPF:', cleanedCpf);
  // console.log('Data de Nascimento fornecida:', dataDeNascimento.value);
  const { data: record, error: queryError } = await useFetch('/api/buscauser', { method: 'GET', params: { date_user: dataDeNascimento.value, cpf_user: cleanedCpf } });
  // console.log('Record fetched:', record.value);
  // console.log('Query error:', queryError);
  if (record.value.code) {
    loading.value = false;
    changeModal.value = 'change-password';
  } else {
    // loading.value = false;
    // console.log('Password updated successfully for user ID:', data.user.id);
    console.error('Error updating user password as admin:', queryError.message);
    loading.value = false;
    cpfcadastro.value = '';
    dataDeNascimento.value = '';
    useToastify("Erro ao buscar usuário", { type: "error" });
  }
  // if (queryError) {
  //   console.error('Error updating user password as admin:', queryError.message);
  //   loading.value = false;
  //   cpfcadastro.value = '';
  //   dataDeNascimento.value = '';
  //   useToastify("Erro ao buscar usuário", { type: "error" });
  // }
}

const handleChangePassword = async () => {
  if (novaSenha.value !== confirmeNovaSenha.value) return useToastify("As senhas não conferem", { type: "error" });
  if (novaSenha.value.length <= 6) return useToastify("A senha deve ter mais de 6 caracteres", { type: "error" });
  loading.value = true;
  try {
    const encryptedPassword = encryptPassword(novaSenha.value);
    const cleanedCpf = cleanCpf(cpfcadastro.value);
    const resUpdateSenha = await $fetch('/api/alterarsenha', {
      method: 'GET',
      params: { cpf_user: cleanedCpf, date_user: dataDeNascimento.value, new_password: encryptedPassword }
    });
    
    if (resUpdateSenha) {
      console.log('Password update response:', resUpdateSenha);

      // Update password in custom backend if needed
        await $fetch('/api/criarsenha', {
          method: 'POST',
          body: {
            cpf_user: cleanedCpf,
            date_user: dataDeNascimento.value,
            password_user: encryptedPassword
          }
        });

        const { data: record, error: queryError } = await supabase.from('list_resets').select('*').eq('date_user', dataDeNascimento.value).eq('cpf_user', cleanedCpf).single();


    } else {
      throw error;
    }

    

    useToastify("Senha alterada com sucesso!", { type: "success" });
    changeModal.value = 'login';
    novaSenha.value = '';
    confirmeNovaSenha.value = '';
    
  } catch (error) {
    console.error('Error changing password:', error);
    useToastify("Erro ao alterar senha", { type: "error" });
  } finally {
    loading.value = false;
  }
}


const handleCadastro = async () => {
  const isDataValid = validateDataNascimento();
  const isCpfValid = validateCpf();

  if (!isDataValid || !isCpfValid) return;
  loading.value = true;
  const cleanedCpf = cleanCpf(cpfcadastro.value) // return ex: 00000000000
  const encryptedPassword = encryptPassword(senhaUsuario.value);
  try {
    const { data: dataRegister, error: errorRegister } = await supabase.auth.signUp({
      email: cleanedCpf + '@gmail.com',
      // password: cleanedCpf,
      password: senhaUsuario.value,
      options: {
        data: {
          codigoCliente: '',
          // editar com dados reais depois
          primeiroAcesso: true,
          cadastradoInova: false,
          atualizarPontos: false, // adicionar funcionalidade no ADM
          fileName: '',
          nome: nomecompleto.value,
          emailUpdate: '',
          telefone: '',
          dataNascimento: dataDeNascimento.value,
          biografia: '',
          cep: '',
          cidade: '',
          estado: '',
          rua: '',
          numero: '',
          complemento: '',
          idioma: 'ptbr',
          tema: 'claro',
          receberSms: false,
          receberEmail: false,
          receberNotificacoes: false,
          receberNewsletter: false,
          // fim editar
          cpf: cleanedCpf,
          role: 'cliente',
          PassId: '',
          pontos: 0
        }
      }
    });
    loading.value = false;
    if (errorRegister) {
      if (errorRegister.code === 'user_already_exists') {
        useToastify("Usuário já existe, realize login", {
          autoClose: 3000,
          theme: "light",
          type: "info",
          position: ToastifyOption.POSITION.TOP_RIGHT,
        });
        changeModal.value = 'login';
      }
    } else {
      useToastify("Cadastro realizado com sucesso!", {
        autoClose: 3000,
        theme: "light",
        type: "success",
        position: ToastifyOption.POSITION.TOP_RIGHT,
      });

      try {
        // const cleanedCpf = cleanCpf(cpfcadastro.value);
        const resCriaSenha = await $fetch('/api/criarsenha', {
          method: 'POST',
          body: {
            cpf_user: cleanedCpf,
            date_user: dataDeNascimento.value,
            password_user: encryptedPassword
          }
        });
        // Solicita token ao endpoint server-side. Credenciais ficam no servidor.
        const resLogin = await $fetch('/api/inova/login', {
          method: 'POST',
          body: {
            login: 'popularpara@inovafarma.com.br',
            senha: 'a8e?Hcw%'
          }
        })
        const token = resLogin.accessToken
        if (token) {
          localStorage.setItem('inovaAccessToken', token)
          // console.log('Login INOVA OK — token salvo');
        } else {
          console.warn('Login INOVA: sem accessToken', resLogin)
          useToastify("O servidor não está conectado!", {
            autoClose: 2000,
            theme: "light",
            type: "error",
            position: ToastifyOption.POSITION.TOP_RIGHT,
          });
          return;
        }
      } catch (e) {
        console.warn('Falha no login INOVA:', e)
        useToastify("O servidor não está conectado!", {
          autoClose: 2000,
          theme: "light",
          type: "error",
          position: ToastifyOption.POSITION.TOP_RIGHT,
        });
        return;
      }


      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: cleanedCpf + '@gmail.com',
        password: senhaUsuario.value,
      });


      const res = await $fetch('/api/inova/consulta_user', {
        method: 'POST',
        timeout: 5000,
        body: {
          cnpj: '16723042000190',
          parametros: [cleanedCpf]
        },
        headers: (() => {
          const t = localStorage.getItem('inovaAccessToken')
          return t ? { Authorization: `Bearer ${t}` } : undefined
        })()
      })
      retornoConsultaUser.value = res.data[0]

      if (res && res.data.length === 0) {
        navigateTo('/cliente');
      } else {
        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
          data: {
            nome: retornoConsultaUser.value.NOME,
            cadastradoInova: true,
            atualizarPontos: false,
            pontos: retornoConsultaUser.value.SALDOPONTOS
          }
        });
        changeModal.value = 'login';
        navigateTo('/cliente');
      }


    }

    cpfcadastro.value = '';
    nomecompleto.value = '';
    numeroTelefone.value = '';
    dataDeNascimento.value = '';
    senhaUsuario.value = '';
  } catch (error) {
    loading.value = false
  }
}


const handleLogin = async () => {
  try {
    loading.value = true
    const cleanedCpf = cleanCpf(cpf.value) // return ex: 00000000000



    // LOGIN INOVA PARA PEGAR TOKEN
    try {
      // Solicita token ao endpoint server-side. Credenciais ficam no servidor.
      const resLogin = await $fetch('/api/inova/login', {
        method: 'POST',
        timeout: 5000
      })
      const token = resLogin.accessToken
      if (token) {
        localStorage.setItem('inovaAccessToken', token)
        // console.log('Login INOVA OK — token salvo');
      } else {
        console.warn('Login INOVA: sem accessToken', resLogin)
        useToastify("O servidor não está conectado!", {
          autoClose: 2000,
          theme: "light",
          type: "error",
          position: ToastifyOption.POSITION.TOP_RIGHT,
        });
        return;
      }
    } catch (e) {
      console.warn('Falha no login INOVA:', e)
      useToastify("O servidor não está conectado!", {
        autoClose: 2000,
        theme: "light",
        type: "error",
        position: ToastifyOption.POSITION.TOP_RIGHT,
      });
      return;
    }


    // REALIZANDO LOGIN COM CLIENTE JA CADASTRADO NO SUPABASE
    try {
      console.log('Tentando login SUPA com dados em cache...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanedCpf + '@gmail.com',
        password: senhaUsuario.value,
      });
      if (error) throw error
      console.log('Realizando login do cliente:', data);
      navigateTo('/cliente');
    } catch {
      // continua para consulta INOVA
    }





    // CONSULTA USUÁRIO INOVA
    try {
      const res = await $fetch('/api/inova/consulta_user', {
        method: 'POST',
        timeout: 5000,
        body: {
          cnpj: '16723042000190',
          parametros: [cleanedCpf]
        },
        headers: (() => {
          const t = localStorage.getItem('inovaAccessToken')
          return t ? { Authorization: `Bearer ${t}` } : undefined
        })()
      })
      retornoConsultaUser.value = res.data[0]

      // USUÁRIO NÃO POSSUI VINCULO NA INOVAFARMA (NÃO É CLIENTE)
      if (res && res.data.length === 0) {

        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanedCpf + '@gmail.com',
          password: senhaUsuario.value,
        });
        if (error.code) {
          useToastify("Usuário não existe!", {
            autoClose: 2000,
            theme: "light",
            type: "error",
            position: ToastifyOption.POSITION.TOP_RIGHT,
          });
          loading.value = false
        }
        navigateTo('/cliente');
      }

      // SERVIDOR CAIU - POSSIVELMENTE FARMACIA
      if (res && res.data[0].sucesso === false) {
        useToastify("O servidor não está conectado!", {
          autoClose: 2000,
          theme: "light",
          type: "error",
          position: ToastifyOption.POSITION.TOP_RIGHT,
        });
        loading.value = false
        return;
      }

      // USUÁRIO POSSUI VINCULO - REALIZAR LOGIN / CADASTRO
      if (res && res.success && res.data.length !== 0) {
        // useToastify("Bem-vindo!", {
        //   autoClose: 2000,
        //   theme: "light",
        //   type: "success",
        //   position: ToastifyOption.POSITION.TOP_RIGHT,
        // });

        loading.value = true;

        // LOGIN PASS2U
        try {
          // Chamada ao endpoint server-side; credenciais Pass2U ficam no servidor
          await $fetch('/api/pass2u/login', {
            method: 'POST',
            body: {
              email: 'kassiabarros29@gmail.com',
              password: 'Kassia19.'
            }
          })
        } catch (e) {
          console.warn('Falha no login Pass2U:', e)
        }



        // SUPA VALIDATION CREATE AUTH USER
        const { data: dataUser, error: errorUser } = await supabase.auth.signUp({
          email: cleanedCpf + '@gmail.com',
          password: cleanedCpf,
          options: {
            data: {
              codigoCliente: res.data[0].CODIGOCLIENTE,
              // editar com dados reais depois
              primeiroAcesso: true,
              cadastradoInova: true,
              atualizarPontos: false,
              fileName: '',
              nome: res.data[0].NOME,
              emailUpdate: '',
              telefone: '',
              dataNascimento: dataDeNascimento.value,
              biografia: '',
              cep: '',
              cidade: '',
              estado: '',
              rua: '',
              numero: '',
              complemento: '',
              idioma: 'ptbr',
              tema: 'claro',
              receberSms: false,
              receberEmail: false,
              receberNotificacoes: false,
              receberNewsletter: false,
              // fim editar
              cpf: cleanedCpf,
              role: 'cliente',
              PassId: '',
              pontos: retornoConsultaUser.value.SALDOPONTOS
            }
          }
        });

        // console.log('Erro ao cadastrar usuário:', errorUser);

        if (errorUser) {
          if (errorUser.code === 'user_already_exists') {
            // Usuário já existe, tenta login
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email: cleanedCpf + '@gmail.com',
              password: senhaUsuario.value,
            });

            loading.value = false;
            if (loginError) throw loginError;

            // Atualiza os metadados do usuário com os pontos mais recentes
            if (retornoConsultaUser.value.SALDOPONTOS !== loginData.user.user_metadata.pontos && loginData.user.user_metadata.atualizarPontos === true) {
              const { data: updateData, error: updateError } = await supabase.auth.updateUser({
                data: {
                  pontos: retornoConsultaUser.value.SALDOPONTOS
                }
              });
              if (updateError) {
                console.error(updateError)
              } else {
              } console.log('Pontos do usuário atualizados:', updateData.user.user_metadata);

              // try {
              //   const res = await $fetch('/api/pass2u/update', {
              //     method: 'PUT',
              //     body: {
              //       modelId: "355552",
              //       passId: updateData.user.user_metadata.PassId,
              //       payload: {
              //         fields: [
              //           {
              //             key: "pontos",
              //             value: updateData.user.user_metadata.pontos
              //           }
              //         ]
              //       }
              //     }
              //   })
              //   console.log('Pontos atualizados:', res);
              // } catch (e) {
              //   console.warn('Erro:', e);
              //   alert('Erro: ' + e.message);
              // }

            } else {
              console.log('Pontos do usuário já estão atualizados.');
            }


            navigateTo('/cliente');
          }
        } else {

          loading.value = false;

          // CREATE CARD USER PASS2U
          // const userId = dataUser.user;
          console.log('Usuário cadastrado com sucesso:', dataUser.user.user_metadata);

          try {
            const modelId = ref("355552"); // Seu modelId criado no Pass2u (Modelo de cartão)
            const formData = ref({
              pontos: 0,
              nome: dataUser.user.user_metadata.nome,
              cvv: String(dataUser.user.user_metadata.codigoCliente),
              empresa: "N/A", // VALIDAR NA API
              barcode: String(dataUser.user.user_metadata.codigoCliente)
            });

            const payload = {
              expirationDate: "2026-10-21T23:59:59+08:00",
              sharingProhibited: false,
              barcode: {
                message: formData.value.barcode,
                altText: formData.value.barcode
              },
              fields: [
                // {
                //   key: "field1",
                //   value: "POPULAR CARDA"
                // },
                {
                  key: "field6",
                  value: formData.value.nome
                },
                {
                  key: "field7",
                  value: formData.value.cvv
                },
                {
                  key: "field24",
                  value: formData.value.empresa
                }
              ]
            };

            const res = await $fetch('/api/pass2u/create', {
              method: 'POST',
              body: {
                modelId: modelId.value,
                payload: payload
              }
            });
            responseCreateCard.value = res.data;
          } catch (e) {
            console.warn('Falha ao ter resposta da criacao do card:', e);
          }

          // Atualiza os metadados do usuário
          const { data: updateData, error: updateError } = await supabase.auth.updateUser({
            data: {
              PassId: responseCreateCard.value.passId
            }
          });
          if (updateError) console.error(updateError)
          else navigateTo('/cliente');
          return;
        }
        return;
      }

    } catch (e) {
      console.warn('Falha ao consultar usuários INOVA:', e)
      const cached = localStorage.getItem('inovaUsers')
      if (cached) ultimosClientes.value = JSON.parse(cached)
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email_auth,
      password: senhaUsuario.value,
    });

    // console.log('Realizando login do cliente:', data);

    // if (error) throw error

    navigateTo('/cliente');


  } catch (error) {
    // alert(error.message)
    loading.value = false
  } finally {
    loading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
}

// --- Push / Notifications helpers ---
import { useRuntimeConfig } from '#app'
const notifPermission = ref(typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default')
const subscribing = ref(false)

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const config = useRuntimeConfig();

async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') {
    useToastify('Notificações não suportadas neste navegador', { type: 'error' });
    return;
  }
  try {
    const result = await Notification.requestPermission();
    notifPermission.value = result;
    useToastify(`Permissão: ${result}`, { type: result === 'granted' ? 'success' : 'info' });
    return result;
  } catch (err) {
    console.error('Erro ao pedir permissão de notificação:', err);
    useToastify('Erro ao pedir permissão', { type: 'error' });
  }
}

async function subscribeToPush() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    useToastify('Service Worker não suportado', { type: 'error' });
    return;
  }
  subscribing.value = true;
  try {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      subscribing.value = false;
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      await $fetch('/api/save-subscription', { method: 'POST', body: existingSub });
      useToastify('Subscription já existente enviada ao servidor', { type: 'info' });
      subscribing.value = false;
      return existingSub;
    }

    const vapidKey = config.public.VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      useToastify('VAPID_PUBLIC_KEY não configurada', { type: 'error' });
      subscribing.value = false;
      return;
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidKey.replace(/=/g, ''));

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });

    await $fetch('/api/save-subscription', { method: 'POST', body: subscription });
    useToastify('Inscrição em push salva com sucesso', { type: 'success' });
    subscribing.value = false;
    return subscription;
  } catch (err) {
    console.error('Erro ao inscrever para push:', err);
    useToastify('Falha ao inscrever para push', { type: 'error' });
    subscribing.value = false;
  }
}

const isFormValid = computed(() => {
  return !loading.value && 
         !cpfError.value && 
         !dataNascimentoError.value && 
         cpfcadastro.value && 
         cpfcadastro.value.length === 14 &&
         dataDeNascimento.value && 
         dataDeNascimento.value.length === 10 &&
         nomecompleto.value && 
         senhaUsuario.value;
});

async function sendTestPush() {
  try {
    await $fetch('/api/send-push', { method: 'POST', body: { test: true } });
    useToastify('Pedido de envio de push realizado (servidor irá enviar para inscrições salvas)', { type: 'success' });
  } catch (err) {
    console.error('Erro ao solicitar envio de push:', err);
    useToastify('Erro ao solicitar envio de push', { type: 'error' });
  }
}

</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="brand-section">
        <img class="logo-circle" src="/icons/icon-96x96.png" width="50">
        <h1 class="brand-title">Popular Card</h1>
        <p class="brand-subtitle">Seu cartão de vantagens digital</p>
      </div>
      
      <form v-if="changeModal === 'login'" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="phone-number" class="form-label">Informe seu CPF</label>
          <div class="input-wrapper">
            <!-- <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 16.5c0-2.485 3.582-4.5 7-4.5s7 2.015 7 4.5V18H3v-1.5z" fill="currentColor"/>
            </svg> -->
            <img src="/images/user-auth.svg" alt="User Icon" width="40" />
            <!-- <input 
              id="phone-number" 
              type="tel" 
              v-model="numeroTelefone" 
              placeholder="(94) 9 9999-9999" 
              v-maska="'(##) # ####-####'"
              maxlength="16"
              autocomplete="tel"
              class="form-input"
              required
            > -->
            <input id="register-cpf" type="tel" v-model="cpf" placeholder="000.000.000-00" v-maska="'###.###.###-##'"
              maxlength="14" required class="form-input" :disabled="loading">
          </div>
        </div>

        <div class="form-group">
          <label for="phone-number" class="form-label">Informe sua senha</label>
          <div class="input-wrapper">
            <img src="/images/secretkey.svg" alt="User Icon" width="20" />
            <input id="phone-number" :type="showPassword ? 'text' : 'password'" v-model="senhaUsuario" placeholder="Digite sua senha" class="form-input" required style="text-transform: none;">
            <button type="button" class="password-toggle" @click="togglePasswordVisibility">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.45-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>


        <!-- Push Notification Controls -->
        <div v-if="false" style="display:flex;gap:8px;margin:12px 0;align-items:center;">
          <button type="button" class="btn-secondary" @click="subscribeToPush" :disabled="subscribing">
            {{ subscribing ? 'Ativando...' : 'Ativar Notificações' }}
          </button>
          <button type="button" class="btn-secondary" @click="sendTestPush">
            Enviar Push de Teste
          </button>
        </div>

        <div style="display: flex;align-items: center;justify-content: space-between;">
          <!-- <button type="button" class="forgot-password" @click="handleChange('forget')">
            Esqueceu sua senha?
          </button> -->

          <!-- <button type="button" class="forgot-password" @click="handleChange('register')">
            REALIZAR CADASTRO &#10095;
          </button>

          <button type="button" class="forgot-password" @click="handleChange('resetpassword')">
            ESQUECI MINHA SENHA &#10095;
          </button> -->

          <!-- <button type="button" class="forgot-password" @click="handleChange('register')">
            SOLICITAR CADASTRO &#10095;
          </button>

          <button type="button" class="forgot-password" @click="handleChange('admin')">
            ADMIN &#10095;
          </button> -->


          <!-- <a href="https://api.whatsapp.com/send?phone=+5594992124615&amp;text=Olá, estou precisando de ajuda!" target="_blank" class="btn-whatsapp-pulse btn-whatsapp-pulse-border">
              <img src="/images/whatsapp.svg" width="35" height="35" class="icons-contact" alt="WhatsApp">
            </a> -->
        </div>


        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">Entrar &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-dasharray="50.265" stroke-dashoffset="12.566" />
            </svg>
            Entrando...
          </span>
        </button>
      </form>


      <form v-if="changeModal === 'register'" @submit.prevent="handleCadastro" class="login-form">
        <div class="form-group">
          <label for="phone-number" class="form-label">Informe seu nome completo</label>
          <div class="input-wrapper">
            <img src="/images/mail.svg" alt="User Icon" width="20" />
            <input id="phone-number" type="text" v-model="nomecompleto" placeholder="Digite seu nome completo" maxlength="50" class="form-input" required>
          </div>
        </div>

        <div class="form-group">
          <label for="phone-number" class="form-label">Informe seu CPF</label>
          <div class="input-wrapper" :class="{ 'error-border': cpfError }">
            <img src="/images/secretkey.svg" alt="User Icon" width="20" />
            <input id="register-cpf" type="tel" v-model="cpfcadastro" placeholder="000.000.000-00"
              v-maska="'###.###.###-##'" maxlength="14" required class="form-input" :disabled="loading"
              @blur="validateCpf" @input="cpfError = ''">
          </div>
          <span v-if="cpfError" class="error-message">{{ cpfError }}</span>
        </div>

        <div class="form-group">
          <label for="phone-number" class="form-label">Informe sua data de nascimento</label>
          <div class="input-wrapper" :class="{ 'error-border': dataNascimentoError }">
            <img src="/images/mail.svg" alt="User Icon" width="20" />
            <input id="phone-number" type="tel" v-model="dataDeNascimento" placeholder="00/00/0000"
              v-maska="'##/##/####'" maxlength="10" autocomplete="tel" class="form-input" required
              @blur="validateDataNascimento" @input="dataNascimentoError = ''">
          </div>
          <span v-if="dataNascimentoError" class="error-message">{{ dataNascimentoError }}</span>
        </div>

        <!-- <div class="form-group">
          <label for="phone-number" class="form-label">Informe seu contato</label>
          <div class="input-wrapper">
            <img src="/images/mail.svg" alt="User Icon" width="20" />
            <input id="phone-number" type="tel" v-model="numeroTelefone" placeholder="(94) 9 9999-9999"
              v-maska="'(##) # ####-####'" maxlength="16" autocomplete="tel" class="form-input" required>
          </div>
        </div> -->

        <div class="form-group">
          <label for="phone-number" class="form-label">Informe sua senha</label>
          <div class="input-wrapper">
            <img src="/images/secretkey.svg" alt="User Icon" width="20" />
            <input id="phone-number" :type="showPassword ? 'text' : 'password'" v-model="senhaUsuario" placeholder="Digite sua senha" class="form-input" required style="text-transform: none;">
            <button type="button" class="password-toggle" @click="togglePasswordVisibility">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.45-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        <button type="button" class="forgot-password" @click="handleChange('login')">
          &#10094; REALIZAR LOGIN
        </button>

        <button type="submit" class="btn-primary" :disabled="!isFormValid">
          <span v-if="!loading">Cadastrar &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-dasharray="50.265" stroke-dashoffset="12.566" />
            </svg>
            Registrando...
          </span>
        </button>
      </form>


      <!-- ACCESS RESET PASSWORD -->
      <form v-if="changeModal === 'resetpassword'" @submit.prevent="handleResetPassword" class="login-form">
      
        <div class="form-group">
          <label for="phone-number" class="form-label">Informe seu CPF</label>
          <div class="input-wrapper">
            <img src="/images/secretkey.svg" alt="User Icon" width="20" />
            <input id="register-cpf" type="tel" v-model="cpfcadastro" placeholder="000.000.000-00"
              v-maska="'###.###.###-##'" maxlength="14" required class="form-input" :disabled="loading">
          </div>
        </div>

        <div class="form-group">
          <label for="phone-number" class="form-label">Informe sua data de nascimento</label>
          <div class="input-wrapper" :class="{ 'error-border': dataNascimentoError }">
            <img src="/images/mail.svg" alt="User Icon" width="20" />
            <input id="phone-number" type="tel" v-model="dataDeNascimento" placeholder="00/00/0000"
              v-maska="'##/##/####'" maxlength="10" autocomplete="tel" class="form-input" required
              @blur="validateDataNascimento" @input="dataNascimentoError = ''">
          </div>
          <span v-if="dataNascimentoError" class="error-message">{{ dataNascimentoError }}</span>
        </div>

        <button type="button" class="forgot-password" @click="handleChange('login')">
          &#10094; REALIZAR LOGIN
        </button>

        <button type="submit" class="btn-primary" :disabled="loading || dataNascimentoError || !cpfcadastro || cpfcadastro.length !==14 || !dataDeNascimento || dataDeNascimento.length !==10">
          <span v-if="!loading">Resgatar login &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-dasharray="50.265" stroke-dashoffset="12.566" />
            </svg>
            Enviando...
          </span>
        </button>
      </form>



      <!-- CHANGE PASSWORD -->
      <form v-if="changeModal === 'change-password'" @submit.prevent="handleChangePassword" class="login-form">
        <div class="form-group">
          <label for="new-password" class="form-label">Nova senha</label>
          <div class="input-wrapper">
            <img src="/images/secretkey.svg" alt="User Icon" width="20" />
            <input id="new-password" :type="showPassword ? 'text' : 'password'" v-model="novaSenha" placeholder="Digite sua nova senha" class="form-input" required style="text-transform: none;">
            <button type="button" class="password-toggle" @click="togglePasswordVisibility">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.45-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="confirm-password" class="form-label">Confirme sua nova senha</label>
          <div class="input-wrapper">
            <img src="/images/secretkey.svg" alt="User Icon" width="20" />
            <input id="confirm-password" :type="showPassword ? 'text' : 'password'" v-model="confirmeNovaSenha" placeholder="Confirme sua nova senha" class="form-input" required style="text-transform: none;">
            <button type="button" class="password-toggle" @click="togglePasswordVisibility">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.45-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        <button type="submit" class="btn-primary" :disabled="loading || !novaSenha || !confirmeNovaSenha || novaSenha !== confirmeNovaSenha || novaSenha.length <= 6">
          <span v-if="!loading">RENOVAR SENHA &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-dasharray="50.265" stroke-dashoffset="12.566" />
            </svg>
            Enviando...
          </span>
        </button>
      </form>





      <!-- ACCESS ADMIN -->
      <form v-if="changeModal === 'admin'" @submit.prevent="handleLoginAdm" class="login-form">
        <div class="form-group">
          <label for="phone-number" class="form-label">Informe o e-mail de acesso</label>
          <div class="input-wrapper">
            <img src="/images/mail.svg" alt="User Icon" width="20" />
            <input id="phone-number" type="email" v-model="emailadm" placeholder="Digite seu e-mail" class="form-input"
              required>
          </div>
        </div>

        <div class="form-group">
          <label for="phone-number" class="form-label">Informe o chave secreta</label>
          <div class="input-wrapper">
            <img src="/images/secretkey.svg" alt="User Icon" width="20" />
            <input id="phone-number" :type="showPassword ? 'text' : 'password'" v-model="passwordadm" placeholder="*******" class="form-input" style="padding-right: 45px;"
              required>
            <button type="button" class="password-toggle" @click="togglePasswordVisibility">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.45-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        <button type="button" class="forgot-password" @click="handleChange('login')">
          &#10094; REALIZAR LOGIN
        </button>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">Cadastrar &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-dasharray="50.265" stroke-dashoffset="12.566" />
            </svg>
            Enviando...
          </span>
        </button>
      </form>

      <form v-if="changeModal === 'forget'" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="phone-number" class="form-label">Informe o número para resgaste</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 6.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 16.5c0-2.485 3.582-4.5 7-4.5s7 2.015 7 4.5V18H3v-1.5z"
                fill="currentColor" />
            </svg>
            <input id="phone-number" type="tel" v-model="numeroTelefone" placeholder="(94) 9 9999-9999"
              v-maska="'(##) # ####-####'" maxlength="16" autocomplete="tel" class="form-input" required>
          </div>
        </div>

        <button type="button" class="forgot-password" @click="handleChange('login')">
          &#10094; REALIZAR LOGIN
        </button>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">Restaurar &#10095;</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-dasharray="50.265" stroke-dashoffset="12.566" />
            </svg>
            Enviando...
          </span>
        </button>
      </form>



      <!-- <div class="footer-section">
        <p class="footer-text">
          Não tem uma conta? 
          <button type="button" class="link-button">Cadastre-se</button>
        </p>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.login-container {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  /* background: linear-gradient(180deg, #021555 0%, #34446f 100%); */
  background-image: url(../../public/images/backgroundblue.png);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: env(safe-area-inset-top, 20px) env(safe-area-inset-right, 20px) env(safe-area-inset-bottom, 20px) env(safe-area-inset-left, 20px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

.login-content {
  width: 100%;
  max-width: 440px;
  padding: 32px 24px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-section {
  text-align: center;
  margin-bottom: 20px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #ffffff1f;
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 400;
}

/* Form */
.login-form {
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0C4F65;
  margin-bottom: 8px;
  letter-spacing: -0.2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  background: #f7f8fa;
  align-items: center;
  padding: 0 5px;
  border-radius: 14px;
  border: 2px solid transparent;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  height: 52px;
  padding: 0 0 0 5px;
  font-size: 14px;
  color: #0C4F65;
  background: #f7f8fa;
  border: none;
  /*
   */
  /* border-radius: 14px; */
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  text-transform: uppercase;
}

.form-input::placeholder {
  color: #9ca3af;
  text-transform: capitalize;
  font-weight: 200;
}

.form-input:focus {
  background-color: none;
  border-color: #0C4F65;
  /* box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); */
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  min-width: 44px;
  min-height: 44px;
}

.password-toggle:hover {
  color: #0C4F65;
}

.password-toggle:active {
  transform: scale(0.95);
}

.forgot-password {
  background: none;
  border: none;
  color: #0C4F65;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 0;
  cursor: pointer;
  margin-bottom: 24px;
  transition: opacity 0.2s ease;
  font-family: inherit;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.forgot-password:hover {
  opacity: 0.8;
}

.forgot-password:active {
  opacity: 0.6;
}

.btn-primary {
  width: 100%;
  height: 56px;
  min-height: 56px;
  background: linear-gradient(180deg, #021555 0%, #34446f 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: -0.2px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Footer */
.footer-section {
  text-align: center;
  margin-top: 32px;
}

.footer-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.link-button {
  background: none;
  border: none;
  color: white;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 15px;
  text-decoration: underline;
  transition: opacity 0.2s ease;
  font-family: inherit;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.link-button:hover {
  opacity: 0.8;
}

.link-button:active {
  opacity: 0.6;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-content {
    padding: 24px 16px;
  }

  .login-form {
    padding: 24px 20px;
  }

  .brand-title {
    font-size: 28px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-container {
    /* background: linear-gradient(180deg, #021555 0%, #34446f 100%); */
    background-image: url(../../public/images/backgroundblue.png);
  }
}

.error-border {
  border: 1px solid #ff4444 !important;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
</style>