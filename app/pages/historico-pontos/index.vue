<template>
  <div class="catalog-container">
    <h1>Histórico de pontos</h1>
    <p>Veja aqui o histórico completo dos seus pontos: quanto você acumulou, quando foram usados e quais estão próximos do vencimento. Fique atento às datas de expiração para garantir seus resgates e benefícios.</p>
    <img src="/images/menina.png" alt="menina" width="100" />
    <p>Em breve, com layout exclusivo!</p>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
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