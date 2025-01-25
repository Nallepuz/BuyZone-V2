<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center"
    style="background-image: url('https://unacasitadepapel.com/wp-content/uploads/Destacada-lista-de-la-compra.jpg'); background-size: contain; background-repeat: no-repeat; background-position: center;">
    <div class="card" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <h3 class="card-title text-center">Login</h3>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" v-model="email" id="email" placeholder="Enter email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" v-model="password" id="password" placeholder="Password">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Submit</button>
        </form>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserLogin",  // Nombre del componente
  data() {

    // Devuelve un objeto con las propiedades del componente
    return {
      email: '',
      password: '',
      errorMessage: '', // Para almacenar el mensaje de error
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:8081/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        // Comprueba si la respuesta es correcta y si el login ha sido exitoso
        if (response.ok && data.success) {
          // Guarda el token, el user_id y el email del usuario en localStorage
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userEmail', data.user.email); // Guarda el email
          localStorage.setItem('userId', data.user.id); // Guarda el user_id

          // Actualiza el estado global
          this.$root.isLoggedIn = true;
          this.$root.userEmail = data.user.email; // Asigna el email al estado global

          // Redirige al usuario
          this.$router.push('/products');
        } else {
          this.errorMessage = data.message || 'Error during login';
        }
      } catch (error) {
        console.error('Login Error:', error);
        this.errorMessage = 'Unable to connect to the server';
      }
    },
  },
};
</script>

<style></style>
