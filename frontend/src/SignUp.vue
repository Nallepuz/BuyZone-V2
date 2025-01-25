<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center"
    style="background-image: url('https://guias.donweb.com/wp-content/uploads/2024/05/Registro-de-usuarios-en-WordPress-16.png'); background-size: contain; background-repeat: no-repeat; background-position: center;">
    <div class="card" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <h3 class="card-title text-center">Sign Up</h3>
        <form @submit.prevent="handleSignUp">
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
        <!-- Se muestra el mensaje de error en caso de que haya uno -->
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignUp", // Nombre del componente
  data() {

    // Se inicializan las variables de email y password
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: '',
      successMessage: 'Usuario registrado con éxito',
    };
  },
  methods: {

    // Se utiliza async handleSignUp() para enviar la solicitud POST al servidor
    async handleSignUp() {
      console.log('Datos enviados:', this.email, this.password); // Verifica los valores enviados
      try {
        const response = await fetch('http://localhost:8081/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        // Se muestra el mensaje de éxito o error según la respuesta del servidor
        if (data.success) {
          alert('¡Registrado con éxito!');
          this.$router.push('/login');
        } else {
          alert(data.message || 'Error durante el registro.');
        }
      } catch (error) {
        console.error('Error al registrarse:', error);
        alert('Error en el servidor.');
      }
    }

  },
};
</script>

<style></style>
