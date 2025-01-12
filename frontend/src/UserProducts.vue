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
              <button type="button" class="btn btn-warning">Add to cart</button>
              <button type="button" class="btn btn-primary" style="margin-left: 90px;">Edit</button>
              <div class="espacio">
                <button type="button" class="btn btn-danger" style="margin-left: 40px;">Delete</button>
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
  name: 'UserProducts',
  data() {
    return {
      products: [],
      isLoggedIn: false // Add a data property to track login status
    };
  },
  mounted() {
    this.readProducts();
    this.checkLoginStatus(); // Check login status when component is mounted
  },
  methods: {
    readProducts() {
      axios.get('http://localhost:8081/products')
        .then((response) => {
          this.products = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    checkLoginStatus() {
  const userToken = localStorage.getItem('userToken');
  this.isLoggedIn = !!userToken; // Si hay un token, está logueado
}

  }
}
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

.logo-desktop {
  width: 200px;
  /* Cambia el tamaño según tus necesidades */
  height: auto;
  /* Mantiene la proporción de la imagen */
}

.nav-link {
  margin-right: 50px;
  /* Añade espacio entre los menús del nav */
}

element.style {
  margin-left: 200px;
}

.espacio {
  margin-top: 10px;
  margin-right: 50px;
}
</style>