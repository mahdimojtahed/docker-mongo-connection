FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGODB_URI=mongodb://admin:password@localhost:27017/user-account?authSource=admin


EXPOSE 4000

CMD ["node", "App.js"]



