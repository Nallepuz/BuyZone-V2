<template>
  <div class="container mt-5">
    <h3>Lista de productos en el carrito</h3>

    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cart.items" :key="item.item_id">
          <td>{{ item.name }}</td>
          <td>{{ item.price }} €</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.price * item.quantity }} €</td>
          <td>
            <button @click="removeItem(item.item_id)" class="btn btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-3">
      <h4>Total del carrito: {{ cart.total }} €</h4>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'UrList',
  data() {
    return {
      cart: {
        items: [],
        total: 0,
      },
    };
  },
  methods: {
    loadCart() {
      const userId = localStorage.getItem('userId');

      axios.get(`http://localhost:8081/cart/${userId}`)
        .then((response) => {
          this.cart.items = response.data.items;
          this.cart.total = response.data.total;
          console.log('Carrito cargado:', this.cart);
        })
        .catch((error) => {
          console.error('Error:', error.response?.data || error.message);
          alert(error.response?.data?.message || 'Error al cargar carrito');
        });
    },



    removeItem(itemId) {
      const userId = localStorage.getItem('userId');

      axios.delete(`http://localhost:8081/cart/${userId}/item/${itemId}`)
        .then(() => {
          alert('Producto eliminado');
          this.loadCart(); // Recargar después de eliminar
        })
        .catch((error) => {
          console.error('Error:', error.response?.data || error.message);
          alert(error.response?.data?.message || 'Error al eliminar');
        });
    }
  },
  mounted() {
    this.loadCart();
  },
  computed: {
    cartTotal() {
      return this.cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
  }
};
</script>




<style>
/* Estilos personalizados si es necesario */
</style>
