FROM node:6
ADD ./package.json /bearsjs/package.json
WORKDIR /bearsjs
RUN npm install
ADD . /bearsjs
RUN npm test
