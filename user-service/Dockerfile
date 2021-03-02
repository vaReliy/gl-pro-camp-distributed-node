FROM node:14

#create app dir:
WORKDIR /usr/src/app

# Istall app dependencies
# Copy package.json and package-lock.json:
COPY package*.json ./

RUN npm install

#bundle app source
COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
