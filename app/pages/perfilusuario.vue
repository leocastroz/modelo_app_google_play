<template>
  <div class="profile-container">
    <!-- <div class="profile-wrapper"> -->
    <!-- Header -->
    <!-- <div class="profile-header">
        <h1>Perfil do Usuário</h1>
        <p>Bem-vindo ao seu perfil! Edite suas informações abaixo.</p>
      </div> -->
    <!-- <button @click="updatePassword">reset password</button> -->
    <!-- Profile Form -->
    <form @submit.prevent="saveProfile" class="profile-form">
      <!-- Avatar Section -->
      <div class="avatar-section">
        <!-- <div class="avatar-container">
          <img :src="previewImageUrl || (user.fileName ? `https://api.drogariapopular24h.com.br/storage/v1/object/public/profiles//${user.fileName}` : 'https://www.if.ufrgs.br/if/wp-content/uploads/2018/04/default-profile.png')"
            :alt="user.name" class="avatar">
          <button type="button" class="avatar-upload-btn" @click="triggerFileUpload">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload" style="display: none;">
        </div> -->

        <!-- <pre>{{ user.name }}</pre>

        <div class="avatar-container">
          <img :src="user.name || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=30369d&color=fff`" :alt="user.name" class="avatar" />
        </div> -->


      </div>
      <!-- Personal Information -->
      <div class="form-section">
        <h2>Informações Pessoais</h2>
        <!-- <pre>{{ user }}</pre> -->
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nome Completo *</label>
            <input type="text" id="name" v-model="user.name" disabled required placeholder="Digite seu nome completo"
              style="background-color: #e9e9e9;">
          </div>

          <div class="form-group">
            <label for="email">E-mail *</label>
            <input type="email" id="email" v-model="user.email" required placeholder="seu@email.com">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="phone">Telefone</label>
            <input type="tel" id="phone" v-model="user.phone" placeholder="(11) 99999-9999">
          </div>

          <!-- <div class="form-group">
            <label for="birthdate">Data de Nascimento</label>
            <input type="date" id="birthdate" v-model="user.birthdate">
          </div> -->
        </div>

        <!-- <div class="form-group">
          <label for="bio">Biografia</label>
          <textarea id="bio" v-model="user.bio" rows="4" placeholder="Conte um pouco sobre você..."></textarea>
        </div> -->
      </div>

      <!-- Address Information -->
      <div class="form-section">
        <h2>Endereço</h2>

        <div class="form-row">
          <div class="form-group form-group-small">
            <label for="cep">CEP</label>
            <input type="text" id="cep" v-model="user.cep" placeholder="00000-000" @blur="fetchAddressByCep">
          </div>

          <div class="form-group">
            <label for="city">Cidade</label>
            <input type="text" id="city" v-model="user.city" placeholder="Sua cidade">
          </div>

          <div class="form-group form-group-small">
            <label for="state">Estado</label>
            <input type="text" id="state" v-model="user.state" placeholder="Seu estado">
            <!-- <select id="state" v-model="user.state">
              <option value="">Selecione</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
            </select> -->
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="street">Rua</label>
            <input type="text" id="street" v-model="user.street" placeholder="Nome da rua">
          </div>

          <div class="form-group form-group-small">
            <label for="number">Número</label>
            <input type="text" id="number" v-model="user.number" placeholder="123">
          </div>
        </div>

        <div class="form-group">
          <label for="complement">Complemento</label>
          <input type="text" id="complement" v-model="user.complement" placeholder="Apartamento, bloco, etc.">
        </div>
      </div>

      <!-- Preferences -->
      <div class="form-section" v-if="false">
        <h2>Preferências</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="language">Idioma</label>
            <select id="language" v-model="user.language">
              <option value="pt-br">Português (Brasil)</option>
              <option value="en-us">English (US)</option>
              <option value="es-es">Español</option>
            </select>
          </div>

          <div class="form-group">
            <label for="theme">Tema</label>
            <select id="theme" v-model="user.theme">
              <option value="light">Claro</option>
              <option value="dark" disabled>Escuro</option>
              <option value="auto" disabled>Automático</option>
            </select>
          </div>
        </div>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="user.emailNotifications">
            <span class="checkmark"></span>
            Receber notificações por e-mail
          </label>

          <label class="checkbox-label">
            <input type="checkbox" v-model="user.smsNotifications">
            <span class="checkmark"></span>
            Receber notificações por SMS
          </label>

          <label class="checkbox-label">
            <input type="checkbox" v-model="user.newsletter">
            <span class="checkmark"></span>
            Receber newsletter
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <!-- <button type="button" class="btn btn-secondary" @click="resetForm">
          Cancelar
        </button> -->
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </form>
    <!-- </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

import useBus from '~/composables/useBus'
// import { get } from 'http'
const bus = useBus()

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});


const fileInput = ref(null)
const isLoading = ref(false)
const previewImageFile = ref(null)
const previewImageUrl = ref(null)
const user = reactive({
  name: '',
  email: '',
  phone: '',
  birthdate: '',
  bio: '',
  fileName: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  city: '',
  state: '',
  language: 'pt-BR',
  theme: 'light',
  emailNotifications: true,
  smsNotifications: false,
  newsletter: true
})

const originalUser = { ...user }

onMounted(async () => {
  getUser();
})


const triggerFileUpload = () => {
  fileInput.value.click()
}

function getUser() {
  const userIn = useSupabaseUser();
  const meta = (userIn.value && userIn.value.user_metadata) ? userIn.value.user_metadata : {};
  // Map incoming metadata to the reactive `user` fields used in the template
  user.name = meta.nome || userIn.value?.user?.name || '';
  user.email = userIn.value?.emailUpdate || meta.emailUpdate || '';
  user.phone = meta.telefone || meta.telefoneContato || '';
  user.birthdate = meta.dataNascimento || meta.data_de_nascimento || '';
  user.bio = meta.biografia || meta.bio || '';
  user.fileName = userIn.value?.user_metadata?.fileName || '';
  user.cep = meta.cep || '';
  user.street = meta.rua || meta.logradouro || '';
  user.number = meta.numero || meta.number || '';
  user.complement = meta.complemento || meta.complement || '';
  user.city = meta.cidade || meta.city || '';
  user.state = meta.estado || meta.uf || '';
  user.language = meta.idioma || meta.language || 'pt-br';
  user.theme = meta.tema || meta.theme || 'light';
  user.emailNotifications = meta.receberEmail !== undefined ? meta.receberEmail : (meta.receberEmails !== undefined ? meta.receberEmails : true);
  user.smsNotifications = meta.receberSms !== undefined ? meta.receberSms : false;
  user.newsletter = meta.receberNewsletter !== undefined ? meta.receberNewsletter : true;
  return user;
}


const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    previewImageFile.value = file
    previewImageUrl.value = URL.createObjectURL(file)
    // Clear the input's value so selecting the same file again will trigger change
    try {
      if (fileInput.value) fileInput.value.value = null
    } catch (e) {
      // ignore if clearing fails in some environments
    }
  }
}

// const updatePassword = async () => {
//   const { data, error } = await supabase.auth.updateUser({
//     password: "555555"
//   });

//   console.log('Password update data:', data);
//   console.log('Password update error:', error);
// } 

const fetchAddressByCep = async () => {
  if (user.cep && user.cep.length === 9) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${user.cep.replace('-', '')}/json/`)
      const data = await response.json()
      if (!data.erro) {
        user.street = data.logradouro
        user.city = data.localidade
        user.state = data.uf
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }
}


const saveProfile = async () => {
  isLoading.value = true
  try {

    let fileNameToSave = user.fileName
    // Se o usuário selecionou uma nova imagem de preview, deleta a anterior do bucket antes de subir a nova
    if (previewImageFile.value) {
      // Se já existe uma imagem anterior, deleta do bucket
      if (user.fileName) {
        const { error: bucketError } = await supabase.storage
          .from('profiles')
          .remove([user.fileName])
        if (bucketError) {
          alert('Erro ao deletar imagem anterior do perfil: ' + bucketError.message)
          isLoading.value = false
          return
        }
      }
      // Faz upload da nova imagem
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(uuidv4(), previewImageFile.value, {
          cacheControl: '3600',
          contentType: previewImageFile.value.type,
        })
      if (uploadError) {
        alert('Erro ao enviar imagem de perfil: ' + uploadError.message)
        isLoading.value = false
        return
      }
      // uploadData.path can include folders; extract only the filename
      const uploadedPath = uploadData?.path || '';
      const uploadedName = uploadedPath.split('/').pop() || uploadedPath;
      fileNameToSave = uploadedName;
      // update reactive user.fileName so UI reflects the new file
      user.fileName = fileNameToSave;
      // getUser();
      bus.emit('user-profile-updated', { fileName: fileNameToSave });
    }


    // prepare metadata mapping (keep keys consistent with existing user_metadata)
    const metadata = {
      emailUpdate: user.email || '',
      nome: user.name || '',
      telefone: user.phone || user.telefone || '',
      dataNascimento: user.birthdate || user.dataNascimento || '',
      biografia: user.bio || user.biografia || '',
      fileName: fileNameToSave || user.fileName || '',
      cep: user.cep || '',
      rua: user.street || user.rua || '',
      numero: user.number || user.numero || '',
      complemento: user.complement || user.complemento || '',
      cidade: user.city || user.cidade || '',
      estado: user.state || user.estado || '',
      idioma: user.language || user.idioma || 'pt-BR',
      tema: user.theme || user.tema || 'light',
      receberEmail: user.emailNotifications !== undefined ? user.emailNotifications : (user.receberEmail !== undefined ? user.receberEmail : true),
      receberSms: user.smsNotifications !== undefined ? user.smsNotifications : (user.receberSms !== undefined ? user.receberSms : false),
      receberNewsletter: user.newsletter !== undefined ? user.newsletter : (user.receberNewsletter !== undefined ? user.receberNewsletter : true)
    };

    const payload = { data: metadata };
    // update email separately if present
    if (user.emailUpdate) payload.emailUpdate = user.emailUpdate;

    const { data: updateData, error: updateError } = await supabase.auth.updateUser(payload);
    if (updateError) {
      console.error('Erro ao atualizar usuário:', updateError);
      // provide simple feedback
      alert('Erro ao salvar perfil: ' + (updateError.message || JSON.stringify(updateError)));
    } else {
      // success: update local reactive original snapshot
      Object.assign(originalUser, JSON.parse(JSON.stringify(user)));
      // alert('Perfil atualizado com sucesso.');
      useToastify("Perfil atualizado com sucesso!", {
        autoClose: 2000,
        theme: "light",
        type: "success",
        position: ToastifyOption.POSITION.TOP_RIGHT,
      });
    }
  } catch (err) {
    console.error('saveProfile error:', err);
    alert('Erro ao salvar perfil. Veja o console para mais detalhes.');
  } finally {
    isLoading.value = false;
  }
}

const resetForm = () => {
  Object.assign(user, originalUser)
}
</script>

<style scoped>
/* Reset e Base */
* {
  box-sizing: border-box;
}

.profile-container {
  background-color: #f8f9fa;
  padding: 20px;
}

.profile-wrapper {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

/* Header do Perfil */
.profile-header {
  background-color: #2935ff;
  color: #f0f0f0;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.profile-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.profile-header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Formulário de Perfil */
/* .profile-form {
  padding: 40px 0;
} */

/* Seção do Avatar */
.avatar-section {
  text-align: center;
  margin-bottom: 40px;
}

.avatar-container {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #06246c;
  transition: all 0.3s ease;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #06246c;
  color: white;
  border: 2px solid #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.avatar-upload-btn:hover {
  background-color: #06246c;
  transform: scale(1.1);
}

/* Seções do Formulário */
.form-section {
  margin-bottom: 40px;
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
}

.form-section h2 {
  color: #30369d;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

/* Layout do Formulário */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group-small {
  flex: 0 0 150px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: -webkit-fill-available;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 12px !important;
  transition: all 0.2s ease-in-out;
  background: white;
  color: #0C4F65;
  text-transform: uppercase;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #30369d;
  box-shadow: 0 0 0 3px rgba(48, 54, 157, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Grupo de Checkbox */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.2s ease-in-out;
  background-color: #f0f0f0;
}

.checkbox-label input[type="checkbox"]:checked+.checkmark {
  background: #e30614;
  border-color: #e30614;
}

.checkbox-label input[type="checkbox"]:checked+.checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Botões de Ação */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
  margin-top: 20px;
}

.btn {
  padding: 16px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out, transform 0.1s ease-in-out;
  min-width: 140px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #06246c;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #06246c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(227, 6, 20, 0.3);
}

.btn-primary:disabled {
  background: #a0a0a0;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

/* Responsividade Mobile */
@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
    min-height: calc(100vh - 80px - 80px);
  }

  .profile-header {
    padding: 30px 20px;
  }

  .profile-header h1 {
    font-size: 2rem;
  }

  /* .profile-form {
    padding: 30px 20px;
  } */

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-group-small {
    flex: 1;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .avatar-upload-btn {
    width: 35px;
    height: 35px;
  }

  .form-section {
    padding: 20px;
  }
}
</style>
