<template>
  <div class="catalog-container">
    <!-- <h1>Prêmios resgatados</h1>
    <p>Confira seus prêmios resgatados abaixo.</p>
    <div v-if="isLoading">
      <SkeletonGrid :count="4" />
    </div>

    <div v-else-if="apiErrorMessage" class="api-error">
      <p>{{ apiErrorMessage }}</p>
    </div> -->

    <PremiosCarousel title="Prêmios resgatados" subtitle="Confira seus prêmios resgatados abaixo." :items="listPremios"
      :slides-per-view="1" empty-text="Nenhum prêmio resgatado ainda."
      :getImage="(it) => getImageForNome(it.NOMEPREMIO)">
      <template #item="{ item }">
        <div class="premio-card" style="display:flex;align-items:center;padding:12px;">
          <img :src="getImageForNome(item.NOMEPREMIO)" alt="imagem premio" style="width: auto;height: 100px;" />
          <div style="width:100%; text-align:left;">
            <p style="margin:2px 0;"><strong>{{ item.NOMEPREMIO }}</strong></p>
            <p style="margin:2px 0; color: #eab308;"><strong>{{ item.PONTOS }} pts</strong></p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">Entregue por: {{ item.NOMEFUNCIONARIO }}</p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">Data entregue: {{
              formatDateISO(item.DATALANCAMENTO) }}</p>
          </div>
        </div>
      </template>
      <template #empty>
        <div style="display: grid;">
          <img src="/images/menina.png" width="100" style="margin: 0 auto;" />
          <p style="text-align: center; color: #6b7280;font-weight: 100;margin: 0;">Nenhum prêmio resgatado ainda.</p>
        </div>
      </template>
    </PremiosCarousel>

    <!-- <h1>Solicitação de prêmios</h1>
    <p>Confira seus prêmios solicitados abaixo.</p>
    <div v-if="isLoading">
      <SkeletonGrid :count="4" />
    </div>

    <div v-else-if="apiErrorMessage" class="api-error">
      <p>{{ apiErrorMessage }}</p>
    </div> -->

    <!-- <PremiosCarousel title="Solicitação de prêmios" subtitle="Confira seus prêmios solicitados abaixo."
      :items="listaSolicitacoes" :slides-per-view="1" empty-text="Nenhum prêmio foi solicitado ainda.">
      <template #item="{ item }">
        <div class="premio-card" style="display:flex;align-items:center;padding:12px;">
          <div style="width:100%; text-align:left;">
            <p style="margin:2px 0;"><strong>{{ item.nome_pedido }}</strong></p>
            <p style="margin:2px 0; color: #eab308;"><strong>{{ item.pontos_pedido }} pts</strong></p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">Aguardando confirmação</p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">Data solicitado: {{ formatDateISO(item.created_at)
              }}</p>
          </div>
        </div>
      </template>
      <template #empty>
        <div style="display: grid;">
          <img src="/images/menina.png" width="100" style="margin: 0 auto;" />
          <p style="text-align: center; color: #6b7280;font-weight: 100;margin: 0;">Nenhum prêmio foi solicitado ainda.
          </p>
        </div>
      </template>
    </PremiosCarousel> -->



    <!-- <PremiosCarousel title="Últimos ganhadores" subtitle="Confira os últimos ganhadores."
      :items="listaSolicitacoes" :slides-per-view="1" empty-text="Nenhum ganhador listado.">
      <template #item="{ item }">
        <div class="premio-card" style="display:flex;align-items:center;padding:12px;">
          <div style="width:100%; text-align:left;">
            <p style="margin:2px 0;"><strong>{{ item.nome_pedido }}</strong></p>
            <p style="margin:2px 0; color: #eab308;"><strong>{{ item.pontos_pedido }} pts</strong></p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">Aguardando confirmação</p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">Data solicitado: {{ formatDateISO(item.created_at)
              }}</p>
          </div>
        </div>
      </template>
      <template #empty>
        <div style="display: grid;">
          <img src="/images/menina.png" width="100" style="margin: 0 auto;" />
          <p style="text-align: center; color: #6b7280;font-weight: 100;margin: 0;">Nenhum ganhador listado.
          </p>
        </div>
      </template>
    </PremiosCarousel> -->

  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import SkeletonGrid from '~/components/SkeletonGrid.vue';
import PremiosCarousel from '~/components/PremiosCarousel.vue';
import { createClient } from "@supabase/supabase-js";
definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});

const sub = ref(null);
const pontos = ref(0);
const listPremios = ref([]);
const listaSolicitacoes = ref([]);
const isLoading = ref(true);
const apiErrorMessage = ref('');

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


function getUser() {
  const user = useSupabaseUser();
  sub.value = user.value.user_metadata;
  console.log('User data:', user.value.user_metadata);
  return user.value;
}

async function fetchSolicitacoes() {
  // Buscar apenas solicitações que ainda não foram liberadas (pedido_liberado = false)
  const { data, error } = await supabase.from('pedidos_clientes').select('*').eq('pedido_liberado', false);
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('catalogo data:', data);
    listaSolicitacoes.value = data;
  }
}


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

async function consultarPremios() {
  console.log('consultarPremios called with cpf:', sub.cpf);
  isLoading.value = true;
  try {
    const res = await $fetch('/api/inova/consultar_premios', {
      method: 'POST',
      body: {
        cnpj: '16723042000190',
        parametros: [sub.value.cpf]
      },
      headers: (() => {
        const t = localStorage.getItem('inovaAccessToken')
        return t ? { Authorization: `Bearer ${t}` } : undefined
      })()
    })
    // Tratativa: se a API retornar um objeto indicando falha (sucesso: false)
    if (Array.isArray(res?.data) && res.data.length > 0 && res.data[0].sucesso === false) {
      apiErrorMessage.value = res.data[0].mensagem || res.raw || 'Erro ao consultar prêmios.';
      listPremios.value = [];
      console.warn('API returned failure:', res);
    } else {
      apiErrorMessage.value = '';
      listPremios.value = [];
    }
  } catch (e) {
    console.warn('Falha ao consultar usuários INOVA:', e)
    listPremios.value = []
    apiErrorMessage.value = 'Falha ao consultar prêmios. Tente novamente mais tarde.';
  } finally {
    isLoading.value = false;
  }
}


onMounted(async () => {
  getUser();
  fetchSolicitacoes();
  await consultarPremios();
});
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
  padding: 30px 0px;
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
  /* display: flex;
  gap: 20px;
  align-items: flex-start;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap; */

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

/* Skeleton styles */
.premio-card.skeleton {
  align-items: center;
}

.skeleton-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background: linear-gradient(90deg, #eee, #f5f5f5, #eee);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
  margin-right: 16px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #eee, #f5f5f5, #eee);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
  border-radius: 6px;
  margin-bottom: 8px;
}

.skeleton-line.short {
  width: 40%;
  height: 16px;
  margin-bottom: 10px
}

@keyframes shimmer {
  0% {
    background-position: 200% 0
  }

  100% {
    background-position: -200% 0
  }
}

.api-error {
  background: #fff4f4;
  border: 1px solid #ffd0d0;
  color: #7a1b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 12px 0;
}

.api-error p {
  margin: 0
}
</style>