<template>
  <div class="page">
    <h1>Gerar Pass (Pass2U)</h1>

    <form @submit.prevent="submit">
      <label>
        Model ID
        <input v-model="modelId" placeholder="model_xxx" required />
      </label>

      <label>
        Payload (JSON)
        <textarea v-model="payloadText" rows="10" placeholder='{ "barcode": {"message":"123","altText":"123"}, "fields": [{"key":"name","value":"João"}] }'></textarea>
      </label>

      <div class="actions">
        <button type="submit" :disabled="loading">{{ loading ? 'Enviando…' : 'Criar Pass' }}</button>
      </div>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
    <pre v-if="result">{{ result }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// definePageMeta({
//   middleware: ['auth'],
//   layout: 'dashcliente',
//   ssr: false
// })

const modelId = ref('')
const payloadText = ref('{\n  "barcode": { "message":"1234567890", "altText":"1234567890" },\n  "fields": [ { "key":"name", "value":"João Silva" } ]\n}')
const loading = ref(false)
const error = ref('')
const result = ref('')

async function submit() {
  error.value = ''
  result.value = ''
  if (!modelId.value) {
    error.value = 'Informe o Model ID'
    return
  }
  let payload: any
  try {
    payload = JSON.parse(payloadText.value)
  } catch (e: any) {
    error.value = 'Payload JSON inválido'
    return
  }
  loading.value = true
  try {
    const res = await $fetch('/api/pass2u/create', {
      method: 'POST',
      body: { modelId: modelId.value, payload }
    })
    result.value = JSON.stringify(res, null, 2)
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Erro ao criar pass'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page { padding: 16px; }
form { display: grid; gap: 12px; max-width: 800px; }
label { display: grid; gap: 6px; font-weight: 600; }
input, textarea { width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
.actions { margin-top: 6px; }
button { height: 40px; padding: 0 16px; border: none; border-radius: 8px; background: #111827; color: #fff; cursor: pointer; }
.error { color: #b91c1c; margin-top: 12px; }
pre { background: #0b0b0f; color: #e5e7eb; padding: 12px; border-radius: 10px; overflow: auto; }
</style>
