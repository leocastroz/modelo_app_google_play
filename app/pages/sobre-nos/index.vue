<template>
    <div class="catalog-container">
        <h1>Sobre Nós</h1>
        <p>Bem-vindo à nossa página Sobre Nós!</p>
        <p>Aqui você encontrará informações sobre a nossa empresa, missão, visão e valores. Estamos comprometidos em oferecer o melhor serviço aos nossos clientes e construir relacionamentos duradouros baseados na confiança e na excelência.</p>
        <p>Nossa equipe é formada por profissionais dedicados e apaixonados pelo que fazem. Trabalhamos juntos para alcançar nossos objetivos e superar as expectativas dos nossos clientes.</p>
        <p>Um pouco da nossa história</p>
        <p>Fundada em [ano de fundação], nossa empresa tem crescido e evoluído ao longo dos anos, sempre mantendo o foco na qualidade e na satisfação do cliente. Desde o início, temos nos esforçado para inovar e adaptar nossos serviços às necessidades do mercado.</p>
        <p>Nossa missão</p>
        <p>Oferecer produtos e serviços de alta qualidade que atendam às necessidades dos nossos clientes, promovendo um ambiente de trabalho positivo e contribuindo para a comunidade.</p>
        <p>Nossa visão</p>
        <p>Ser reconhecida como uma empresa líder no nosso setor, conhecida pela excelência em atendimento ao cliente e inovação contínua.</p>
        <p>Nossos valores</p>
        <ul>
            <li>Integridade: Agimos com honestidade e transparência em todas as nossas ações.</li>
            <li>Compromisso: Estamos dedicados a cumprir nossas promessas e superar as expectativas.</li>
            <li>Inovação: Buscamos constantemente novas ideias e soluções para melhorar nossos serviços.</li>
            <li>Respeito: Valorizamos a diversidade e tratamos todos com dignidade.</li>
            <li>Excelência: Nos esforçamos para alcançar os mais altos padrões em tudo o que fazemos.</li>
        </ul>
        <p>Agradecemos por visitar nossa página e esperamos poder atendê-lo em breve!</p>
    </div>
</template>



<script setup>
import { ref, onMounted} from 'vue';

definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});

onMounted(() => {
    console.log('Página Sobre Nós montada');
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
