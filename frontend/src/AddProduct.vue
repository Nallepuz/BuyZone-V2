<template>
    <div class="container vh-100 d-flex justify-content-center align-items-center"
      style="background-image: url('https://unacasitadepapel.com/wp-content/uploads/Destacada-lista-de-la-compra.jpg'); background-size: contain; background-repeat: no-repeat; background-position: center;">
      <div class="card" style="width: 100%; max-width: 400px;">
        <div class="card-body">
          <h3 class="card-title text-center">Login</h3>
          <form>
            <div class="form-group">
              <label for="email">Email address</label>
              <input type="email" class="form-control" id="email" placeholder="Enter email">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" id="password" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary btn-block">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </template>
    <script>
  export default {
    name: "AddProducts",
  };
  </script>
    <style></style>