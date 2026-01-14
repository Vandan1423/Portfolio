#!/bin/bash

# GLTF Model Compression Script
# Compresses all .glb models in public/models/ using Draco compression
# This reduces file sizes by 60-80% while maintaining visual quality

set -e  # Exit on error

MODELS_DIR="/Users/vandannagori/Documents/Web Development /portfolio/public/models"
BACKUP_DIR="$MODELS_DIR/backup_uncompressed"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  GLTF Model Compression with Draco${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if gltf-pipeline is installed
if ! command -v gltf-pipeline &> /dev/null; then
    echo -e "${YELLOW}⚠️  gltf-pipeline not found. Installing...${NC}"
    npm install -g gltf-pipeline
fi

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${BLUE}📁 Creating backup directory...${NC}"
    mkdir -p "$BACKUP_DIR"
fi

# Change to models directory
cd "$MODELS_DIR"

# Count total models
TOTAL_MODELS=$(ls -1 *.glb 2>/dev/null | wc -l | tr -d ' ')
echo -e "${GREEN}Found $TOTAL_MODELS models to compress${NC}"
echo ""

CURRENT=0
TOTAL_SIZE_BEFORE=0
TOTAL_SIZE_AFTER=0

# Process each .glb file
for model in *.glb; do
    if [ -f "$model" ]; then
        CURRENT=$((CURRENT + 1))
        
        # Get original size
        SIZE_BEFORE=$(stat -f%z "$model")
        TOTAL_SIZE_BEFORE=$((TOTAL_SIZE_BEFORE + SIZE_BEFORE))
        SIZE_BEFORE_MB=$(echo "scale=2; $SIZE_BEFORE / 1048576" | bc)
        
        echo -e "${BLUE}[$CURRENT/$TOTAL_MODELS] Processing: $model (${SIZE_BEFORE_MB}MB)${NC}"
        
        # Backup original
        if [ ! -f "$BACKUP_DIR/$model" ]; then
            echo "  📦 Backing up original..."
            cp "$model" "$BACKUP_DIR/$model"
        fi
        
        # Compress with Draco
        echo "  🗜️  Compressing with Draco..."
        gltf-pipeline -i "$model" -o "${model%.glb}_compressed.glb" -d \
            --draco.compressionLevel 10 \
            --draco.quantizePositionBits 14 \
            --draco.quantizeNormalBits 10 \
            --draco.quantizeTexcoordBits 12 \
            --draco.quantizeColorBits 8 \
            --draco.quantizeGenericBits 12 \
            --draco.unifiedQuantization \
            2>&1 | grep -v "Warning" || true
        
        # Replace original with compressed version
        mv "${model%.glb}_compressed.glb" "$model"
        
        # Get new size
        SIZE_AFTER=$(stat -f%z "$model")
        TOTAL_SIZE_AFTER=$((TOTAL_SIZE_AFTER + SIZE_AFTER))
        SIZE_AFTER_MB=$(echo "scale=2; $SIZE_AFTER / 1048576" | bc)
        
        # Calculate reduction
        REDUCTION=$(echo "scale=1; 100 * (1 - $SIZE_AFTER / $SIZE_BEFORE)" | bc)
        
        echo -e "  ${GREEN}✅ Compressed: ${SIZE_BEFORE_MB}MB → ${SIZE_AFTER_MB}MB (${REDUCTION}% reduction)${NC}"
        echo ""
    fi
done

# Calculate total reduction
TOTAL_BEFORE_MB=$(echo "scale=2; $TOTAL_SIZE_BEFORE / 1048576" | bc)
TOTAL_AFTER_MB=$(echo "scale=2; $TOTAL_SIZE_AFTER / 1048576" | bc)
TOTAL_REDUCTION=$(echo "scale=1; 100 * (1 - $TOTAL_SIZE_AFTER / $TOTAL_SIZE_BEFORE)" | bc)

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Compression Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Total Before:  ${TOTAL_BEFORE_MB}MB"
echo -e "Total After:   ${TOTAL_AFTER_MB}MB"
echo -e "Total Saved:   ${GREEN}${TOTAL_REDUCTION}%${NC}"
echo ""
echo -e "${YELLOW}💡 Backups saved in: $BACKUP_DIR${NC}"
echo -e "${YELLOW}💡 Your app now uses Draco-compressed models${NC}"
echo -e "${YELLOW}💡 Make sure DRACOLoader is configured in your app${NC}"
echo ""
