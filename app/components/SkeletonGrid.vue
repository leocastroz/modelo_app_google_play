<template>
  <div class="catalog-grid">
    <div class="premio-card skeleton" v-for="n in count" :key="n">
      <div class="skeleton-img" />
      <div style="flex:1; min-width: 120px;">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 4 }
});
</script>

<style scoped>
.catalog-grid { display: flex; flex-direction: column; gap: 20px }
@media (min-width: 768px) {
  .catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px }
}
.premio-card.skeleton { display:flex; gap: 20px; align-items: center; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06) }
.skeleton-img { width: 100px; height: 100px; border-radius: 8px; background: linear-gradient(90deg,#eee,#f5f5f5,#eee); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; margin-right: 16px }
.skeleton-line { height: 12px; background: linear-gradient(90deg,#eee,#f5f5f5,#eee); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; border-radius: 6px; margin-bottom: 8px }
.skeleton-line.short { width: 40%; height: 16px; margin-bottom: 10px }
@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
</style>
