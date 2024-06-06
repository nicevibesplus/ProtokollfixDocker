FROM node:20.11.0-alpine

#RUN apk --no-cache --virtual .build add build-base python git

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apk add --no-cache pandoc texlive git

RUN yarn install --pure-lockfile --production

ENV NODE_ENV production

EXPOSE 2344

CMD [ "npm","start" ]
