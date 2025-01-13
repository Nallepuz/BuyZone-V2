
<!--Web que se utilizará como base para el resto de páginas-->
<template>
  <div id="app">
    <header class="p-3 text-bg">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <img class="logo-desktop"
              src="data:image/png;base64,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">
          </a>
          <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li style="margin-left: 50px;"><router-link to="/products" class="nav-link px-2 text-white">Products</router-link></li>

            <!-- Si no se está logueado, no aparecerán estos botones -->
            <template v-if="isLoggedIn">
            <li style="margin-left: 50px;"><router-link to="/urlist" class="nav-link px-2 text-white">Your Lists</router-link></li>
            <li style="margin-left: 50px;"><router-link to="/add" class="nav-link px-2 text-white">Add Product</router-link></li>
            </template>
          </ul>


          <!-- Si no se está logueado, no aparecerán estos botones, si no que aparecerán otros -->
          <div class="text-end">
            <template v-if="isLoggedIn">
              <span class="text-white me-2">{{ userEmail }}</span>    <!-- Muestra el email del usuario logueado -->
              <button @click="logout" class="btn btn-outline-light me-2">Sign out</button>
            </template>
            <template v-else>
              <router-link to="/login" class="btn btn-outline-light me-2">Login</router-link>
              <router-link to="/signup" class="btn btn-warning">Sign-up</router-link>
            </template>
          </div>
        </div>
      </div>
    </header>
    <router-view></router-view> 
  </div>
  <footer class="bg-dark text-white mt-5 p-4 text-center">
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <h5 style="color: grey;">About Us</h5>
        <p>We are a company dedicated to developing personalized product lists for users.</p>
      </div>
      <div class="col-md-4">
        <h5 style="color: grey;">Contact</h5>
        <ul class="list-unstyled">
          <li>Email: nestor@buyzone.com</li>
          <li>Phone: 618600704</li>
          <li>Address: San Valero High School</li>
        </ul>
      </div>
      <div class="col-md-4">
        <h5 style="color: grey;">Follow Us</h5>
        <ul class="list-unstyled">
          <li><a href="#" class="text-white">Facebook</a></li>
          <li><a href="#" class="text-white">Twitter</a></li>
          <li><a href="#" class="text-white">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-3">
      <p>&copy; 2025 Buyzone. All rights reserved.</p>
    </div>
  </div>
</footer>
</template>


<script>
export default {
  name: 'App',    // Nombre de la página
  data() {
    return {
      isLoggedIn: false,      // Esta variable controla si el usuario está logueado o no
      userEmail: ''           // Esta variable guarda el email del usuario logueado
    } 
  },
  methods: {
    logout() {                                              // Método para cerrar sesión
      this.isLoggedIn = false;                              // Se pone a false la variable de logueado
      this.userEmail = '';                                  // Se pone a vacío el email del usuario
      localStorage.removeItem('userToken');                 // Se borra el token del usuario
      localStorage.removeItem('userEmail');                 // Se borra el email del usuario
      this.$router.push({ path: '/products' }).then(() => { // Se redirige a la página de productos
        window.location.reload();
      });
    }
  },
  created() {                                               // Método que se ejecuta al cargar la página
    const userToken = localStorage.getItem('userToken');    // Se comprueba si hay un token guardado en el local storage
    const userEmail = localStorage.getItem('userEmail');    // Se comprueba si hay un email guardado en el local storage
    if (userToken) {                                        // Si hay un token guardado, se pone a true la variable de logueado
      this.isLoggedIn = true;                               // Se guarda el email del usuario
      this.userEmail = userEmail;                           // Se guarda el email del usuario
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
  color: #2c3e50;
}
</style>