FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production --silent && mv node_modules ../
RUN npm install prisma
COPY . .
EXPOSE 3000
RUN chown -R node:node /usr/src/app
USER node
RUN npx prisma generate
CMD ["npm", "run", "start:prod"]
