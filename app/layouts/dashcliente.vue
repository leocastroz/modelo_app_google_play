<template>
  <div v-if="authLoaded" class="dashboard-layout">
    <aside :class="{ collapsed: isCollapsed }" class="sidebar">
      <div class="side-top">
        ACESSO CLIENTE
        <!-- role {{ role }} -->
        <!-- <button @click="toggleMenu">
          <span v-if="isCollapsed">open</span>
          <span v-else>close</span>
        </button> -->
      </div>
      <NuxtLink to="/cliente" :class="{ active: isActive('/cliente') }">
        <span class="material-icons">home</span>
        <span>Home</span>
      </NuxtLink>

      <NuxtLink to="/premios-retirada" :class="{ active: isActive('/premios-retirada') }">
        <span class="material-icons">card_giftcard</span>
        <span>Meus prêmios</span>
      </NuxtLink>

      <!-- <NuxtLink
        to="/premios-roleta"
        :class="{ active: isActive('/premios-roleta') }"
      >
        <span class="material-icons">casino</span>
        <span>Roleta</span>
      </NuxtLink> -->

      <NuxtLink to="/catalogo-cliente" :class="{ active: isActive('/catalogo-cliente') }">
        <span class="material-icons">shopping_bag</span>
        <span>Catálogo</span>
      </NuxtLink>

      <NuxtLink to="/carteira-cliente" :class="{ active: isActive('/carteira-cliente') }">
        <span class="material-icons">wallet</span>
        <span>Carteira de pontos</span>
      </NuxtLink>

      <NuxtLink to="/meu-card" :class="{ active: isActive('/meu-card') }">
        <span class="material-icons">wallet</span>
        <span>Meu Card</span>
      </NuxtLink>
      <!-- <NuxtLink to="/cliente" :class="{ active: isActive('/cliente') }">
        <img src="../assets/images/dashboard-icon.svg" />
        <span v-if="!isCollapsed">Dashboard cliente</span>
      </NuxtLink>
      <NuxtLink to="/premios" :class="{ active: isActive('/premios') }">
        <img src="../assets/images/dashboard-icon.svg" />
        <span v-if="!isCollapsed">Premios</span>
      </NuxtLink> -->

      <!-- <button @click="testToastify">Click me</button> -->

      <!-- <NuxtLink to="/products" :class="{ active: isActive('/products') }">
        <img src="../assets/images/box-icon.svg" />
        <span v-if="!isCollapsed">Produto</span>
      </NuxtLink>
      <NuxtLink to="/clients" :class="{ active: isActive('/clients') }">
        <img src="../assets/images/peoples-icon.svg" />
        <span v-if="!isCollapsed">Clientes</span>
      </NuxtLink>
      <NuxtLink to="/brands" :class="{ active: isActive('/brands') }">
        <img src="../assets/images/brand-icon.svg" />
        <span v-if="!isCollapsed">Marcas</span>
      </NuxtLink>
      <NuxtLink to="/banners" :class="{ active: isActive('/banners') }">
        <img src="../assets/images/banner-icon.svg" />
        <span v-if="!isCollapsed">Banners</span>
      </NuxtLink>
      <NuxtLink to="/sales" :class="{ active: isActive('/sales') }">
        <img src="../assets/images/sales-icon.svg" />
        <span v-if="!isCollapsed">Vendas</span>
      </NuxtLink>
      <NuxtLink to="/newaccess" :class="{ active: isActive('/newaccess') }">
        <img src="../assets/images/newaccess-icon.svg" />
        <span v-if="!isCollapsed">Novo acesso</span>
      </NuxtLink>
      <NuxtLink to="/settings" :class="{ active: isActive('/settings') }">
        <span v-if="!isCollapsed">Configurações</span>
      </NuxtLink>
      <NuxtLink to="/migrate" :class="{ active: isActive('/migrate') }">
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Migrate</span>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/config"
        :class="{ active: isActive('/dashboard/config') }"
      >
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Configurações</span>
      </NuxtLink>
      <NuxtLink to="/payments" :class="{ active: isActive('/payments') }">
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Pagamentos</span>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/options"
        :class="{ active: isActive('/dashboard/options') }"
      >
        <span>&#9729;</span>
        <span v-if="!isCollapsed">Opções</span>
      </NuxtLink> -->
      <button @click="handleLogout" :disabled="isLoading">
        <span v-if="!isLoading">Sair</span>
        <span v-else>Saindo...</span>
      </button>
    </aside>

    <aside :class="[{ collapsed: isCollapsed }, 'sidebottom', { alt: showAltBottom }]">
      <template v-if="!showAltBottom">
        <NuxtLink to="/premios-retirada" :class="{ active: isActive('/premios-retirada') }">
          <span class="material-icons">card_giftcard</span>
          <span>Prêmios</span>
        </NuxtLink>
        <NuxtLink to="/catalogo-cliente" :class="{ active: isActive('/catalogo-cliente') }">
          <span class="material-icons">shopping_bag</span>
          <span>Catálogo</span>
        </NuxtLink>

        <NuxtLink to="/cliente" :class="{ active: isActive('/cliente') }">
          <span class="material-icons">home</span>
          <span>Home</span>
        </NuxtLink>

        <NuxtLink to="/carteira-cliente" :class="{ active: isActive('/carteira-cliente') }">
          <span class="material-icons">wallet</span>
          <span>Carteira</span>
        </NuxtLink>
        <NuxtLink to="/meu-card" :class="{ active: isActive('/meu-card') }">
          <span class="material-icons">contactless</span>
          <span>Meu Card</span>
        </NuxtLink>
      </template>
      <template v-else>
        <div class="sidebottom-alt">

          <div style="display: flex;align-items: center;gap: 10px;">
            <span class="material-icons">{{ altIcon }}</span>
            <span>{{ altLabel }}</span>
          </div>

          <NuxtLink to="/cliente" class="alt-link">
            <span class="material-icons">arrow_back</span>
            <!-- <span>Voltar</span> -->
          </NuxtLink>
        </div>
      </template>
    </aside>

    <main ref="mainEl" :class="{ forceWidth: isCollapsed }">
      <div class="nav-sec" :class="{ 'nav-collapsed': navCollapsed, 'nav-expanded': !navCollapsed }"
        :style="{ height: navHeight + 'px', backgroundImage: !navCollapsed ? `url('/images/captura.png')` : 'none' }">
        <div v-if="false" class="btn-menu">
          <div @click="toggleMenu">
            <img v-if="isCollapsed" src="../assets/images/set-icon.svg" />
            <img v-else src="../assets/images/set1-icon.svg" />
          </div>
        </div>
        <!-- <img src="../assets/images/drogariapopular.png" /> -->
        <div class="nickname-menu">

          <!-- <button ref="hamburgerBtn" class="hamburger-btn" @click="toggleHamburger" :aria-expanded="String(showMenu)" aria-label="Abrir menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          <img src="/images/drogariapopular.png" width="100" /> -->


          <div class="perfil">
            <div
              style="color: white;display: flex;align-items: center;padding: 5px;border-radius: 5px;text-align: center;gap: 5px;">
              <div @click="toggleHamburger"
                style="display: flex;align-items: center;justify-content: space-between;gap: 5px;background: #001b64f0;padding: 5px;border-radius: 5px;cursor: pointer;">
                <span class="material-icons">menu</span>
              </div>
            </div>
          </div>

          <div v-if="showMenu" ref="menuEl" class="hamburger-dropdown">
            <div class="menu-header">
              <strong style="text-transform: uppercase;">{{ cliente.user_metadata.nome }}</strong>
              <div class="menu-points">Pontos: <span>{{ cliente.user_metadata.pontos }}</span></div>
            </div>
            <ul class="menu-list">
              <li @click="goTo('/perfilusuario')">Perfil</li>
              <li @click="goTo('/premios-retirada')">Meus prêmios</li>
              <li @click="goTo('/catalogo-cliente')">Catálogo</li>
              <li @click="goTo('/sobre-nos')">Sobre Nós</li>
              <li @click="handleLogout">Sair</li>
            </ul>
            <div class="socials">
              <a class="social-btn" href="https://www.instagram.com/drogariapopulardopara24h" target="_blank"
                rel="noopener" title="Instagram">
                <img src="/images/instagram.svg" alt="instagram" width="20" />
              </a>
              <a class="social-btn" href="https://facebook.com" target="_blank" rel="noopener" title="Facebook">
                <img src="/images/facebook.svg" alt="facebook" width="20" />
              </a>
              <a class="social-btn" href="https://tiktok.com" target="_blank" rel="noopener" title="TikTok">
                <img src="/images/tiktok.svg" alt="facebook" width="20" />
              </a>
              <a class="social-btn" href="https://youtube.com" target="_blank" rel="noopener" title="YouTube">
                <img src="/images/youtube.svg" alt="facebook" width="20" />
              </a>
              <a class="social-btn"
                href="https://api.whatsapp.com/send?phone=+5594992124615&text=Olá, estou precisando de ajuda!"
                target="_blank" rel="noopener" title="WhatsApp">
                <img src="/images/whatsapp.svg" alt="facebook" width="20" />
              </a>
            </div>
          </div>
        </div>
        <!-- Drogaria Popular Do Para -->

        <div class="perfil">
          <NuxtLink to="/historico-pontos">
            <div
              style="color: white;display: flex;align-items: center;background: #001b64f0;border: 1px solid #ffffff57;padding: 0px 15px;border-radius: 10px;text-align: center;gap: 5px;cursor: pointer;">
              <div style="display: flex;align-items: center;justify-content: space-between;gap: 5px;">
                <!-- <span class="material-icons">wallet</span> -->
                <img src="/images/google-wallet.png" width="20" alt="google-wallet" />
                <p style="margin: 0;">{{ cliente.user_metadata.pontos }}</p>
              </div>
              <p style="font-size: 10px;margin: 0;">pontos</p>
            </div>


          </NuxtLink>

          <div class="header-notification">
            <span class="material-icons">notifications</span>
            <p>0</p>
          </div>

          <NuxtLink to="/perfilusuario">
            <img
              :src="'https://www.if.ufrgs.br/if/wp-content/uploads/2018/04/default-profile.png'"
              alt="Drogaria Popular do Pará" class="logo" width="40" />
            <!-- <img
              :src="profileImage ? `https://api.drogariapopular24h.com.br/storage/v1/object/public/profiles/${profileImage}` : 'https://www.if.ufrgs.br/if/wp-content/uploads/2018/04/default-profile.png'"
              alt="Drogaria Popular do Pará" class="logo" width="40" /> -->
          </NuxtLink>
        </div>
      </div>
      <div :style="{ marginTop: (navHeight === 200 ? '140px' : '30px'), transition: 'margin-top 0.25s ease' }">
        <slot />
      </div>
    </main>
  </div>
  <div v-else class="loading-auth">
    <div class="spinner"></div>
    <p>Verificando autenticação...</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount, onUnmounted, computed } from "vue";
import { createClient } from "@supabase/supabase-js";
import useBus from '~/composables/useBus'
const bus = useBus()


const onProfileUpdated = (payload) => {
  const fileName = payload?.fileName
  if (fileName) {
    profileImage.value = fileName
  } else {
    // if no filename provided, refresh auth/user data
    checkAuth()
  }
  console.log('Profile updated event received in layout:', payload)
}


const onPontosUpdated = (payload) => {
  const pontos = payload?.pontos
  if (pontos !== undefined && cliente.value && cliente.value.user_metadata) {
    cliente.value.user_metadata.pontos = pontos
  } else {
    // if no pontos provided, refresh auth/user data
    checkAuth()
  }
  console.log('Pontos updated event received in layout:', payload)
}


// onMounted(() => bus.on('user-profile-updated', onProfileUpdated))
onUnmounted(() => {
  bus.off('user-profile-updated', onProfileUpdated);
  bus.off('pontos-updated', onPontosUpdated);
})


const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const isCollapsed = ref(false);
const route = useRoute();
const router = useRouter();
const authLoaded = ref(false);

// hamburger menu state
const showMenu = ref(false);
const menuEl = ref(null);
const hamburgerBtn = ref(null);

const cliente = ref(null);
const profileImage = ref(null);
const mainEl = ref(null);
const navHeight = ref(200);
const navCollapsed = computed(() => navHeight.value <= 60);

const role = ref("cliente"); // Defina o papel padrão como 'admin'

// Verificação de autenticação
const checkAuth = async () => {
  try {
    // 1. Verifica no localStorage (client-side)
    const authData = localStorage.getItem("sb-api-auth-token");
    const parsedData = JSON.parse(authData);

    // console.log("parsedData CLIENTE!", parsedData);
    cliente.value = parsedData?.user || cliente.value;
    // role.value = user.user_metadata.role;
    if (parsedData.user.user_metadata.role) {
      navigateTo("/cliente");
      // navigateTo('/dashboard');
    } else {
      navigateTo("/dashboard");
    }

    if (process.client) {
      ("sb-api-auth-token");
      if (!authData) throw new Error("Nenhum dado de autenticação encontrado");
      if (!parsedData?.user) throw new Error("Usuário não autenticado");
    }

    // 2. Verifica com o Supabase (opcional, mas recomendado)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw error || new Error("Usuário não autenticado");
    }

    role.value = user.user_metadata.role;
    if (user.user_metadata.role !== 'admin') {
      navigateTo('/cliente');
      // navigateTo('/dashboard');
    }

    // ensure cliente has the freshest user from Supabase
    cliente.value = user || cliente.value;

    // set profileImage from available sources if not already set by an event
    if (!profileImage.value) {
      profileImage.value = user?.user_metadata?.fileName || cliente.value?.user_metadata?.fileName || null
    }
    // Se chegou aqui, está autenticado
    authLoaded.value = true;
  } catch (error) {
    console.error("Erro de autenticação:", error);

    // Limpa os dados inválidos
    if (process.client) {
      localStorage.removeItem("sb-api-auth-token");
    }
  }
};

async function produtosListados() {
  console.log('Fetching produtos_sorteio...');
  const { data, error } = await supabase.from('produtos_extensao').select('*');
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('Sorteio data:', data);
    produtosSorteio.value = data;
  }
}


function testToastify() {
  useToastify("Wow so easy !", {
    autoClose: 2000,
    theme: "light",
    type: "success",
    position: ToastifyOption.POSITION.TOP_RIGHT,
  });
}

// Verifica a autenticação quando o componente é montado
onMounted(() => {
  bus.on('user-profile-updated', onProfileUpdated);
  bus.on('pontos-updated', onPontosUpdated);
  checkAuth();
  produtosListados();
  // scroll handler: prefer scrolling inside main, fallback to window
  const handleScrollWrapper = (e) => {
    let scrollTop = 0
    if (e && e.target && typeof e.target.scrollTop === 'number') scrollTop = e.target.scrollTop
    else if (typeof window !== 'undefined') scrollTop = window.scrollY || window.pageYOffset || 0
    navHeight.value = scrollTop > 20 ? 60 : 200
  }
  // attach to main if available
  try {
    if (mainEl && mainEl.value && typeof mainEl.value.addEventListener === 'function') {
      mainEl.value.addEventListener('scroll', handleScrollWrapper)
      // store handler for cleanup
      mainEl._handleScroll = handleScrollWrapper
    }
  } catch (e) {
    // ignore
  }
  // also add window listener as fallback
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScrollWrapper)
    // store on window for cleanup
    window.__dashClientHandleScroll = handleScrollWrapper
  }
});

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleHamburger() {
  showMenu.value = !showMenu.value;
}

function goTo(path) {
  showMenu.value = false;
  if (router && typeof router.push === 'function') router.push(path);
}

function onDocumentClick(e) {
  const menu = menuEl.value;
  const btn = hamburgerBtn.value;
  if (!menu || !btn) return;
  const target = e.target;
  if (menu.contains(target) || btn.contains(target)) return;
  showMenu.value = false;
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  // cleanup scroll listeners
  try {
    if (mainEl && mainEl.value && mainEl._handleScroll) mainEl.value.removeEventListener('scroll', mainEl._handleScroll)
  } catch (e) {
    // ignore
  }
  try {
    if (typeof window !== 'undefined' && window.__dashClientHandleScroll) window.removeEventListener('scroll', window.__dashClientHandleScroll)
  } catch (e) {
    // ignore
  }
});

const isActive = (path) => {
  return route.path.startsWith(path);
};

// Routes shown in the bottom navigation (mobile)
const bottomRoutes = ['/premios-retirada', '/catalogo-cliente', '/cliente', '/carteira-cliente', '/meu-card'];

// When true, show an alternate compact bottom layout (for routes that are NOT in bottomRoutes)
const showAltBottom = computed(() => {
  try {
    return !bottomRoutes.some(p => route.path.startsWith(p));
  } catch (e) {
    return false;
  }
});

// Computed values for the alternate bottom bar: icon and label
const altIcon = computed(() => {
  const name = (route && route.name) || (router && router.currentRoute && router.currentRoute.value && router.currentRoute.value.name) || '';
  const n = typeof name === 'string' ? name : '';
  if (n === 'perfilusuario' || n === 'sobre-nos') return 'person';
  if (n === 'historico-pontos') return 'wallet';
  return 'home';
});

const altLabel = computed(() => {
  const name = (route && route.name) || (router && router.currentRoute && router.currentRoute.value && router.currentRoute.value.name) || '';
  const n = typeof name === 'string' ? name : '';
  if (n === 'perfilusuario') return 'Informações Pessoais';
  if (n === 'historico-pontos') return 'Histórico de pontos';
  if (n === 'sobre-nos') return 'Sobre Nós';
  return 'Home';
});

const isLoading = ref(false);

const handleLogout = async () => {
  // console.log("Logout clicked");
  isLoading.value = true;
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("sb-api-auth-token");
    localStorage.removeItem("inovaAccessToken");
    useToastify("Logout realizado com sucesso!", {
      autoClose: 2000,
      theme: "light",
      type: "success",
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    // Aguarda um pouco para mostrar a toast, depois força reload completo
    setTimeout(() => {
      window.location.href = '/';
    }, 1200);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>

.header-notification {
  display: flex;
  background: rgba(0, 27, 100, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.34);
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 30px;
}

.header-notification:hover {
  cursor: pointer;
  background: #001b64;
}

.header-notification:hover span {
  color: #ffffff;
}

.header-notification p {
  position: absolute;
  margin-left: 30px;
  margin-top: -25px;
  color: #ffffff;
  background: rgba(0, 27, 100, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.34);
  font-size: 10px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1.5rem;
  font-size: 1.1rem;
  color: #a1a1a1;
}

.loading-auth p {
  color: #fff;
}

.nickname {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 200px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #e0e0e0;
  border-top: 6px solid #e30614;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.side-top {
  padding: 20px 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e30614;
  color: #f0f0f0;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.btn-menu {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  background-color: #f0f0f0;
  transition: background-color 0.2s;
}

/* .btn-menu:hover {
  background-color: #e0e0e0;
} */

.sidebottom {
  display: none;
}

.sidebottom.alt {
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
  height: 60px;
  background-color: var(--ui-color-error-500);
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 20px 20px 0px 0px;
}

.sidebottom-alt {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 8px;
}

.sidebottom-alt .alt-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #001b64;
  margin: 0;
  color: #ffffff;
}

.sidebottom-alt .alt-link .material-icons {
  font-size: 22px;
  color: #ffffff;
  margin: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 280px;
  min-width: 280px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
  transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out;
  border-right: 1px solid #e0e0e0;
}

.sidebar a {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-radius: 8px;
  font-weight: 500;
  color: #a1a1a1;
  transition: all 0.2s ease-in-out;
}

.sidebar a:hover {
  /* background-color: #f0f0f0; */
  color: #e30614;
  transform: translateX(5px);
}

.sidebar a .material-icons {
  font-size: 24px;
  color: #a1a1a1;
  transition: color 0.2s ease-in-out;
}

.sidebar a:hover .material-icons {
  color: #e30614;
}

.sidebar a span:last-child {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.2s ease-in-out;
}

.sidebar.collapsed {
  width: 80px;
  min-width: 80px;
  align-items: center;
}

.sidebar.collapsed a span:last-child {
  opacity: 0;
  visibility: hidden;
  width: 0;
  overflow: hidden;
}

.sidebar a.active {
  background-color: #f0f0f0;
  color: #e30614 !important;
}

.sidebar a.active .material-icons {
  color: #e30614;
}

.sidebar button {
  margin-top: auto;
  padding: 12px 20px;
  background-color: #e30614;
  color: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.sidebar button:hover:not(:disabled) {
  background-color: #24298a;
  transform: translateY(-2px);
}

.sidebar button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

main {
  flex-grow: 1;
  padding: 0;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  height: 100vh;
  background-color: #f8f9fa;
}

/* main.forceWidth {
  
} */

main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: #f8f9fa;
}

main::-webkit-scrollbar-thumb {
  background-color: #001b64f0;
  border-radius: 4px;
  border: 2px solid #f8f9fa;
}

.nav-sec {
  background-color: #001b64f0;
  padding: 15px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #e0e0e0;
  transition: height 0.25s ease, padding 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
}

/* Expanded state: show background image and larger padding */
.nav-sec.nav-expanded {
  background-size: cover;
  background-position: center;
  /* padding: 25px 30px; */
}

/* Collapsed state: focus background (solid/overlay) */
.nav-sec.nav-collapsed {
  background-image: none !important;
  background-color: rgba(0, 27, 100, 0.95);
  /* padding: 8px 16px; */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  align-items: center;
}

.nav-sec img {
  height: 35px;
  object-fit: contain;
}

.nav-sec .perfil {
  display: flex;
  align-items: center;
  /* padding: 5px 10px; */
  gap: 10px;
}

.nav-sec .perfil a {
  text-decoration: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: color 0.2s ease-in-out;
}

.nav-sec .perfil a:hover {
  color: #e30614;
}

.nav-sec .perfil .logo {
  border-radius: 50%;
  border: 2px solid #001b64f0;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
  width: 40px;
  height: 40px;
}

.nav-sec .perfil .logo:hover {
  transform: scale(1.05);
}

.nav-sec .logo:hover {
  transform: scale(1.05);
}

.nickname-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.hamburger-btn {
  width: 36px;
  height: 36px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  padding: 6px;
  cursor: pointer;
}

.hamburger-line {
  display: block;
  width: 16px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
}

.hamburger-dropdown {
  position: fixed;
  top: 80px;
  height: -webkit-fill-available;
  left: 0;
  width: -webkit-fill-available;
  background: white;
  color: #111;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 9999 !important;
  padding: 8px;
}

.hamburger-dropdown .menu-header {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
}

.hamburger-dropdown .menu-points {
  font-size: 12px;
  color: #666;
  margin-top: 4px
}

.hamburger-dropdown .menu-list {
  list-style: none;
  margin: 0;
  padding: 6px 0
}

.hamburger-dropdown .menu-list li {
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px
}

.hamburger-dropdown .menu-list li:hover {
  background: #f5f5f5
}

.socials {
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  align-items: center
}

.social-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f5f5f5;
  border: 1px solid #eee;
  text-decoration: none
}

.social-btn svg {
  width: 18px;
  height: 18px
}

.social-btn:hover {
  background: #e9e9e9;
  transform: translateY(-2px)
}

.active {
  background-color: #f0f0f0;
  color: #e30614 !important;
}

@media (max-width: 900px) {
  .sidebar {
    display: none;
  }

  .sidebottom {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: #f0f0f0;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
    z-index: 99;
    border-radius: 20px 20px 0px 0px;
  }

  .sidebottom a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    gap: 5px;
    padding: 8px 10px;
    border-radius: 8px;
    color: #a1a1a1;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
  }

  .sidebottom a .material-icons {
    font-size: 26px;
    width: 26px;
    height: 26px;
    margin-bottom: 3px;
    color: #a1a1a1;
  }

  .sidebottom a:hover {
    /* background-color: rgba(255, 255, 255, 0.15); */
    transform: translateY(-3px);
  }

  .sidebottom .active,
  .sidebottom .active .material-icons {
    color: #001b64f0 !important;
  }


  .sidebottom button {
    padding: 8px 15px;
    background-color: #e30614;
    color: #f0f0f0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background-color 0.2s ease-in-out;
  }

  .sidebottom button:hover:not(:disabled) {
    background-color: #c70410;
  }

  main {
    padding-top: 80px;
    /* Altura do .nav-sec */
    padding-bottom: 80px;
    /* Altura do .sidebottom */
    margin-bottom: 0;
    height: auto;
  }

  .nav-sec {
    position: fixed;
    /* top: -2px; */
    bottom: 0;
    left: 0;
    color: #fff;
    width: -webkit-fill-available;
    height: 60px;
    padding: 12px 20px;
    /* background-color: #2935ff; */
    background-image: url(../../public/images/captura.png);
    border-radius: 0 0px 20px 20px;
    background-size: cover;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
  }
}
</style>
