FROM node:18
LABEL author="tringuyennek"

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile \
    && yarn cache clean

COPY . .
RUN yarn build

EXPOSE 3005

CMD ["yarn", "start"]