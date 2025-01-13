# Frontend Dockerfile (chatbot-app/Dockerfile)
FROM node:19-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]