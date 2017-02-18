FROM node:6.9.4
MAINTAINER Simon Fan <simon.fan@habem.us>

COPY . /application

WORKDIR /application

# port must match exposed port
ENV PORT 5000

ENTRYPOINT ["node", "/application/index.js"]

EXPOSE 5000
