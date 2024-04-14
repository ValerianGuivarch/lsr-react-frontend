# Utiliser une image de base officielle de Node.js version 20
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Gérer le fichier .env pour les variables d'environnement
COPY .env ./

# Construire l'application
RUN npm run build

# Installer serve pour servir l'application en production
RUN npm install -g serve

# Définir la commande pour démarrer l'application
CMD ["serve", "-s", "build", "-l", "3000"]

# Exposer le port 3000
EXPOSE 3000
