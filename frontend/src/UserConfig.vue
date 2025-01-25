<template>
  <div class="account-options">
    <h2>Opciones de Cuenta</h2>
    <div class="options-list">
      <!-- Cambiar correo electrónico -->
      <div class="option-item">
        <button @click="toggleOption('changeEmail')">Cambiar correo electrónico</button>
        <div v-if="selectedOption === 'changeEmail'" class="option-form">
          <h3>Cambiar correo electrónico</h3>
          <input type="email" v-model="newEmail" placeholder="Nuevo correo electrónico" />
          <div class="buttons">
            <button @click="updateEmail">Guardar</button>
            <button @click="cancelOption">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- Cambiar contraseña -->
      <div class="option-item">
        <button @click="toggleOption('changePassword')">Cambiar contraseña</button>
        <div v-if="selectedOption === 'changePassword'" class="option-form">
          <h3>Cambiar contraseña</h3>
          <input type="password" v-model="newPassword" placeholder="Nueva contraseña" />
          <input type="password" v-model="confirmPassword" placeholder="Confirmar nueva contraseña" />
          <div class="buttons">
            <button @click="updatePassword">Guardar</button>
            <button @click="cancelOption">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- Eliminar cuenta -->
      <div class="option-item">
        <button @click="toggleOption('deleteAccount')">Eliminar cuenta</button>
        <div v-if="selectedOption === 'deleteAccount'" class="option-form">
          <h3>¿Estás seguro de eliminar tu cuenta?</h3>
          <p>Esta acción no se puede deshacer.</p>
          <div class="buttons">
            <button @click="deleteAccount">Eliminar</button>
            <button @click="cancelOption">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      selectedOption: null, // Opción seleccionada
      newEmail: "", // Nuevo correo
      newPassword: "", // Nueva contraseña
      confirmPassword: "", // Confirmación de contraseña
    };
  },
  methods: {
    // Alterna entre las opciones
    toggleOption(option) {
      this.selectedOption = this.selectedOption === option ? null : option;
    },
    // Resetea los campos y cierra el formulario
    cancelOption() {
      this.selectedOption = null;
      this.newEmail = "";
      this.newPassword = "";
      this.confirmPassword = "";
    },
    // Actualiza el correo electrónico
    async updateEmail() {
      try {
        // Expresión regular para validar correos electrónicos
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validar que el campo no esté vacío
        if (!this.newEmail) {
          alert("Por favor, introduce un nuevo correo electrónico.");
          return;
        }

        // Validar que el correo electrónico sea válido
        if (!emailRegex.test(this.newEmail)) {
          alert("Por favor, introduce un correo electrónico válido.");
          return;
        }

        const user_id = localStorage.getItem("userId");
        const response = await fetch("http://localhost:8081/update-email", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, email: this.newEmail }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || "Correo electrónico actualizado correctamente.");

          // Actualizar el email en el estado global
          localStorage.setItem("userEmail", this.newEmail);
          this.$root.userEmail = this.newEmail;

          // Recargar la página
          window.location.reload();
        } else {
          alert(data.message || "Error al actualizar el correo electrónico.");
        }
      } catch (error) {
        console.error(error);
        alert("Error al actualizar el correo electrónico.");
      }
    },

    // Actualiza la contraseña
    async updatePassword() {
      try {
        if (!this.newPassword || !this.confirmPassword) {
          alert("Por favor, introduce y confirma la nueva contraseña.");
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          alert("Las contraseñas no coinciden. Por favor, inténtalo nuevamente.");
          return;
        }

        const user_id = localStorage.getItem("userId"); // Obtén el ID del usuario desde localStorage
        const response = await fetch("http://localhost:8081/update-password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            password: this.newPassword,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert("Contraseña actualizada correctamente. Serás redirigido a la página de login.");
          // Desloguear al usuario
          localStorage.removeItem("userToken");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userId");
          this.$router.push("/login"); // Redirigir al login
        } else {
          alert(data.message || "Error al actualizar la contraseña.");
        }
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Error al actualizar la contraseña.");
      }
    },
    // Elimina la cuenta
    async deleteAccount() {
      try {
        const confirmed = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmed) return;

        const user_id = localStorage.getItem("userId"); // Obtén el ID del usuario desde localStorage
        const response = await fetch("http://localhost:8081/delete-account", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Cuenta eliminada correctamente. Serás redirigido a la página principal.");

          // Desloguear al usuario
          localStorage.removeItem("userToken");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userId");

          // Actualiza el estado global
          this.$root.isLoggedIn = false;
          this.$root.userEmail = "";

          // Redirigir a la página principal
          this.$router.push("/products");
        } else {
          alert(data.message || "Error al eliminar la cuenta.");
        }
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        alert("Error al eliminar la cuenta.");
      }
    },

  },
};
</script>


<style scoped>
.account-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* Para que ocupe toda la pantalla */
  padding: 20px;
  background-color: #272727;
}

h2 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #fffcfc;
}

.options-list {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.option-item {
  background: #272727;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option-item button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #007bff;
  transition: background-color 0.3s ease;
}

.option-item button:hover {
  background-color: #0056b3;
}

.option-item button.danger {
  background-color: #dc3545;
}

.option-item button.danger:hover {
  background-color: #a71d2a;
}

.option-form {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-form h3 {
  font-size: 1.5rem;
  color: #555;
  text-align: center;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.buttons button {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buttons button.btn-success {
  background-color: #28a745;
  color: #fff;
  border: none;
}

.buttons button.btn-success:hover {
  background-color: #218838;
}

.buttons button.btn-secondary {
  background-color: #6c757d;
  color: #fff;
  border: none;
}

.buttons button.btn-secondary:hover {
  background-color: #5a6268;
}

.buttons button.btn-danger {
  background-color: #dc3545;
  color: #fff;
  border: none;
}

.buttons button.btn-danger:hover {
  background-color: #a71d2a;
}
</style>
