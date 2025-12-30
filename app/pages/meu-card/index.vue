<template>


  <div class="catalog-container">
    <h1>Meu Popular Card</h1>
    <p>Olá! Boas-vindas ao seu <strong>Popular Card.</strong></p>

    <p>Chegou a hora de liberar todo o poder e a conveniência do seu cartão digital. Adicioná-lo à sua carteira digital é rápido e simplifica seu uso.</p>

    <p><strong>Atenção:</strong>Seu Popular Card é pessoal, único e intransferível. Ele está vinculado exclusivamente ao seu usuário.</p>
    <!-- <p><strong>Ação:</strong>Encontre seu cartão digital abaixo e clique em "Add to wallet" para começar a usá-lo imediatamente!</p> -->

    <!-- <div class="points-info">
      <p class="points-note"><strong>Atenção:</strong> seu cartao digital e unico e intransferivel. Ele e vinculado ao seu usuario e so pode ser utilizado por voce.</p>
   
    </div> -->
     <p><strong>Confira abaixo o seu cartão digital.</strong></p>
    <!-- <p>Confira abaixo o seu cartão digital e clique em <strong>"Add to wallet"</strong> para adicioná-lo à sua carteira digital.</p> -->

    <img src="/images/menina.png" alt="menina" width="150" style="margin: 0 auto;display: flex;" />

    <div class="container-card">
      <div class="header-card">
        <img src="/images/drogariapopular.png" alt="logotipo" style="width: 120px; height: auto;" />
        <div class="points-display">
          <p style="font-size: 12px;font-family: -apple-system, BlinkMacSystemFont, sans-serif;margin: -20px 0;">POPULAR CARD</p>
          <!-- <strong>{{ sub?.pontos }}</strong> -->
        </div>
      </div>

      <div class="card-image">
        <!-- <img src="https://res.pass2u.net/pass2u/images/1d5/1d52f2372541ce086ef1afa402646f29c0316a69.png" alt="logotipo" /> -->
      </div>

      <div class="footer-card">
        <div>
          <p>Nome</p>
          <p style="width: 140px;overflow: hidden;position: relative;text-overflow: ellipsis;white-space: nowrap;">{{ sub?.nome }}</p>
        </div>
        <div>
          <p>CVV</p>
          <p>{{ sub?.codigoCliente ? sub?.codigoCliente : 'N/A' }}</p>
        </div>
        <div>
          <p>Empresa</p>
          <p style="text-align: end;">{{ sub?.empresa ? sub?.empresa : 'N/A' }}</p>
        </div>
      </div>
      <div class="barcode-card">
        <!-- SVG where JsBarcode will render -->
        <svg ref="barcodeEl" aria-hidden="true"></svg>
      </div>
    </div>


    <!-- <a class="download-card" :href="`https://www.pass2u.net/d/${sub?.PassId}?t=qr_code&openExternalBrowser=1`" target="_blank">
      <img src="/images/google-wallet.png" width="30" alt="google-wallet" />
      <button>Add to wallet</button>
    </a> -->



  </div>





  <div v-if="false" style="display: grid;">
    <div class="container" @click="toggleFlip">
      <div class="card" :class="{ flipped: isFlipped }">
        
        <div class="front">

          <div class="top">
            <img src="/images/drogariapopular.png" alt="logotipo" style="width: 100px; height: auto;" />
            <!-- <h3>Pontos {{ sub?.pontos }}</h3> -->
            <div style="text-align: end;">
              <p style="font-size: 14px;color: #ffffff96;">PONTOS</p>
              <strong>{{ sub?.pontos }}</strong>
            </div>
          </div>

          <div class="center">
            <img src="/images/popularcard.png" alt="logotipo" />
          </div>

          <div style="display: grid;height: 270px;border-radius: 0 0 10px 10px;">
            <div class="infos">
              <div>
                <strong>Nome</strong>
                <p style="width: 140px;overflow: hidden;position: relative;text-overflow: ellipsis;white-space: nowrap;">{{ sub?.nome }}</p>
              </div>
              <div>
                <strong>CVV</strong>
                <p>{{ sub?.codigoCliente }}</p>
              </div>
              <div>
                <strong>Empresa</strong>
                <p style="text-align: end;">{{ sub?.empresa ? sub?.empresa : 'N/A' }}</p>
              </div>
            </div>

            <div class="barcode">
              <!-- SVG where JsBarcode will render -->
              <svg ref="barcodeEl" aria-hidden="true"></svg>
            </div>
          </div>

          <!-- Click to flip -->
        </div>


        <div class="back">Yo, what up?</div>
      </div>
    </div>
     <!-- <pre>{{ sub }}</pre> -->
    <a :href="`https://www.pass2u.net/d/${sub?.PassId}?t=qr_code&openExternalBrowser=1`" target="_blank">
      <button>Baixar meu cartão digital</button>
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import JsBarcode from 'jsbarcode'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});

const isFlipped = ref(false);
const sub = ref(null);
const barcodeEl = ref(null);

function toggleFlip() {
  isFlipped.value = !isFlipped.value
}

function renderBarcode(value) {
  const v = String(value ?? '')
  if (!barcodeEl.value) return
  try {
    // CODE128 works well for numeric/text codes; adjust options as needed
    JsBarcode(barcodeEl.value, v, {
      format: 'CODE128',
      lineColor: '#000',
      width: 3,
      height: 60,
      displayValue: true,
      fontSize: 14,
      margin: 10
    })
  } catch (e) {
    console.error('Erro ao gerar barcode:', e)
  }
}


watch(() => sub.value?.codigoCliente, (newVal) => {
  renderBarcode(newVal)
})

function getUser() {
  const user = useSupabaseUser();
  sub.value = user.value.user_metadata;
  console.log("User data:", user.value.user_metadata);
  return user.value;
}


onMounted(() => {
  getUser();
});
</script>

<style scoped>


.container-card {
  background-color: #050505;
  border-radius: 11px;
  max-width: 320px;
  color: #ffffff;
  margin: 0 auto;
}


.catalog-container strong {
  color: #fb616b;
}

.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0 10px;
  height: 55px;
}

.card-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 122px;
  width: 100%;
  /* background-image: url('https://res.pass2u.net/pass2u/images/1d5/1d52f2372541ce086ef1afa402646f29c0316a69.png'); */
  background-image: url('../../../public/images/bg-card.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}


.footer-card {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 60px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 400;
  font-size: 12px;
  text-transform: uppercase;
}

.barcode-card {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 30px;
}

.barcode-card svg {
  border-radius: 4px;
}

.download-card {
  display: flex;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  background-color: #000000;
  /* width: max-content; */
  max-width: 300px;
  border-radius: 30px;
  color: #ffffff;
  align-items: center;
  padding: 8px 15px;
  margin: 20px auto 40px auto;
  cursor: pointer;
}


.download-card button {
  display: flex;
  justify-content: center;
  border: none;
  color: #ffffff;
  background-color: #000000;
  width: max-content;
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
  font-weight: 300;
}

.container {
  width: 300px;
  height: 200px;
  position: relative;
  perspective: 800px;
  border-radius: 4px;
}

.card {
  width: 320px;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.card > div {
  position: absolute;
  width: 320px;
  height: 465px;
  backface-visibility: hidden;
  border-radius: 6px;
  background: #fff;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  font: 16px/1.5 "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #47525D;
}

.card .front {
  background: linear-gradient(-45deg, #ffb7bb, #e73c50, #fb616b);
	background-size: 400% 400%;
	animation: gradient 5s ease infinite;
  border-radius: 10px;
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

.card .front .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.card .front .top {
  color: #fff;
}

.card .front .center {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  height: 125px;
}

.card .front .center img {
  max-width: 200px;
}

.card .front .infos {
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  color: white;
  font-size: 13px;
}

.card .front .barcode {
  display: flex;
  justify-content: center;
}

.card .front .barcode svg {
  display: block;
  max-width: 90%;
  border-radius: 6px;
  background: #fff;
  padding: 4px;
  height: 80px;
}

.card .back {
  transform: rotateY(180deg);
  background-color: red;
}

.card.flipped {
  transform: rotateY(180deg);
}
</style>
