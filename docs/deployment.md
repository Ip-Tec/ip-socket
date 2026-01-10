# Deployment Guide

`ip-socket` is designed to be easily deployed to modern cloud platforms like Render and Railway.

## Docker Support

A `Dockerfile` is included in the root of the project. This allows you to deploy the application as a container.

### Dockerfile Content
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```
*Note: Ensure you add a "start" script to your package.json pointing to the built server, e.g., `"start": "node dist/examples/basic-server.js"` or your custom entry point.*

## Render

1.  Create a new **Web Service** on Render.
2.  Connect your repository.
3.  Render will automatically detect the `Dockerfile`.
4.  Ensure the environment variable `PORT` is set (Render does this automatically, usually to 10000). `ip-socket` listens on `process.env.PORT` automatically.

## Railway

1.  New Project -> Deploy from GitHub.
2.  Railway will detect the `Dockerfile`.
3.  Railway injects a `PORT` variable.
4.  Your service should be live within minutes.

## Environment Variables

- `PORT`: The port the server listens on. (Default: 8080)
