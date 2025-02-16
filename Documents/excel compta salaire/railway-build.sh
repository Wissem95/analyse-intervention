#!/usr/bin/env bash
set -e

# Copier le fichier d'environnement
cp .env.railway .env

# Installer les dépendances PHP
composer install --no-dev --optimize-autoloader

# Créer le répertoire de la base de données
mkdir -p /app/database
touch /app/database/database.sqlite

# Générer la clé d'application
php artisan key:generate

# Créer le lien symbolique pour le stockage
php artisan storage:link

# Installer les dépendances Node.js
npm install --legacy-peer-deps --no-optional

# Construire les assets
npm run build

# Exécuter les migrations
php artisan migrate --force
