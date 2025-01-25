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
<<<<<<< HEAD
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
=======
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
>>>>>>> 6a4e6b8e0fda8aa3001273618ab6adcf813ad8b4
    </table>
    <div class="mt-3">
      <h4>Total del carrito: {{ cart.total }} €</h4><template>
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
  name: 'UrList',   // Nombre del componente
  data() {
    return {
      cart: { items: [], total: 0 }, // Estructura inicial del carrito
    };
  },
  methods: {
    // Cargar el carrito desde el backend
    loadCart() {
      const userId = localStorage.getItem('userId'); // ID del usuario logueado

      axios
        .get(`http://localhost:8081/cart/${userId}`)
        .then((response) => {
          this.cart = response.data; // Actualiza los productos en el carrito
          console.log('Carrito cargado:', this.cart); // Log para verificar
        })
        .catch((error) => {
          console.error('Error al cargar el carrito:', error);
          alert('Error al cargar el carrito.');
        });
    },

    // Eliminar un producto del carrito
    removeItem(itemId) {
      const userId = localStorage.getItem('userId'); // ID del usuario logueado

      axios
        .delete(`http://localhost:8081/cart/${userId}/item/${itemId}`)
        .then(() => {
          this.loadCart(); // Carga el carrito actualizado
          alert('Producto eliminado del carrito.');
        })
        .catch((error) => {
          console.error('Error al eliminar producto del carrito:', error);
          alert('Error al eliminar producto del carrito.');
        });
    },
  },
  mounted() {
    this.loadCart(); // Carga el carrito cuando se monta el componente
  },
};
</script>


<style>
/* Estilos personalizados si es necesario */
</style>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
<<<<<<< HEAD
  name: 'UrList',   // Nombre del componente
=======
  name: 'Cart',   //Nombre del componente
>>>>>>> 6a4e6b8e0fda8aa3001273618ab6adcf813ad8b4
  data() {
    return {
      cart: { items: [], total: 0 }, // Estructura inicial del carrito
    };
  },
<<<<<<< HEAD
  methods: {
    // Cargar el carrito desde el backend
    loadCart() {
      const userId = localStorage.getItem('userId'); // ID del usuario logueado

      axios
        .get(`http://localhost:8081/cart/${userId}`)
        .then((response) => {
          this.cart = response.data; // Actualiza los productos en el carrito
          console.log('Carrito cargado:', this.cart); // Log para verificar
        })
        .catch((error) => {
          console.error('Error al cargar el carrito:', error);
          alert('Error al cargar el carrito.');
        });
    },

    // Eliminar un producto del carrito
    removeItem(itemId) {
      const userId = localStorage.getItem('userId'); // ID del usuario logueado

      axios
        .delete(`http://localhost:8081/cart/${userId}/item/${itemId}`)
        .then(() => {
          this.loadCart(); // Carga el carrito actualizado
          alert('Producto eliminado del carrito.');
        })
        .catch((error) => {
          console.error('Error al eliminar producto del carrito:', error);
          alert('Error al eliminar producto del carrito.');
        });
    },
  },
  mounted() {
    this.loadCart(); // Carga el carrito cuando se monta el componente
=======
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
>>>>>>> 6a4e6b8e0fda8aa3001273618ab6adcf813ad8b4
  },
};
</script>

<<<<<<< HEAD

=======
>>>>>>> 6a4e6b8e0fda8aa3001273618ab6adcf813ad8b4
<style>
/* Estilos personalizados si es necesario */
</style>
