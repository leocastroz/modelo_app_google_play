<template>
  <div>
    <div v-if="title || subtitle" style="padding: 20px 20px 10px 20px; text-align: left;">
      <h1 style="margin: 0px;font-size: 18px;color: var(--title-color, #2935ff);text-transform: uppercase;">{{ title }}</h1>
      <p style="margin: 0;font-size: 14px;font-weight: 100;">{{ subtitle }}</p>
    </div>
    <swiper
      v-if="Array.isArray(items) && items.length"
      class="my-swiper"
      :slides-per-view="slidesPerView"
      :space-between="0"
      :grab-cursor="true"
      :centered-slides="false"
      :breakpoints="breakpoints"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(item, index) in items" :key="index" class="swiper-slide">
        <slot name="item" :item="item"> 
          <!-- default rendering if consumer doesn't provide a slot -->
          <div class="card-premios-swipe" style="display:flex;align-items:center;padding:12px;">
            <img :src="getImage(item)" alt="imagem premio" style="width: auto;height: 100px;" />
            <div style="width:100%; text-align:left;">
              <p style="margin:2px 0;"><strong>{{ item.NOMEPREMIO || item.name }}</strong></p>
              <p style="margin:2px 0; color: #eab308;"><strong>{{ item.PONTOS || item.points }} pts</strong></p>
              <p style="margin:2px 0; font-size:12px; color: #d1d5db;">{{ item.ATIVO === true ? 'Disponivel na loja' : (item.ATIVO === false ? 'Indisponivel na loja' : '') }}</p>
            </div>
          </div>
        </slot>
      </swiper-slide>
    </swiper>

    <div v-else>
      <slot name="empty">
        <div style="display: grid;">
          <img :src="emptyImage" width="100" style="margin: 0 auto;"/>
          <p style="text-align: center; color: #6b7280;font-weight: 100;margin: 0;">{{ emptyText }}</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  slidesPerView: { type: [Number, String], default: 1.35 },
  emptyText: { type: String, default: 'Nenhum item encontrado.' },
  emptyImage: { type: String, default: '/images/menina.png' },
  getImage: { type: Function, default: (it) => (it && (it.img || it.fileName) ? (it.img || it.fileName) : '/images/default-product.png') }
});

const currentSlide = ref(0);

function onSlideChange(swiper) {
  if (swiper && typeof swiper.activeIndex === 'number') currentSlide.value = swiper.activeIndex;
}

const breakpoints = {
  320: { slidesPerView: 1.05 },
  480: { slidesPerView: 1.15 },
  768: { slidesPerView: 1.35 },
  1024: { slidesPerView: 1.6 }
};
</script>

<style scoped>
.my-swiper { padding: 12px 8px }
.my-swiper .swiper-slide { width: auto; display: flex; justify-content: center }
.my-swiper img { width: 92%; height: 220px; object-fit: cover; border-radius: 8px; box-shadow: 1px 1px 10px #0000004d; }

.card-premios-swipe { background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; width: 92%; border-radius: 8px; color: #ffffff; }

@media (max-width: 640px) {
  .my-swiper img { height: 180px }
}
</style>
