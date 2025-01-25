<template>
  <div id="app">
    <div class="row" style="margin-left: 200px;">
      <div class="col-md-4" v-for="item in products" :key="item.name">
        <div class="card mb-4 shadow-sm">
          <img :src="item.image" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text">{{ item.price }} €</p>
            <template v-if="isLoggedIn">
              <button type="button" class="btn btn-warning" @click="addToCart(item)">Add to cart</button>
              <button type="button" class="btn btn-primary" style="margin-left: 90px;"
                @click="startEditing(item)">Edit</button>
              <button type="button" class="btn btn-danger" style="margin-left: 40px;"
                @click="deleteProduct(item.name)">Delete</button>
            </template>

            <!-- Ventana emergente de edición específica para cada producto -->
            <div v-if="editingProduct?.id === item.id" class="edit-modal">
              <h5>Editando: {{ editingProduct.name }}</h5>
              <input type="text" v-model="editingProduct.name" placeholder="Nuevo nombre" />
              <input type="text" v-model="editingProduct.image" placeholder="Nueva URL de la imagen" />
              <input type="number" v-model="editingProduct.price" placeholder="Nuevo precio" />
              <div class="buttons">
                <button class="btn btn-success" @click="saveEdit">Guardar</button>
                <button class="btn btn-secondary" @click="cancelEdit">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'UserProducts',     // Componente para mostrar los productos
  data() {

    // Inicializar los datos
    return {
      products: [],
      urlist: [], // Lista de productos añadidos al carrito
      isLoggedIn: false,
      editingProduct: null, // Producto en edición
    };
  },
  mounted() {
    this.readProducts();     // Leer los productos
    this.checkLoginStatus(); // Comprobar estado de sesión
  },
  methods: {

    // Método para leer los productos
    readProducts() {
      axios
        .get('http://localhost:8081/products')
        .then((response) => {
          this.products = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // Método para eliminar un producto
    deleteProduct(productName) {
      if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${productName}"?`)) {
        return;
      }
      axios
        .delete(`http://localhost:8081/products/${productName}`)
        .then(() => {
          this.products = this.products.filter((product) => product.name !== productName);
          alert('Producto eliminado exitosamente.');
        })
        .catch((error) => {
          console.error('Error al eliminar el producto:', error);
          alert('Error al eliminar el producto. Por favor, inténtalo de nuevo.');
        });
    },

    // Método para iniciar la edición de un producto
    startEditing(product) {
      console.log('Iniciando edición para:', product); // Log del producto seleccionado
      this.editingProduct = { ...product }; // Clona los datos del producto en edición
    },

    saveEdit() {
      const { id, name, price, image } = this.editingProduct;

      if (!name || !image || price == null || price <= 0) {
        alert('Todos los campos deben ser válidos y completos.');
        return;
      }

      axios
        .put(`http://localhost:8081/products/${id}`, { name, price, image }) // Usa el ID
        .then(() => {
          this.editingProduct = null;
          this.readProducts(); // Recargar productos actualizados
        })
        .catch((error) => {
          console.error('Error al guardar edición:', error);
          alert('Error al actualizar el producto. Inténtalo nuevamente.');
        });
    },

    cancelEdit() {
      this.editingProduct = null; // Cancelar la edición
    },
    checkLoginStatus() {
      const userToken = localStorage.getItem('userToken');
      this.isLoggedIn = !!userToken; // Si hay un token, está logueado
    },

    // Método para añadir un producto al carrito
    addToCart(product) {
      const userId = localStorage.getItem('userId');

      axios
        .post('http://localhost:8081/cart', {
          user_id: userId,
          product_id: product.id,
        })
        .then((response) => {
          console.log('Producto añadido:', response.data.cart); // Muestra el carrito actualizado
          alert('Producto añadido al carrito.');
          this.loadCart(); // Cargar el carrito actualizado
        })
        .catch((error) => {
          console.error('Error al añadir producto al carrito:', error.response?.data || error.message);
          alert('Error al añadir producto al carrito.');
        });
    },

    loadCart() {
      const userId = localStorage.getItem('userId'); // Obtén el ID del usuario logueado

      axios
        .get(`http://localhost:8081/cart/${userId}`)
        .then((response) => {
          this.cart = response.data; // Actualiza los productos en el carrito
          console.log('Carrito cargado:', this.cart); // Verifica los datos en la consola
        })
        .catch((error) => {
          console.error('Error al cargar el carrito:', error);
          alert('Error al cargar el carrito.');
        });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #b3b8bd;
  background-color: #272727;
}

.text-bg {
  background-color: #3e3f41;
}

.card {
  width: 20rem;
}

.card-img-top {
  width: 50%;
  height: 250px;
  object-fit: auto;
}

.card-body {
  background-color: #909192;
}

.espacio {
  margin-top: 10px;
  margin-right: 50px;
}
</style>
