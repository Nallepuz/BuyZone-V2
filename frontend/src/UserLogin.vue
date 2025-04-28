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
  name: "UserLogin",
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    // Método para extraer el ID del token JWT
    extractUserIdFromToken(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (e) {
        console.error('Error extrayendo ID del token:', e);
        return null;
      }
    },

    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // Validación básica
        if (!this.email.trim()) {
          throw new Error('Por favor ingrese su email');
        }

        if (!this.password) {
          throw new Error('Por favor ingrese su contraseña');
        }

        const response = await fetch('http://localhost:8081/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email.trim(),
            password: this.password
          }),
        });

        if (!response.ok) {
          throw new Error('Credenciales incorrectas');
        }

        const data = await response.json();
        console.log('Datos de login:', data);

        // Obtener token y user ID de diferentes formas posibles
        const token = data.token || data.accessToken;
        if (!token) throw new Error('No se recibió token de autenticación');

        // Extraer userId (de la respuesta o del token)
        const userId = data.user?.id || this.extractUserIdFromToken(token);
        if (!userId) throw new Error('No se pudo obtener el ID de usuario');

        const userEmail = data.user?.email || data.email || this.email.trim();

        // Guardar en localStorage
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', userEmail);

        // Actualizar estado global
        this.$root.isLoggedIn = true;
        this.$root.userEmail = userEmail;
        
        // Redirigir
        this.$router.push('/products');

      } catch (error) {
        console.error('Error en login:', error);
        this.errorMessage = error.message || 'Error durante el inicio de sesión';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style></style>
