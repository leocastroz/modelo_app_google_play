<template>
  <div class="catalog-container">
    <h1>Carteira de pontos</h1>
    <p>Bem-vindo à sua carteira de pontos — aqui você acompanha o saldo acumulado para resgates.</p>

    <div class="points-info">
      <p class="points-note"><strong>Atenção:</strong> os pontos não têm valor monetário e não equivalem a dinheiro. Eles são créditos de fidelidade acumulados ao comprar na farmácia e podem ser trocados por prêmios ou benefícios.</p>
      <p class="points-how">Como acumular: para cada R$ 1,00 gasto em compras você recebe 1 ponto (padrão do programa). Use seus pontos para resgatar prêmios disponíveis na seção de catálogo.</p>
      <div class="points-value">Total de pontos: <strong>{{ pontos }}</strong></div>
    </div>
    <!-- <img src="/images/menina.png" alt="menina" width="100" />
    <p>Em breve, com layout exclusivo!</p> -->

    <div class="catalog-grid" v-if="produtosCatalogo.length && false">
      <div class="premio-card" v-for="(catalogo, index) in produtosCatalogo" :key="index">
        <img
          :src="catalogo.fileName ? `https://api.visaonews.org/storage/v1/object/public/catalogo/667d38d3-b1a8-44b2-b959-6ce45a580173/${catalogo.fileName}` : ''"
          alt="Imagem do Produto" />
        <div>
          <!-- <p><strong>ID:</strong> {{ index + 1 }}</p> -->
          <p><strong>Produto:</strong> {{ catalogo.nome }}</p>
          <p><strong>Descrição:</strong> {{ catalogo.descricao }}</p>
          <p><strong>Pontos:</strong> {{ catalogo.pontos }}</p>
          <!-- <p><strong>Retirada:</strong> {{ catalogo.retirada_at || 'Indefinido' }}</p>
          <p><strong>Entregue por:</strong> {{ catalogo.data_resgate || 'Indefinido' }}</p> -->
          <!-- <pre>{{ catalogo }}</pre> -->
        </div>
        <!-- <button @click="deleteItem(catalogo)">Deletar</button> -->
        <button @click="abrirModalDesenvolvimento()">Solicitar resgate</button>
      </div>
    </div>

    <!-- Modal de desenvolvimento -->
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
  </div>
</template>
<script setup>
const showModalDesenvolvimento = ref(false);

function abrirModalDesenvolvimento() {
  showModalDesenvolvimento.value = true;
  // Notificação simples
  if (typeof window !== 'undefined' && window.$nuxt) {
    window.$nuxt.$notify({
      type: 'info',
      title: 'Em desenvolvimento',
      text: 'O módulo de resgate está em desenvolvimento.'
    });
  } else if (typeof useNuxtApp === 'function') {
    // Para Nuxt 3
    const nuxtApp = useNuxtApp();
    if (nuxtApp?.$notify) {
      nuxtApp.$notify({
        type: 'info',
        title: 'Em desenvolvimento',
        text: 'O módulo de resgate está em desenvolvimento.'
      });
    }
  }
}
import { ref, onMounted } from "vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});


const produtosCatalogo = ref([]);
const sub = ref(null);

const pontos = ref(0);

function getUser() {
  const user = useSupabaseUser();
  sub.value = user.value.user_metadata;
  console.log("User data:", user.value.user_metadata);
  return user.value;
}


async function consultarPontos() {
  console.log("consultarPontos called with cpf:", sub.value.cpf);
  try {
    const res = await $fetch('/api/inova/consultar_pontos', {
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
    pontos.value = res.data[0].SALDOPONTOS || 0
  } catch (e) {
    console.warn('Falha ao consultar usuários INOVA:', e)
  }
}


onMounted(() => {
  getUser();
  consultarPontos();
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
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.premio-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.premio-card p {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
  font-weight: 100;
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

.points-info {
  background: #f8fafc;
  border: 1px solid #e6eefc;
  padding: 12px 14px;
  border-radius: 10px;
  margin: 14px 0 18px 0;
  color: #213547;
}
.points-note { margin: 0 0 6px 0; font-size: 0.95rem }
.points-how { margin: 0 0 8px 0; font-size: 0.9rem; color: #475569 }
.points-value { font-size: 1.15rem; color: #0b3a8a; margin-top: 6px }
</style>