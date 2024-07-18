FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh .

RUN chmod +x wait-for-it.sh

EXPOSE 4000

CMD ["./wait-for-it.sh", "mongo:27017", "--", "node", "App.js"]



