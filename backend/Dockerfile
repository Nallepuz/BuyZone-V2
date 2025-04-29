# Usa Node.js como base
FROM node:20

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de package.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el resto del código
COPY . .

# Expone el puerto 8081
EXPOSE 8081

# Comando para arrancar el backend
CMD ["npm", "start"]
