# Use official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application port (adjust if your app uses a different port)
EXPOSE 3005

# Run the app by default
CMD ["npm", "start"]