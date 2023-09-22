FROM node:16-alpine
WORKDIR /wagraf
COPY package*.json ./
RUN npm i
COPY . ./

CMD [ "npm", "run", "start" ]

