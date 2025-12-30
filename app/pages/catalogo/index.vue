<template>
  <div class="catalog-container">
    <!-- Título e botão alinhados -->
    <div
      style="display: flex; align-items: baseline; width: 100%; justify-content: space-between; margin-bottom: 30px;">
      <div>
        <h1 class="titulo">Catálogo</h1>
        <p class="subtitulo">Bem-vindo à sua lista de prêmios!</p>
      </div>
      <button @click="openModal">Cadastrar Produto</button>
    </div>

    <!-- Grid de produtos -->
    <div class="catalog-grid">
      <div class="catalog-card" v-for="(catalogo, index) in produtosCatalogo" :key="index">
        <img
          :src="catalogo.fileName ? `https://api.visaonews.org/storage/v1/object/public/catalogo/${sub}/${catalogo.fileName}` : ''"
          alt="Imagem do Produto" />
        <div class="catalog-info">
          <p><strong>ID:</strong> {{ index + 1 }}</p>
          <p><strong>Produto:</strong> {{ catalogo.nome }}</p>
          <p><strong>Pontos:</strong> {{ catalogo.pontos }}</p>
          <p><strong>Descrição:</strong> {{ catalogo.descricao }}</p>
        </div>
        <button class="btn-editar" @click="openEditModal(catalogo)">Editar</button>
        <button class="btn-deletar" @click="deleteItem(catalogo)">Deletar</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Cadastrar Produto</h2>
        <form @submit.prevent="addProduto">
          <label>Nome:</label>
          <input type="text" v-model="newProduto.nome" required />

          <label>Descrição:</label>
          <textarea v-model="newProduto.descricao" required></textarea>

          <label>Pontos:</label>
          <input type="number" v-model.number="newProduto.pontos" required />

          <label>Imagem:</label>
          <input type="file" @change="handleFileUpload" required />

          <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="Prévia da Imagem" class="preview" />

          <div class="modal-buttons">
            <button type="submit" :disabled="createLoading">
              <span v-if="createLoading">Salvando...</span>
              <span v-else>Salvar</span>
            </button>
            <button type="button" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Modal de Edição -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h2>Editar Produto</h2>
        <form @submit.prevent="updateProduto">
          <label>Nome:</label>
          <input type="text" v-model="editProduto.nome" required />
          <label>Descrição:</label>
          <textarea v-model="editProduto.descricao" required></textarea>
          <label>Pontos:</label>
          <input type="number" v-model.number="editProduto.pontos" required />
          <label>Imagem:</label>
          <input type="file" @change="handleEditFileUpload" />
          <img v-if="editImagePreviewUrl" :src="editImagePreviewUrl" alt="Prévia" class="preview" />
          <div class="modal-buttons">
            <button type="submit" :disabled="editLoading">
              <span v-if="editLoading">Salvando...</span>
              <span v-else>Salvar</span>
            </button>
            <button type="button" @click="closeEditModal" :disabled="editLoading">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
});


const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const showEditModal = ref(false);
const editLoading = ref(false);
const editProduto = ref({ id: null, fileName: "", pontos: null, nome: "", descricao: "", atualiza_em: null });
const editImageFile = ref(null);
const editImagePreviewUrl = ref(null);
const createLoading = ref(false);

function openEditModal(item) {
  editProduto.value = { ...item };
  editImageFile.value = null;
  editImagePreviewUrl.value = item.fileName ? `https://api.visaonews.org/storage/v1/object/public/catalogo/${sub.value}/${item.fileName}` : null;
  showEditModal.value = true;
}
function closeEditModal() {
  showEditModal.value = false;
  editProduto.value = { id: null, fileName: "", pontos: null, nome: "", descricao: "", atualiza_em: null };
  editImageFile.value = null;
  editImagePreviewUrl.value = null;
}

function handleEditFileUpload(event) {
  const file = event.target.files[0];
  editImageFile.value = file;
  if (file) editImagePreviewUrl.value = URL.createObjectURL(file);
}

const produtosCatalogo = ref([]);
const listPremios = ref([]);
const showModal = ref(false);
const newProduto = ref({
  fileName: "",
  pontos: null,
  nome: "",
  descricao: "",
  atualiza_em: null,
});
const imageFile = ref(null);
const sub = ref(null);
const imagePreviewUrl = ref(null);

function getUser() {
  const user = useSupabaseUser();
  sub.value = user.value.user_metadata.sub;
  console.log("User data:", user.value.user_metadata.sub);
  return user.value;
}

onMounted(() => {
  getUser();
  getPremios();
  fetchCatalogoData();
});

async function getPremios() {
  const { data, error } = await supabase
    .from("resgates_sorteio")
    .select("*")
    .eq("user_id", sub.value);
  if (error) {
    console.error("Error fetching premios:", error);
  } else {
    listPremios.value = data;
  }
}

async function deleteItem(catalogo) {
  console.log("Deleting produto_catalogo...", catalogo.fileName);

  try {
    // Deleta o arquivo do bucket
    if (catalogo.fileName) {
      const { error: bucketError } = await supabase.storage
        .from("catalogo/" + sub.value + "/" + catalogo.fileName) // Substitua "catalogo" pelo nome do bucket
        .remove([catalogo.fileName]);

      if (bucketError) {
        console.error("Erro ao deletar arquivo do bucket:", bucketError.message);
        return;
      }

      console.log("Arquivo deletado do bucket com sucesso:", catalogo.fileName);
    }

    // Deleta o item do banco de dados
    const { error: dbError } = await supabase
      .from("catalogo_produtos")
      .delete()
      .eq("id", catalogo.id);

    if (dbError) {
      console.error("Erro ao deletar produto do banco de dados:", dbError.message);
      return;
    }

    console.log("Produto deletado com sucesso do banco de dados:", catalogo.id);

    // Remove o item da lista localmente
    produtosCatalogo.value = produtosCatalogo.value.filter(
      (item) => item.id !== catalogo.id
    );
  } catch (err) {
    console.error("Erro ao deletar item:", err.message);
  }
}

async function fetchCatalogoData() {
  console.log('Fetching produtos_sorteio...');
  const { data, error } = await supabase.from('catalogo_produtos').select('*');
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('catalogo data:', data);
    produtosCatalogo.value = data;
  }
}

async function updateProduto() {
  editLoading.value = true;
  try {
    let fileName = editProduto.value.fileName;
    if (editImageFile.value) {
      if (editProduto.value.fileName) {
        const { error: bucketError } = await supabase.storage
          .from("catalogo/" + sub.value + "/" + editProduto.value.fileName)
          .remove([editProduto.value.fileName]);
        if (bucketError) {
          console.error("Erro ao deletar arquivo do bucket:", bucketError.message);
          editLoading.value = false;
          return;
        }
      }
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("catalogo/" + sub.value)
        .upload(uuidv4(), editImageFile.value, {
          cacheControl: "3600",
          contentType: editImageFile.value.type,
        });
      if (uploadError) {
        console.error("Erro ao enviar imagem:", uploadError.message);
        editLoading.value = false;
        return;
      }
      fileName = uploadData.path;
    }
    const { error } = await supabase
      .from("catalogo_produtos")
      .update({
        nome: editProduto.value.nome,
        descricao: editProduto.value.descricao,
        pontos: editProduto.value.pontos,
        fileName: fileName,
        atualiza_em: new Date().toISOString(),
      })
      .eq("id", editProduto.value.id);
    if (error) {
      console.error("Erro ao atualizar produto:", error.message);
      editLoading.value = false;
      fetchCatalogoData();
      closeEditModal();
      return;
    } else {
      fetchCatalogoData();
      closeEditModal();
    }
    
  } catch (err) {
    console.error("Erro ao atualizar produto:", err.message);
  }
  editLoading.value = false;
}

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  newProduto.value = {
    fileName: "",
    pontos: null,
    nome: "",
    descricao: "",
    atualiza_em: null,
  };
  imageFile.value = null;

  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = null;
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  imageFile.value = file;

  if (file) {
    imagePreviewUrl.value = URL.createObjectURL(file);
  } else {
    imagePreviewUrl.value = null;
  }
}

async function addProduto() {
  if (!imageFile.value) {
    alert("Por favor, selecione uma imagem.");
    return;
  }
  createLoading.value = true;
  try {
    // Envia a imagem para o bucket do Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("catalogo/" + sub.value)
      .upload(uuidv4(), imageFile.value, {
        cacheControl: "3600",
        contentType: imageFile.value.type,
      });

    if (uploadError) {
      console.error("Erro ao enviar imagem:", uploadError.message);
      createLoading.value = false;
      return;
    }

    console.log("Imagem enviada com sucesso:", uploadData);

    // Define o nome do arquivo no campo fileName
    newProduto.value.fileName = uploadData.path;
    newProduto.value.atualiza_em = new Date().toISOString();

    // Insere o produto no banco de dados
    const { data, error } = await supabase.from("catalogo_produtos").insert(newProduto.value);

    createLoading.value = false;
    fetchCatalogoData();
    closeModal();
    if (error) {
      console.error("Erro ao adicionar produto:", error.message);
      fetchCatalogoData();
      closeModal();
      createLoading.value = false;
    } else {
      console.log("Produto adicionado com sucesso:", data);
      listPremios.value.push(data[0]);
      fetchCatalogoData();
      closeModal();
      createLoading.value = false;
    }
  } catch (err) {
    console.error("Erro ao cadastrar produto:", err.message);
  }
}
</script>

<style scoped>
.btn-editar {
  background-color: #2935ff;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-editar:hover {
  background-color: #1d235c;
}

.catalog-container {
  padding: 30px 20px;
}

.titulo {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #30369d;
}

.subtitulo {
  margin-bottom: 30px;
  color: #555;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.catalog-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.catalog-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.catalog-info p {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
}

.btn-deletar {
  margin-left: auto;
  background-color: #e30614;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-deletar:hover {
  background-color: #b70411;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 25px 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input,
textarea {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.2s ease-in-out;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

button[type="submit"]:hover {
  background-color: #3c9741;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button[type="button"]:hover {
  background-color: #d6362c;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}
</style>