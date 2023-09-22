FROM node:16-alpine
WORKDIR /wagraf
COPY package*.json ./
RUN npm i
COPY . ./
EXPOSE 3000
CMD [ "npm", "run", "start" ]

