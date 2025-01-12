<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignUp">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    return {
      username: '',
      email: '',
      password: '',
      successMessage: 'Usuario registrado con éxito', // Para mostrar el mensaje de éxito
    };
  },
  methods: {
    async handleSignUp() {
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
        if (data.success) {
          alert('¡Registrado con éxito!');
          this.$router.push('/login'); // Cambia '/login' por la ruta deseada
        } else {
          alert(data.message || 'Error during registration');
        }
      } catch (error) {
        console.error('Sign Up Error:', error);
      }
    },
  },
};
</script>
<style></style>