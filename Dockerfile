# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Run generate prisma client
RUN npx prisma generate

# Expose the port the app runs on (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
