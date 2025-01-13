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
        <!-- Por cada item en el carrito, muestra los siguientes datos-->
        <tr v-for="item in cart.items" :key="item.id">    
          <td>{{ item.name }}</td>
          <td>{{ item.price }} €</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.price * item.quantity }} €</td>
          <td>
            <button @click="removeItem(item.id)" class="btn btn-danger">Eliminar</button>
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
  name: 'Cart',   //Nombre del componente
  data() {
    return {
      cart: { items: [], total: 0 }, // Estructura inicial del carrito
    };
  },
  async mounted() {
    const userId = 1; // Cambia esto si usas otro ID de usuario

    try {
      const response = await axios.get(`http://localhost:8081/cart/${userId}`);
      this.cart = response.data;
      console.log('Carrito cargado:', this.cart);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    }
  },
  methods: {
    removeItem(itemId) {
      // Eliminar el producto del array local
      this.cart.items = this.cart.items.filter(item => item.id !== itemId);

      // Actualizar el total del carrito
      this.cart.total = this.cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      console.log('Producto eliminado:', itemId);
    },
  },
};
</script>

<style>
/* Estilos personalizados si es necesario */
</style>
