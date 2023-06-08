# Use a lightweight base image
FROM nginx:alpine

# Copy the HTML files to the web server's document root
COPY . /usr/share/nginx/html/

# Set the working directory to the document root
WORKDIR /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Set the default command to start the web server
CMD ["nginx", "-g", "daemon off;"]
