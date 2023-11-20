FROM node:21-alpine
WORKDIR /app
COPY . .

ENV NODE_ENV production

RUN npm ci
RUN npm install
RUN npm run build

EXPOSE 3000
CMD [ "npx", "serve", "build" ]