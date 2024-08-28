FROM node:22

WORKDIR /app
COPY . .

RUN npm install

ENTRYPOINT ["npm", "run", "dev"]