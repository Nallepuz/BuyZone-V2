<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center"
    style="background-image: url('https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto-1200x900.jpg'); background-size: contain; background-repeat: no-repeat; background-position: center;">
    <div class="card" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <h3 class="card-title text-center">Add Product</h3>
        <form @submit.prevent="addProduct">
          <div class="form-group">
            <label for="imageUrl">Image URL</label>
            <input type="text" class="form-control" id="image" v-model="product.image" placeholder="Enter image URL">
          </div>
          <div class="form-group">
            <label for="name">Product Name</label>
            <input type="text" class="form-control" id="name" v-model="product.name" placeholder="Enter product name">
          </div>
          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" id="price" v-model="product.price" placeholder="Enter price">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Add Product</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "AddProduct",     // Agregado para mostrar mensajes de éxito
  data() {

    // Agregado para mostrar mensajes de éxito
    return {
      product: {
        image: '',
        name: '',
        price: ''
      },
      errorMessage: '',
      successMessage: '' // Agregado para mostrar mensajes de éxito
    };
  },
  methods: {

    // Se utiliza isValidUrl() para validar la URL de la imagen
    isValidUrl(url) {                                                             
      const pattern = new RegExp('^(https?:\\/\\/)?' +        // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' +                       // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +                   // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' +                          // query string
        '(\\#[-a-z\\d_]*)?$', 'i');                           // fragment locator
      return !!pattern.test(url);
    },

    // Se utiliza async addProduct() para enviar la solicitud POST al servidor
    async addProduct() {
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.isValidUrl(this.product.imageUrl)) {
        this.errorMessage = 'Please enter a valid URL.';
        return;
      }

      // Se envía la solicitud POST al servidor
      try {
        const response = await fetch('http://localhost:8081/products', {      
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.product)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al agregar el producto.');
        }

        this.successMessage = data.message; // Mensaje de éxito
        this.product.image = '';
        this.product.name = '';
        this.product.price = '';
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
