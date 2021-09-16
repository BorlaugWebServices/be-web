FROM node:11.6.0

COPY . /home/be-web

WORKDIR "/home/be-web"

RUN npm install --silent
RUN npm run build

RUN apt-get purge --remove -y openssh-client git

EXPOSE 8000

CMD [ "npm", "start" ]
