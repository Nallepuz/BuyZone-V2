import axios from 'axios';

window.readProducts = function() { // Función para leer productos   
  axios.get('http://localhost:8080/products')   // Hacer una petición GET a la ruta /products
    .then(response => {        
      const productlist = response.data; // Array de productos
      const productUL = document.getElementById('products'); // Obtener el <ul> con el id 'products'

      productlist.forEach(product => {      
            const li = document.createElement('li'); // Crear un elemento <li>
            li.appendChild(document.createTextNode(product.name + ' (' + product.description + ') ' + product.price)) ;  
            productUL.appendChild(li); // Agregar el <li> al <ul>
      });
    });
}