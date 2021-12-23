# pull official base image
FROM node:16

# set working directory
WORKDIR /usr/src/web

# install app dependencies
COPY package.json ./
RUN npm install
RUN npm install react-scripts@5.0.0 -g
RUN npm install serve -g

# add app
COPY . .

# environment variables
VOLUME [ "/home/tycho/web/" ]

# build app
RUN npm run build

# expose port
EXPOSE 3000

# start app
CMD ["serve", "-s", "build"]