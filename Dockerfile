FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Command to run the example server (or your main entry point)
# You might want to create a specific entry script for production
CMD ["node", "dist/examples/basic-server.js"]
