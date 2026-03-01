#!/bin/bash

# Script to backup and optionally remove old static files
# that are now replaced by dynamic versions

BACKUP_DIR="./backup-static-files"
PUBLIC_DIR="./public"

echo "🔄 Backing up old static files..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup files if they exist
if [ -f "$PUBLIC_DIR/manifest.json" ]; then
  cp "$PUBLIC_DIR/manifest.json" "$BACKUP_DIR/manifest.json.backup"
  echo "✅ Backed up manifest.json"
else
  echo "⚠️  manifest.json not found in public/"
fi

if [ -f "$PUBLIC_DIR/robots.txt" ]; then
  cp "$PUBLIC_DIR/robots.txt" "$BACKUP_DIR/robots.txt.backup"
  echo "✅ Backed up robots.txt"
else
  echo "⚠️  robots.txt not found in public/"
fi

if [ -f "$PUBLIC_DIR/sitemap.xml" ]; then
  cp "$PUBLIC_DIR/sitemap.xml" "$BACKUP_DIR/sitemap.xml.backup"
  echo "✅ Backed up sitemap.xml"
else
  echo "⚠️  sitemap.xml not found in public/"
fi

echo ""
echo "📦 Backup complete! Files saved to: $BACKUP_DIR"
echo ""
echo "These files are now dynamic and served from src/pages/"
echo "The old static versions in public/ will be overridden by the dynamic versions."
echo ""

# Ask if user wants to remove the old files
read -p "Do you want to remove the old static files from public/? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -f "$PUBLIC_DIR/manifest.json"
  rm -f "$PUBLIC_DIR/robots.txt"
  rm -f "$PUBLIC_DIR/sitemap.xml"
  echo "🗑️  Old static files removed from public/"
  echo "✅ Your site now uses 100% dynamic configuration!"
else
  echo "ℹ️  Old files kept. They will be overridden by dynamic versions anyway."
fi

echo ""
echo "Done! 🎉"
