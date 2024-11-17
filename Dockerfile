FROM node:lts-alpine As build
USER node

RUN mkdir -p /home/node
WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm i && npm cache clean --force

COPY --chown=node:node . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]