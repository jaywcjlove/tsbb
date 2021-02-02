FROM node:12

ENV APPDIR /opt/app

RUN mkdir -p $APPDIR 
ADD . $APPDIR

COPY package.json package-lock.json* ./
#RUN npm install --only=production && npm cache clean --force
RUN npm install --registry=https://registry.npm.taobao.org && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR $APPDIR
CMD [ "node", "/opt/app/lib/main.js" ]
EXPOSE 3009
