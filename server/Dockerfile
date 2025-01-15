# Pobranie obrazu node:16
FROM node:16-alpine 

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Na porcie 5000 bedzie dzialal nasz obraz
EXPOSE 5000 

CMD ["npm","start"]