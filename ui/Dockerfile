FROM node:10-alpine

RUN mkdir /alephui
WORKDIR /alephui
COPY package.json /alephui
RUN npm --quiet --silent install .

COPY .npmrc /alephui/.npmrc
COPY i18n /alephui/i18n
COPY public /alephui/public
COPY scripts /alephui/scripts
COPY config /alephui/config
COPY src /alephui/src

# RUN npm run build
