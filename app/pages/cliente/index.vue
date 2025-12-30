<template>
  <div>
    <div style="padding: 20px 20px 10px 20px;text-align: center;">
      <h1 style="margin: 0px;font-size: 18px;color: #ef3237;text-transform: uppercase;">Nossas novidades</h1>
      <p style="margin: 0;font-size: 14px;font-weight: 100;">Acompanhe as últimas novidades e promoções.</p>
      <!-- <div style="margin-top:8px;">
        <button @click="sendTestEmail" style="background:#001b64;color:#fff;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;font-weight:600;">Enviar teste de e-mail</button>
      </div> -->
    </div>
    <!-- Banners carousel using PremiosCarousel (overlaid social icons) -->
    <PremiosCarousel
      :items="produtosCatalogo"
      :slides-per-view="slidesPerView"
      :getImage="(it) => (it.fileName ? `https://api.drogariapopular24h.com.br/storage/v1/object/public/banners/${'dabbf587-dd6f-48ae-9145-7d68a6c0107a'}/${it.fileName}` : '')"
      subtitle=""
      title=""
    >
      <template #item="{ item }">
        <div style="position:relative; width:100%; display:flex; justify-content:center;">
          <img
            :src="item.fileName ? `https://api.drogariapopular24h.com.br/storage/v1/object/public/banners/${'dabbf587-dd6f-48ae-9145-7d68a6c0107a'}/${item.fileName}` : ''"
            :alt="item.DESCRICAO || 'Imagem do Produto'"
            :style="{ cursor: item && item.link ? 'pointer' : 'default', width: '92%', height: '220px', objectFit: 'cover', borderRadius: '8px' }"
            @click="item && item.link && handleBannerClick(item)"
          />

          <!-- Overlay icons (bottom-right) -->
          <!-- <div style="position:absolute; right: calc(6%); bottom: 8px; display:flex; gap:8px;">
            <a :href="'https://api.whatsapp.com/send?phone=+5594992124615&text=Olá, estou precisando de ajuda!'" target="_blank" rel="noopener" aria-label="WhatsApp">
              <img src="https://media.tenor.com/_wjh6GwPiU4AAAAi/whatsapp.gif" alt="WhatsApp" style="width:36px;height:36px;border-radius:50%;background: #b9f8cf;padding:6px;box-shadow:0 2px 6px rgba(0,0,0,0.2);"/>
            </a>
            <a :href="item && item.instagram ? item.instagram : 'https://www.instagram.com/drogariapopulardopara24h'" target="_blank" rel="noopener" aria-label="Instagram">
              <img src="https://media.tenor.com/QsaxvK8W_AoAAAAj/araslot-instagram.gif" alt="Instagram" style="width:36px;height:36px;border-radius:50%;background: #ffc9c9;padding:6px;box-shadow:0 2px 6px rgba(0,0,0,0.2);"/>
            </a>
          </div> -->
        </div>
      </template>
    </PremiosCarousel>


    <PremiosCarousel
      :title="`${produtosLivres.length} Prêmios disponíveis`"
      subtitle="Confira todos os prêmios disponíveis para resgate."
      :items="produtosLivres"
      :slides-per-view="slidesPerView"
      :getImage="(it) => getImageForNome(it.NOMEPREMIO)"
    >
      <template #item="{ item }">
        <div class="card-premios-swipe" style="display:flex;align-items:center;padding:12px;gap: 15px;">
          <img :src="item.fileName ? `https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/${'dabbf587-dd6f-48ae-9145-7d68a6c0107a'}/${item.fileName}` : 'https://png.pngtree.com/png-vector/20210221/ourmid/pngtree-error-404-not-found-glitch-effect-png-image_2928215.jpg'" alt="imagem premio" style="width: auto;height: 100px;" />
          <!-- <pre>{{ item }}</pre> -->
          <div style="width:100%; text-align:left;">
            <p style="margin:2px 0;"><strong>{{ item.nome }}</strong></p>
            <p style="margin:2px 0; color: #eab308;"><strong>{{ item.pontos }} pts</strong></p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">{{ (item ? item.ativo_api === true ? 'Disponivel na loja' : 'Indisponivel na loja' : '') }}</p>
          </div>
        </div>
      </template>
    </PremiosCarousel>

    <PremiosCarousel
      title="Prêmios resgatados"
      subtitle="Confira todos os prêmios resgatados por você."
      :items="listPremios"
      :slides-per-view="slidesPerView"
      empty-text="Nenhum prêmio resgatado ainda."
      :getImage="(it) => getImageForNome(it.NOMEPREMIO)"
    >
      <template #item="{ item }">
        <div class="card-premios-swipe" style="display:flex;align-items:center;padding:12px;">
          <img :src="getImageForNome(item.NOMEPREMIO)" alt="imagem premio" style="width: auto;height: 100px;" />
          <div style="width:100%; text-align:left;">
            <p style="margin:2px 0;"><strong>{{ item.NOMEPREMIO }}</strong></p>
            <p style="margin:2px 0; color: #eab308;"><strong>{{ item.PONTOS }} pts</strong></p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">Entregue por: {{ item.NOMEFUNCIONARIO }}</p>
            <p style="margin:2px 0; font-size:12px; color: #d1d5db;">Data entregue: {{ formatDateISO(item.DATALANCAMENTO) }}</p>
          </div>
        </div>
      </template>
      <template #empty>
        <div style="display: grid;">
          <img src="/images/menina.png" width="100" style="margin: 0 auto;"/>
          <p style="text-align: center; color: #6b7280;font-weight: 100;margin: 0;">Nenhum prêmio resgatado ainda.</p>
        </div>
      </template>
    </PremiosCarousel>


    <div style="padding: 20px 20px 10px 20px;">
      <h1 style="margin: 0px;font-size: 18px;color: #2935ff;text-transform: uppercase;">Nossos parceiros</h1>
      <p style="margin: 0;font-size: 14px;font-weight: 100;">Empresas que fazem parte do nosso programa de fidelidade.</p>
    </div>


    <swiper
      v-if="listPremios.length"
      class="my-swiper"
      :slides-per-view="slidesPerView"
      :space-between="0"
      :grab-cursor="true"
      :centered-slides="false"
      :breakpoints="{
        320: { slidesPerView: 1.05 },
        480: { slidesPerView: 1.15 },
        768: { slidesPerView: 1.35 },
        1024: { slidesPerView: 1.6 }
      }"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(catalogo, index) in listParceiros" :key="index" class="swiper-slide">
        <div class="card-premios-swipe-parceiros" :style="catalogo.fileName ? `background-image: url('https://api.drogariapopular24h.com.br/storage/v1/object/public/parceiros/${'dabbf587-dd6f-48ae-9145-7d68a6c0107a'}/${catalogo.fileName}')` : ''">
        </div>
      </swiper-slide>
    </swiper>


    <a>
      <img src="/images/banner-instagram.png" style="width: -webkit-fill-available;margin: 50px 20px;border-radius: 5px;margin-top: 20px;"/>
    </a>

    <!-- <a>
      <img src="/images/banner-whatsapp.png" style="width: -webkit-fill-available;margin: 0 20px;border-radius: 0 0 5px 5px;"/>
    </a> -->

    <!-- CRIAR UM POPUP AO MONTAR O COMPONENTE -->
     
    <!-- <div class="info-section">
      <img src="/images/menina.png" alt="Menina" width="200" />
      <p>Como acumular pontos ?</p>
      <div class="buttons">
        <button @click="openVideo" class="conferir">
          <span class="material-icons">smart_display</span>
          Conferir video
        </button>
        <button @click="openDescription" class="description">
          <span class="material-icons">description</span>
          Descrições
        </button>
      </div>
    </div> -->


    <div v-if="videoinfo" class="video-container">
      <button @click="videoinfo = false" class="close-button">X</button>
      <video src="/video/videofarmacia.mp4" controls width="600" style="width: 80%;border-radius: 30px;"></video>
    </div>


    <div v-if="descriptioninfo" class="video-container">
      <button @click="descriptioninfo = false" class="close-button">X</button>

      <div class="description-content">
        <h2>Como acumular pontos ?</h2>
        <p>Para cada R$ 1,00 gasto em compras na drogaria, você acumula 1 ponto no seu cartão fidelidade. Além disso,
          você pode ganhar pontos extras ao participar de promoções especiais e eventos exclusivos.</p>
        <h3>Benefícios do Programa de Fidelidade:</h3>
        <ul>
          <li>Descontos exclusivos em produtos selecionados.</li>
          <li>Acesso antecipado a promoções e lançamentos.</li>
          <li>Ofertas personalizadas com base nas suas preferências de compra.</li>
          <li>Possibilidade de resgatar pontos por produtos ou serviços na drogaria.</li>
        </ul>
        <p>Não perca a oportunidade de economizar e aproveitar todos os benefícios do nosso programa de fidelidade.
          Comece a acumular pontos hoje mesmo!</p>
      </div>
    </div>


    <a href="https://api.whatsapp.com/send?phone=+5594992124615&amp;text=Olá, estou precisando de ajuda!" target="_blank" class="btn-whatsapp-pulse btn-whatsapp-pulse-border">
      <img src="/images/whats.svg" width="35" height="35" class="icons-contact" alt="WhatsApp">
    </a>
    

    <!-- <a v-if="sub?.codigoCliente" href="`https://api.whatsapp.com/send?phone=+5594992124615&amp;text=Olá, estou precisando de ajuda!, este e meu CVV: {{ sub?.codigoCliente }}`" target="_blank" class="btn-whatsapp-pulse btn-whatsapp-pulse-border">
      <img src="/images/whats.svg" width="35" height="35" class="icons-contact" alt="WhatsApp">
    </a>

    <a v-else href="`https://api.whatsapp.com/send?phone=+5594992124615&amp;text=Olá, estou precisando de ajuda!, este e meu CVV: {{ sub?.codigoCliente }}`" target="_blank" class="btn-whatsapp-pulse btn-whatsapp-pulse-border">
      <img src="/images/whats.svg" width="35" height="35" class="icons-contact" alt="WhatsApp">
    </a> -->

    <!-- <pre>{{ sub?.codigoCliente }}</pre> -->
  </div>
  
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});

const { coords, address, permission, startWatch, stopWatch, refreshOnce } = useUserLocation();

import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { createClient } from "@supabase/supabase-js";
// Swiper
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/free-mode';
import PremiosCarousel from '../../components/PremiosCarousel.vue';

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const produtosCatalogo = ref([]);
const produtosLivres = ref([]);
const listPremios = ref([]);
const listParceiros = ref([]);
const isLoading = ref(true);
const sub = ref(null);
const apiErrorMessage = ref('');
const videoinfo = ref(false);
const descriptioninfo = ref(false);

async function fetchCatalogoData() {
  try {
    const { data, error } = await supabase.from('banners_produtos').select('*').order('order', { ascending: true });
    if (error) {
      console.error('Error fetching sorteio data:', error);
      produtosCatalogo.value = [];
      return;
    }

    const sorted = Array.isArray(data)
      ? data.slice().sort((a, b) => {
          const oa = Number(a?.order ?? Number.POSITIVE_INFINITY)
          const ob = Number(b?.order ?? Number.POSITIVE_INFINITY)
          return oa - ob
        })
      : [];

    console.log('catalogo data (sorted):', sorted);
    produtosCatalogo.value = sorted;
  } catch (err) {
    console.error('Error fetching catalogo data:', err);
    produtosCatalogo.value = [];
  }
}

async function produtosListados() {
  console.log('Fetching produtos_sorteio...');
  const { data, error } = await supabase.from('produtos_extensao').select('*');
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('Sorteio data:', data);
    // produtosSorteio.value = data;
    // Ordena por pontos decrescente (maior -> menor). Suporta campos 'pontos' ou 'PONTOS'.
    produtosLivres.value = Array.isArray(data)
      ? data.slice().sort((a, b) => {
          const pa = Number(a?.pontos ?? a?.PONTOS ?? 0);
          const pb = Number(b?.pontos ?? b?.PONTOS ?? 0);
          return pb - pa;
        })
      : [];
  }
}

async function fetchParceirosData() {
  const { data, error } = await supabase.from('parceiros').select('*');
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('parceiros data:', data);
    listParceiros.value = data;
  }
}

function getUser() {
  const user = useSupabaseUser();
  sub.value = user.value.user_metadata;
  console.log('User data:', user.value.user_metadata);
  return user.value;
}

// async function fetchProdutosLivresData() {
//   console.log('consultarPremios called with cpf:', sub.value?.cpf);
//   try {
//     const res = await $fetch('/api/inova/consultar_lista_premios', {
//       method: 'POST',
//       body: { cnpj: '16723042000190', parametros: [sub.value.cpf] },
//       headers: localStorage.getItem('inovaAccessToken') ? { Authorization: `Bearer ${localStorage.getItem('inovaAccessToken')}` } : undefined
//     });

//     if (Array.isArray(res?.data) && res.data.length > 0 && res.data[0].sucesso === false) {
//       apiErrorMessage.value = res.data[0].mensagem || 'Erro ao consultar prêmios.';
//       produtosLivres.value = [];
//     } else {
//       const listaBruta = Array.isArray(res.data) ? res.data : [];
//       const ativos = listaBruta.filter(item => item?.ATIVO === true);
      
//       produtosLivres.value = await sincronizarEMesclar(ativos);
//     }
//   } catch (e) {
//     console.warn('Falha API:', e);
//     apiErrorMessage.value = 'Falha ao consultar prêmios.';
//   }
// }

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
      listPremios.value = res.data || [];
    }
  } catch (e) {
    console.warn('Falha ao consultar usuários INOVA:', e)
    listPremios.value = []
    apiErrorMessage.value = 'Falha ao consultar prêmios. Tente novamente mais tarde.';
  } finally {
    isLoading.value = false;
  }
}

// Predefined product names and image URLs. You can replace these URLs
// with local files under `/public/images/defaults/` if you prefer.

// const predefinedItems = [
//   { name: 'POTE DE SORVETE', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/sorvete.png' },
//   { name: 'CAIXA DE SABONETE', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/natura.png' },
//   { name: 'CAPA PARA CELULAR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/capinha.png' },
//   { name: 'HIDRATANTE', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/hidratante.png' },
//   { name: 'VITAMINA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/vitamina.png' },
//   { name: 'PERFUME', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/perfume.png' },
//   { name: 'FONE DE OUVIDO', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/fone.png' },
//   { name: 'GARRAFA TERMICA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/garrafa.png' },
//   { name: 'BALANÇA DIGITAL', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/balanca.png' },
//   { name: 'ARMAÇÃO', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/armacao.png' },
//   { name: 'CHAPINHA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/chapinha.png' },
//   { name: 'SANDUICHEIRA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/sanduicheira.png' },
//   { name: 'PROCESSADOR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/processador.png' },
//   { name: 'FERRO DE PASSAR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/ferrodepassar.png' },
//   { name: 'MICROONDAS', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/microondas.png' },
//   { name: 'BATEDEIRA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/batedeira.png' },
//   { name: 'CAFETEIRA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/cafeteira.png' },
//   { name: 'RELOGIO', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/smartwatch.png' },
//   { name: 'VENTILADOR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/ventilador.png' },
//   { name: 'LIQUIDIFICADOR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/liquidifficador.png' },
//   { name: 'PANELA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/panela.png' },
//   { name: 'JOGO DE PANELA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/jogopanela.png' },
//   { name: 'ASPIRADOR', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/aspirador.png' },
//   { name: 'FILTRO DE AGUA', img: 'https://api.drogariapopular24h.com.br/storage/v1/object/public/premios/premios-mock/filtroagua.png' }
// ];

const defaultImage = '/images/default-product.png'; // fallback (you may add this file in public/images)

// --- FUNÇÃO CORAÇÃO DA SINCRONIZAÇÃO ---
// A sua variável defaultImage deve estar definida no escopo (ex: const defaultImage = '/images/default-product.png';)

async function sincronizarEMesclar(listaDaApi) {
  if (!listaDaApi || listaDaApi.length === 0) return [];

  // Cria um array de IDs presentes na API para uso posterior (Passo 3 e 4)
  const idsPresentesNaApi = listaDaApi.map(i => i.CODIGOPREMIO);
  
  // 1. Preparar dados para o Supabase (Mapeando CODIGOPREMIO -> external_id)
  const dadosParaUpsert = listaDaApi.map(item => ({
    external_id: item.CODIGOPREMIO, // Chave de ligação
    nome: item.NOMEPREMIO,
    pontos: item.PONTOS,
    ativo_api: item.ATIVO,
    updated_at: new Date()
  }));

  // 2. UPSERT: Tenta atualizar ou criar no Supabase
  const { error: errUpsert } = await supabase
    .from('produtos_extensao')
    .upsert(dadosParaUpsert, { onConflict: 'external_id', ignoreDuplicates: false });
  
  if (errUpsert) console.warn('Aviso: Falha na inserção/atualização (Upsert):', errUpsert.message);

  // ----------------------------------------------------------------------
  // 3. LIMPEZA/EXCLUSÃO (HARD DELETE)
  // Exclui produtos do Supabase cujo 'external_id' NÃO está na lista atual da API.
  // ----------------------------------------------------------------------
  
  // Verifica se há IDs para evitar um comando DELETE * na tabela vazia.
  // Embora .not() previna isso, é bom verificar.
  if (idsPresentesNaApi.length > 0) {
      const { error: erroDelete } = await supabase
        .from('produtos_extensao')
        .delete() // <--- ALTERADO DE .update() PARA .delete()
        .not('external_id', 'in', `(${idsPresentesNaApi.join(',')})`); 

      if (erroDelete) {
          console.error('Erro na Exclusão física dos itens removidos:', erroDelete);
      } else {
          console.log(`Itens excluídos do Supabase que não estavam mais na API: ${idsPresentesNaApi.length}`);
      }
  }
  
  // ----------------------------------------------------------------------
  
  // 4. SELECT: Busca as imagens cadastradas no Supabase
  const { data: dadosBanco, error: errSelect } = await supabase
    .from('produtos_extensao')
    .select('external_id, imagem_url')
    .in('external_id', idsPresentesNaApi);

  if (errSelect) {
    console.error('Erro ao buscar imagens:', errSelect);
    return listaDaApi; 
  }

  // 5. MERGE: Junta a API (preço fresco) com o Banco (imagem)
  return listaDaApi.map(itemApi => {
    const itemBanco = dadosBanco.find(db => db.external_id === itemApi.CODIGOPREMIO);
    return {
      ...itemApi,
      // Se achou no banco e tem URL, usa. Senão, usa default.
      imagem_final: itemBanco?.imagem_url || defaultImage 
    };
  });
}


function normalizeText(str = '') {
  return String(str)
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^A-Z0-9\s]/g, '')
    .trim();
}

// function getImageForNome(title) {
//   if (!title) return defaultImage;
//   const t = normalizeText(title);
//   // exact / contains match first
//   for (const item of predefinedItems) {
//     const n = normalizeText(item.name);
//     if (t.includes(n) || n.includes(t)) return item.img;
//   }
//   // token overlap scoring
//   const tokens = t.split(/\s+/).filter(Boolean);
//   let best = { score: 0, img: defaultImage };
//   for (const item of predefinedItems) {
//     const n = normalizeText(item.name);
//     const itemTokens = n.split(/\s+/).filter(Boolean);
//     const intersect = tokens.filter(x => itemTokens.includes(x));
//     const score = intersect.length / Math.max(tokens.length, itemTokens.length);
//     if (score > best.score) best = { score, img: item.img };
//   }
//   // threshold to avoid bad matches
//   return best.score >= 0.25 ? best.img : defaultImage;
// }

function formatDateISO(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const currentSlide = ref(0);

// Swiper control: slidesPerView default (breakpoints override)
const slidesPerView = ref(1.35);

function onSlideChange(swiper) {
  // Swiper passes swiper instance when emitting slideChange
  if (swiper && typeof swiper.activeIndex === 'number') {
    currentSlide.value = swiper.activeIndex;
  }
}

// Abre o link do banner: se for externo (http/https) abre em nova aba, senão usa navigateTo
function handleBannerClick(banner) {
  if (!banner || !banner.link) return;
  const link = String(banner.link).trim();
  if (!link) return;

  try {
    if (/^https?:\/\//i.test(link)) {
      // externo: abre em nova aba com noopener
      window.open(link, '_blank', 'noopener');
    } else {
      // interno: usa roteamento do Nuxt
      navigateTo(link);
    }
  } catch (e) {
    // fallback simples
    try { window.open(link, '_blank', 'noopener') } catch (_) { location.href = link }
  }
}


onMounted(async () => {
  produtosListados();
  getUser();
  startWatch();
  fetchCatalogoData();
  fetchParceirosData();
  await fetchProdutosLivresData();
  await consultarPremios();
});

onBeforeUnmount(() => {
  stopWatch();
});

// Send a test email via the server endpoint which uses Resend
async function sendTestEmail() {
  try {
    const res = await $fetch('/api/send-test-email', { method: 'POST' })
    if (res && res.success) {
      alert('E-mail de teste enviado com sucesso.')
      console.log('Resend response:', res.data)
    } else {
      console.error('Resend failed:', res)
      alert('Falha ao enviar e-mail de teste: ' + (res?.error || JSON.stringify(res)))
    }
  } catch (e) {
    console.error('Error calling send-test-email:', e)
    alert('Erro ao contatar o servidor: ' + (e?.message || e))
  }
}

</script>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  /* margin: 25px 0 0 0; */
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-item img {
  width: 100%;
  display: block;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}
.indicator {
  width: 14px;
  height: 14px;
  padding: 4px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
}
.indicator-dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c5c5c5;
}
.indicator.active .indicator-dot {
  background-color: #2935ff;
  transform: scale(1.15);
}
.no-transition {
  transition: none !important;
}


.video-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001 !important;
  background-color: #17171799;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.info-section {
  text-align: center;
  margin: 50px 0 100px 0;
}

.info-section img {
  mask-image: linear-gradient(to top, transparent 1%, black 20%);
}

.info-section p {
  font-size: 24px;
  color: #30369d;
  font-weight: 700;
}


.info-section .buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.info-section .buttons .conferir {
  background: red;
  display: flex;
  align-items: center;
  color: white;
  border: none;
  padding: 10px 20px;
  gap: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.info-section .buttons .description {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #2935ff;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff;
  color: #ff0000;
  border: none;
  padding: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.description-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
  margin: 20px;
}


/* WHATSAPP */

.btn-whatsapp-pulse {
	background: #25d366;
	color: white;
	position: fixed;
	bottom: 120px;
	right: 20px;
	font-size: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 0;
	height: 0;
	padding: 35px;
	text-decoration: none;
	border-radius: 50%;
	animation-name: pulse;
	animation-duration: 1.5s;
	animation-timing-function: ease-out;
	animation-iteration-count: infinite;
  z-index: 9;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
	}
	80% {
		box-shadow: 0 0 0 14px rgba(37, 211, 102, 0);
	}
}

.btn-whatsapp-pulse-border {
	right: 20px;
	animation-play-state: paused;
}

.btn-whatsapp-pulse-border::before {
	content: "";
	position: absolute;
	border-radius: 50%;
	padding: 25px;
	border: 5px solid #25d366;
	opacity: 0.75;
	animation-name: pulse-border;
	animation-duration: 1.5s;
	animation-timing-function: ease-out;
	animation-iteration-count: infinite;
}

@keyframes pulse-border {
	0% {
		padding: 25px;
		opacity: 0.75;
	}
	75% {
		padding: 50px;
		opacity: 0;
	}
	100% {
		opacity: 0;
	}
}
/* Swiper adjustments */
.my-swiper { padding: 12px 8px }
.my-swiper .swiper-slide { width: auto; display: flex; justify-content: center }
.my-swiper img { width: 92%; height: 220px; object-fit: cover; border-radius: 8px; box-shadow: 1px 1px 10px #0000004d; }

@media (max-width: 640px) {
  .my-swiper img { height: 180px }
}


.card-premios-swipe {
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

.card-premios-swipe-parceiros {
  background-color: white;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
  text-align: center;
  /* background-image: url(../../../public/images/backgroundblue.png); */
  background-repeat: no-repeat;
  background-size: cover;
  width: 92%;
  border-radius: 8px;
  color: #ffffff;
  display:flex;
  align-items:center;
  padding:12px;
  height: 130px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>