<template>
  <div class="catalog-container">
    <h1>Delete sua conta</h1>
    <p>Tem certeza que deseja deletar sua conta?</p>
    <button>Deletar conta</button>
  </div>
</template>

<script setup>
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
  background: linear-gradient(90deg,#eee,#f5f5f5,#eee);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
  margin-right: 16px;
}
.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg,#eee,#f5f5f5,#eee);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
  border-radius: 6px;
  margin-bottom: 8px;
}
.skeleton-line.short { width: 40%; height: 16px; margin-bottom: 10px }

@keyframes shimmer {
  0% { background-position: 200% 0 }
  100% { background-position: -200% 0 }
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