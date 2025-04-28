-- CREAR BASE DE DATOS
CREATE DATABASE IF NOT EXISTS buyzone;
USE buyzone;

-- CREAR TABLA USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'cliente'
);

-- CREAR TABLA PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image TEXT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- INSERTAR DATOS EN PRODUCTS
INSERT INTO products (image, name, price) VALUES
('https://ultimainformatica.com/2217706-thickbox_default/asus-zenbook-pro-14-duo-oled-ux8402za-m3043w-portatil-14s-wxqa-core-i7-12700h-16gb-ram-512gb-ssd-iris-xe-graphics-windows-11.jpg', 'Asus Zenbook Pro 15', 2226.00),
('https://www.ikea.com/es/es/images/products/mittzon-escritorio-tinte-negro-chapa-fresno-negro__1206022_pe907346_s5.jpg?f=s', 'Mittzon', 250.00),
('https://m.media-amazon.com/images/I/51FlVhKXSLL.jpg', 'Phoenix Monarch', 350.00),
('https://www.tiendakrear3d.com/wp-content/uploads/2023/07/elegoo-saturn-31.webp', 'Elegoo Saturn 2k', 300.00),
('https://m.media-amazon.com/images/I/61b8-3KARZL.jpg', 'Fifine XLR', 50.00),
('https://img.pccomponentes.com/articles/57/577538/1197-logitech-g435-lightspeed-auriculares-gaming-inalambricos-negros.jpg', 'Logitech G435', 50.00),
('https://vortexvr.es/cdn/shop/files/silicone-goggle-cover-for-meta-quest-3-961962.jpg?v=1722320296', 'Meta Quest 3 512 GB', 480.00),
('https://www.orly.es/54946-medium_default/camara-deportiva-gopro-hero12-black.jpg', 'Go Pro Hero 12', 400.00),
('https://m.media-amazon.com/images/I/61CVR4L6IDL._AC_UF1000,1000_QL80_.jpg', 'Samsung Galaxy Tab S6 Lite', 270.00),
('https://media.gamestop.com/i/gamestop/20003488-1.jpg', 'SteamDeck', 450.00),
('https://thumb.pccomponentes.com/w-530-530/articles/1067/10670536/1855-asus-tuf-gaming-f15-fx507zu4-lp040-intel-core-i7-12700h-16gb-512gb-ssd-rtx-4050-156.jpg', 'ASUS TUF Gaming F15', 1200.00),
('https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/202408/08/00157063609572009_23__1200x1200.jpg', 'Google Pixel 9 Pro', 900.00);