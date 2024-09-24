FROM node:22

WORKDIR /app
COPY . .

RUN npm install && npm run build

ENTRYPOINT ["npm", "start"]
