# Stage 1: Build the React application
FROM node:lts-alpine as build

WORKDIR /app

# FIX: Copy package.json first.
COPY package.json ./

# Install dependencies. This will generate a lock file inside the container.
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy the built files from the 'build' stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy our simple Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]