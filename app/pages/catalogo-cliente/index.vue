<template>
  <div class="catalog-container">
    <h1>Catálogo de produtos</h1>
    <p>Catálogo de produtos para resgate!</p>
    <p><strong>Pontos disponíveis:</strong> <span>{{ sub ? sub.pontos : '—' }}</span></p>
 
    <div v-if="isLoading">
      <SkeletonGrid :count="4" />
    </div>
    <div v-if="apiErrorMessage" class="api-error">
      <p>{{ apiErrorMessage }}</p>
    </div>
    <div v-else-if="produtosCatalogo.length" class="catalog-grid">
      <div class="premio-card" v-for="(catalogo, index) in produtosCatalogo" :key="index" style="display:flex;align-items:center;padding:12px;gap: 15px;">
        <img :src="catalogo.fileName ? `https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/${'dabbf587-dd6f-48ae-9145-7d68a6c0107a'}/${catalogo.fileName}` : 'https://png.pngtree.com/png-vector/20210221/ourmid/pngtree-error-404-not-found-glitch-effect-png-image_2928215.jpg'" alt="imagem premio" style="width: auto;height: 100px;" />
        <div style="width:100%; text-align:left;">
          <p style="margin:2px 0;"><strong>{{ catalogo.nome }}</strong></p>
          <p style="margin:2px 0; color: #eab308;"><strong>{{ catalogo.pontos }} pts</strong></p>
          <p style="margin:2px 0; font-size:12px; color: #d1d5db;">{{ (catalogo ? catalogo.ativo_api === true ? 'Disponivel na loja' : 'Indisponivel na loja' : '') }}</p>
        </div>
        <button
          :disabled="!(sub && Number(sub.pontos) >= Number(catalogo.PONTOS))"
          :class="{ disabled: !(sub && Number(sub.pontos) >= Number(catalogo.PONTOS)) }"
          @click="trySolicitar(catalogo)"
        >
          Resgatar
        </button>
      </div>
    </div>
    <!-- Modal de desenvolvimento -->
    <!-- Modal de confirmação de resgate (CPF) -->
    <div v-if="showConfirmResgate"
      style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 24px; border-radius: 12px; max-width: 420px; width: 92%; text-align: left; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
        <h2 style="color: #2935ff; margin-bottom: 8px;">Confirmar resgate</h2>
        <p style="margin: 0 0 12px 0; color:#444;">Você está prestes a solicitar o prêmio: <strong>{{ currentCatalogo ? (currentCatalogo.NOMEPREMIO || currentCatalogo.nome) : '' }}</strong></p>

        <p>Seu saldo atual: <strong>{{ sub ? sub.pontos : '—' }} pts</strong></p>
        <p>Pontos do prêmio: <strong>{{ currentCatalogo ? currentCatalogo.PONTOS : '—' }} pts</strong></p>

        <p>Ao confirmar, os pontos serão debitados do seu saldo. E direcionados para avaliação de liberação do resgate.</p>

        <label style="display:block;margin-bottom:6px;font-size:14px;color:#333;">Informe seu CPF para confirmar:</label>

        <input v-model="confirmCpf" type="tel" placeholder="000.000.000-00" v-maska="'###.###.###-##'" maxlength="14" required style="width: -webkit-fill-available;padding:10px;border-radius:8px;border:1px solid #ddd;margin-bottom:8px;" />


        <div style="color:#b91c1c;font-size:13px;min-height:18px;margin-bottom:8px;">{{ cpfError }}</div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
          <button @click="cancelarConfirmResgate" style="background:#fff;border:1px solid #ddd;padding:8px 14px;border-radius:8px;">Cancelar</button>
          <button @click="confirmarResgate" style="background:#2935ff;color:#fff;padding:8px 14px;border-radius:8px;border:none;font-weight:600;">Confirmar</button>
        </div>
      </div>
    </div>

    <!-- Modal de sucesso após confirmar resgate -->
    <div v-if="showResgateSuccess"
      style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 28px; border-radius: 12px; max-width: 420px; width: 92%; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
        <h2 style="color: #059669; margin-bottom: 8px;">Solicitação enviada</h2>
        <p style="color:#333;margin-bottom:12px;">Recebemos sua solicitação de resgate. Em breve entraremos em contato pelo seu número de WhatsApp para confirmar os detalhes e finalizar o processo.</p>
        <p style="color:#666;font-size:13px;margin-bottom:16px;">Caso precise, mantenha seu telefone disponível.</p>
        <button @click="fecharSucessoResgate" style="background:#2935ff;color:#fff;padding:10px 18px;border-radius:8px;border:none;font-weight:600;">Ok, entendi</button>
      </div>
    </div>
    <div v-if="showModalDesenvolvimento"
      style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <div
        style="background: white; padding: 32px 24px; border-radius: 12px; max-width: 350px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
        <h2 style="color: #e30614; margin-bottom: 16px;">Em desenvolvimento</h2>
        <p style="margin-bottom: 24px;">O módulo de resgate está em desenvolvimento.<br>Em breve estará disponível!</p>
        <button
          style="background-color: #2935ff; color: white; padding: 10px 24px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;"
          @click="showModalDesenvolvimento = false">Fechar</button>
      </div>
    </div>
    <!-- Modal pontos insuficientes -->
    <div v-if="showModalInsuficiente"
      style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 28px 20px; border-radius: 12px; max-width: 380px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
        <h2 style="color: #e30614; margin-bottom: 12px;">Pontos insuficientes</h2>
        <p style="margin-bottom: 12px;">Você não possui pontos suficientes para solicitar este resgate.</p>
        <p style="margin-bottom: 18px; font-size: 14px; color: #444;">Seus pontos: <strong>{{ sub ? sub.pontos : 0 }}</strong></p>
        <button
          style="background-color: #2935ff; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;"
          @click="showModalInsuficiente = false">Fechar</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { vMaska } from "maska/vue"
import { ref, onMounted } from "vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});

import useBus from '~/composables/useBus'
// import { get } from 'http'
const bus = useBus()

import SkeletonGrid from '~/components/SkeletonGrid.vue';

const produtosCatalogo = ref([]);
const listPremios = ref([]);
const sub = ref(null);
const isLoading = ref(true);
const showModalDesenvolvimento = ref(false);
const showModalInsuficiente = ref(false);
const apiErrorMessage = ref('');

// Resgate confirmation modal state
const showConfirmResgate = ref(false);
const confirmCpf = ref('');

const cleanCpf = (cpf) => cpf.replace(/\D/g, '');

const cpfError = ref('');
const currentCatalogo = ref(null);
const showResgateSuccess = ref(false);

function getUser() {
  const user = useSupabaseUser();
  sub.value = user.value.user_metadata;
  console.log('User data:', user.value.user_metadata);
  return user.value;
}

const supabase = useSupabaseClient();

onMounted(async () => {
  getUser();
  await fetchCatalogoData();
});



// Predefined product names and image URLs. You can replace these URLs
// with local files under `/public/images/defaults/` if you prefer.
const predefinedItems = [
  { name: 'POTE DE SORVETE', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/sorvete.png' },
  { name: 'CAIXA DE SABONETE', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/natura.png' },
  { name: 'CAPA PARA CELULAR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/capinha.png' },
  { name: 'HIDRATANTE', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/hidratante.png' },
  { name: 'VITAMINA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/vitamina.png' },
  { name: 'PERFUME', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/perfume.png' },
  { name: 'FONE DE OUVIDO', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/fone.png' },
  { name: 'GARRAFA TERMICA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/garrafa.png' },
  { name: 'BALANÇA DIGITAL', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/balanca.png' },
  { name: 'ARMAÇÃO', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/armacao.png' },
  { name: 'CHAPINHA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/chapinha.png' },
  { name: 'SANDUICHEIRA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/sanduicheira.png' },
  { name: 'PROCESSADOR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/processador.png' },
  { name: 'FERRO DE PASSAR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/ferrodepassar.png' },
  { name: 'MICROONDAS', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/microondas.png' },
  { name: 'BATEDEIRA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/batedeira.png' },
  { name: 'CAFETEIRA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/cafeteira.png' },
  { name: 'RELOGIO', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/smartwatch.png' },
  { name: 'VENTILADOR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/ventilador.png' },
  { name: 'LIQUIDIFICADOR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/liquidifficador.png' },
  { name: 'PANELA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/panela.png' },
  { name: 'JOGO DE PANELA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/jogopanela.png' },
  { name: 'ASPIRADOR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/aspirador.png' },
  { name: 'FILTRO DE AGUA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/filtroagua.png' }
];

// Fallback image path — put a file at `public/images/default-product.png`
// or change to a remote URL or an imported asset from `~/assets`.
const defaultImage = '/images/default-product.png';

function normalizeText(str = '') {
  return String(str)
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^A-Z0-9\s]/g, '')
    .trim();
}

function getImageForNome(title) {
  if (!title) return defaultImage;
  const t = normalizeText(title);
  // exact / contains match first
  for (const item of predefinedItems) {
    const n = normalizeText(item.name);
    if (t.includes(n) || n.includes(t)) return item.img;
  }
  // token overlap scoring
  const tokens = t.split(/\s+/).filter(Boolean);
  let best = { score: 0, img: defaultImage };
  for (const item of predefinedItems) {
    const n = normalizeText(item.name);
    const itemTokens = n.split(/\s+/).filter(Boolean);
    const intersect = tokens.filter(x => itemTokens.includes(x));
    const score = intersect.length / Math.max(tokens.length, itemTokens.length);
    if (score > best.score) best = { score, img: item.img };
  }
  // threshold to avoid bad matches
  return best.score >= 0.25 ? best.img : defaultImage;
}

function formatDateISO(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}


// async function consultarPremios() {
//   console.log('consultarPremios called with cpf:', sub.cpf);
//   try {
//     const res = await $fetch('/api/inova/consultar_lista_premios', {
//       method: 'POST',
//       body: {
//         cnpj: '16723042000190',
//         parametros: [sub.value.cpf]
//       },
//       headers: (() => {
//         const t = localStorage.getItem('inovaAccessToken')
//         return t ? { Authorization: `Bearer ${t}` } : undefined
//       })()
//     })
//     // Tratativa: quando a API retorna um objeto informando que o servidor nao está conectado
//     if (Array.isArray(res?.data) && res.data.length > 0 && res.data[0].sucesso === false) {
//       // exibe a mensagem vinda da API
//       apiErrorMessage.value = res.data[0].mensagem || res.raw || 'Erro ao consultar prêmios.';
//       produtosCatalogo.value = [];
//       console.warn('API returned failure:', res);
//     } else {
//       apiErrorMessage.value = '';
//        const lista = Array.isArray(res.data) ? res.data : [];
//       produtosCatalogo.value = lista.filter(item => item?.ATIVO === true);
//       console.log('Premios list:', produtosCatalogo.value);
//     }
//   } catch (e) {
//     console.warn('Falha ao consultar usuários INOVA:', e)
//     apiErrorMessage.value = 'Falha ao consultar prêmios. Tente novamente mais tarde.';
//   }
// }

async function consultarPremios() {
  console.log('Fetching produtos_sorteio...');
  const { data, error } = await supabase.from('produtos_extensao').select('*');
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('Sorteio data:', data);
    // produtosSorteio.value = data;
    // produtosCatalogo.value = data;

    produtosCatalogo.value = Array.isArray(data)
      ? data.slice().sort((a, b) => {
          const pa = Number(a?.pontos ?? a?.PONTOS ?? 0);
          const pb = Number(b?.pontos ?? b?.PONTOS ?? 0);
          return pb - pa;
        })
      : [];

  }
}


async function fetchCatalogoData() {
  isLoading.value = true;
  try {
    await consultarPremios();
  } finally {
    // small delay to avoid flicker in very fast responses
    setTimeout(() => { isLoading.value = false }, 200);
  }
}

function abrirModalDesenvolvimento() {
  showModalDesenvolvimento.value = true;
}

function fecharModalDesenvolvimento() {
  showModalDesenvolvimento.value = false;
}

function trySolicitar(catalogo) {
  const pontosUsuario = sub && sub.value ? Number(sub.value.pontos || 0) : 0;
  const pontosNecessarios = Number(catalogo.PONTOS || 0);
  if (pontosUsuario >= pontosNecessarios) {
    // abrir modal de confirmação e pedir CPF
    currentCatalogo.value = catalogo;
    confirmCpf.value = '';
    cpfError.value = '';
    showConfirmResgate.value = true;
  } else {
    showModalInsuficiente.value = true;
  }
}

function cancelarConfirmResgate() {
  showConfirmResgate.value = false;
  confirmCpf.value = '';
  cpfError.value = '';
  currentCatalogo.value = null;
}

async function confirmarResgate() {
  // basic CPF validation: accept 11 digits (strip formatting)

  const cleanedCpf = cleanCpf(confirmCpf.value) // return ex: 00000000000

  console.log('sub com CPF:', sub.value.cpf);
  console.log('CPF informado:', cleanedCpf);

  if (cleanedCpf.length !== 11) {
    cpfError.value = 'Informe um CPF válido (11 dígitos).';
    return;
  }

  if (cleanedCpf !== sub.value.cpf) {
    cpfError.value = 'O CPF informado não corresponde ao CPF do seu cadastro.';
    return;
  }


  cpfError.value = '';
  showConfirmResgate.value = false;

  console.log('Confirmando resgate para prêmio:', sub.value.pontos);
  console.log('Prêmio:', Number(currentCatalogo.value.PONTOS));

  let pontosUsuario = Number(currentCatalogo.value.PONTOS);
  let nomePremio = currentCatalogo.value.NOMEPREMIO;

  const { data, error } = await supabase.auth.updateUser({
    data: {
      pontos: sub.value.pontos - Number(currentCatalogo.value.PONTOS)
    }
  });

  if (error) {
    console.error('Erro ao atualizar pontos do usuário:', error);
    cpfError.value = 'Erro ao processar resgate. Tente novamente mais tarde.';
    return;
  }

  if (data) {
    console.log('Pontos atualizados com sucesso:', data.user.user_metadata.pontos);
    const pedidoPayload = {
      created_at: new Date().toISOString(),
      user_id: data.user.id,
      cpf_cliente: cleanedCpf,
      contato_cliente: data.user.user_metadata.telefone || '',
      nome_pedido: nomePremio || 'Premio sem nome',
      nome_cliente: sub?.value?.nome || sub?.value?.email || 'Cliente',
      pontos_pedido: pontosUsuario,
      pedido_liberado: false // inicia como false, será aprovado depois
    }

    try {
      const res = await $fetch('/api/pedidos_clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pedidoPayload
      })

      console.log('Pedido criado:', res)
      // tratar retorno — exibir toast, atualizar UI, etc.
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
      // exibir mensagem de erro ao usuário
    }
  }

  bus.emit('pontos-updated', { pontos: data.user.user_metadata.pontos });

  // Aqui você pode chamar a API para criar a solicitação de resgate.
  // Exemplo (opcional):
  // try {
  //   await $fetch('/api/resgates', { method: 'POST', body: { premioId: currentCatalogo.value.id, cpf: digits } })
  // } catch (e) { console.error('Erro ao enviar solicitação', e) }

  // mostra a tela de sucesso reforçando o contato por WhatsApp
  showResgateSuccess.value = true;
}

function fecharSucessoResgate() {
  showResgateSuccess.value = false;
  currentCatalogo.value = null;
  confirmCpf.value = '';
}
</script>

<style scoped>
.loading-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1.5rem;
  font-size: 1.1rem;
  color: #333;
}


.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #e0e0e0;
  border-top: 6px solid #e30614;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.catalog-container {
  padding: 30px 20px;
}

.catalog-container h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #30369d;
}

.catalog-container>p {
  margin-bottom: 30px;
  color: #555;
}

.catalog-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
  }
}

.premio-card {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  background-image: url(../../../public/images/backgroundblue.png);
  background-repeat: no-repeat;
  background-size: cover;
  width: 92%;
  border-radius: 8px;
  color: #ffffff;
}

.premio-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}


.premio-card button {
  margin-left: auto;
  background-color: #e30614;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
}

.premio-card button:hover {
  background-color: #b70411;
}

.premio-card button.disabled,
.premio-card button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background-color: #c9c9c9;
}

.api-error {
  background: #fff4f4;
  border: 1px solid #ffd0d0;
  color: #7a1b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 12px 0;
}
.api-error p { margin: 0 }
</style>