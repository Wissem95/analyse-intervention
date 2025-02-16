#!/usr/bin/env bash
# exit on error
set -o errexit

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
npm install --legacy-peer-deps

# Build assets
npm run build
