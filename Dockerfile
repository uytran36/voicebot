# stage1 - build react app first 
#FROM node:12.16.1-alpine3.9 as build
FROM node:16.13.2-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./package-lock.json /app/


#RUN npm config set proxy http://proxy.hcm.fpt.vn:80
#RUN npm config set set https-proxy http://proxy.hcm.fpt.vn:80
RUN yarn 
COPY . /app
COPY sip-js/user-agent-options.d.ts node_modules/sip.js/lib/api/user-agent-options.d.ts
COPY sip-js/user-agent.js node_modules/sip.js/lib/api/user-agent.js
RUN yarn build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.17.8-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 8888
CMD ["nginx", "-g", "daemon off;"]
