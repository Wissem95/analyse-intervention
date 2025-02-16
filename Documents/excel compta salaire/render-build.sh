#!/usr/bin/env bash
# exit on error
set -o errexit

# Install correct Node.js version
export NODE_VERSION=18.19.0
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install $NODE_VERSION
nvm use $NODE_VERSION

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Create SQLite database directory and file
mkdir -p database
touch database/database.sqlite

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

# Install Node.js dependencies
export NODE_OPTIONS="--max_old_space_size=4096"
npm install --legacy-peer-deps --no-optional

# Build assets
CI=false npm run build
