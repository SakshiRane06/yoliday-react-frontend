# Stage 1: Build the React application
# Use an official Node.js image. lts-alpine is small and efficient.
FROM node:lts-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the built application with Nginx
# Use an official Nginx image. alpine is small and efficient.
FROM nginx:alpine

# Copy the built files from the 'build' stage into the Nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a simple default Nginx config
# This config tells Nginx to serve the index.html file for any path, which is needed for React Router.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# The default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]