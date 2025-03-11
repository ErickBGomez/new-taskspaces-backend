# Etapa base para instalación de dependencias
FROM node:18-alpine AS base

# Define el directorio de trabajo
WORKDIR /src

# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Etapa para desarrollo
FROM base AS development

# Instala nodemon globalmente
RUN npm install -g nodemon

# Copia el resto del código al contenedor
COPY . .

# Expone el puerto del backend
EXPOSE 3000

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev"]

# Etapa para producción
FROM base AS production

# Copia el resto del código
COPY . .

# Expone el puerto del backend
EXPOSE 3000

# Comando para iniciar en modo producción
CMD ["npm", "start"]
