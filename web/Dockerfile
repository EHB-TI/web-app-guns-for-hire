# pull official base image
FROM node:16

# set working directory
WORKDIR /usr/src/web

# install app dependencies
COPY package.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g 

# add app
COPY . .

EXPOSE 3000
# start app
CMD ["npm", "start"]