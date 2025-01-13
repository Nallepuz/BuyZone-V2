<template>
  <div id="app">
    <div class="container mt-5"></div>
    <div class="row" style="margin-left: 200px;">
      <div class="col-md-4" v-for="item in products" :key="item.name">
        <div class="card mb-4 shadow-sm">
          <img :src="item.image" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text">{{ item.price }} €</p>
            <template v-if="isLoggedIn">
              <button type="button" class="btn btn-warning" @click="addToCart(item)"> Add to cart </button>
              <button type="button" class="btn btn-primary" style="margin-left: 90px;"
                @click="startEditing(item)">Edit</button>
              <div class="espacio">
                <button type="button" class="btn btn-danger" style="margin-left: 40px;"
                  @click="deleteProduct(item.name)">
                  Delete
                </button>
              </div>
            </template>
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
      this.editingProduct = { ...product }; // Clonar los datos del producto en edición
    },
    saveEdit() {
      const { name, price } = this.editingProduct;

      if (price == null || price <= 0) {
        alert('El precio debe ser un número positivo.');
        return;
      }

      axios
        .put(`http://localhost:8081/products/${name}`, { price })
        .then(() => {
          alert('Precio actualizado exitosamente.');
          this.editingProduct = null; // Cerrar el formulario de edición
          this.readProducts(); // Actualizar la lista de productos
        })
        .catch((error) => {
          console.error('Error al actualizar el precio:', error);
          alert('Error al actualizar el precio. Por favor, inténtalo de nuevo.');
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
      const userId = 1; // Cambia esto si usas otro ID de usuario

      axios
        .post('http://localhost:8081/cart', {
          user_id: userId,
          product_id: product.id, // Asegúrate de que cada producto tenga un ID válido
        })
        .then((response) => {
          console.log('Respuesta del servidor:', response.data);
          alert('Producto añadido al carrito.');
        })
        .catch((error) => {
          console.error('Error al añadir producto al carrito:', error);
          alert('Error al añadir producto al carrito.');
        });
    }
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
