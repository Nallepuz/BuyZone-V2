# Usa Node.js como base para construir
FROM node:20

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de package.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Compila la aplicación de producción
RUN npm run build

# Usa un servidor nginx para servir los archivos
FROM nginx:alpine

# Copia los archivos estáticos del build al servidor nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Arranca nginx
CMD ["nginx", "-g", "daemon off;"]
