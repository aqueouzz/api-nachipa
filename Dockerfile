# Imagen base
FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 4500

# Comando para correr la app
CMD ["npm", "run", "dev"]
