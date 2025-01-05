# use node:20-alpine as base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port 8000
EXPOSE 8000

# Start the app
CMD ["npm", "start"]