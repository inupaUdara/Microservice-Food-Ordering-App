FROM node:18
WORKDIR /app/order-purchasing-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "start"]