#!/bin/bash

# 3D Model Optimization Script
# This script automatically optimizes GLB models using gltf-pipeline

echo "========================================="
echo "3D Model Optimization Script"
echo "========================================="
echo ""

# Check if gltf-pipeline is installed
if ! command -v gltf-pipeline &> /dev/null; then
    echo "❌ gltf-pipeline not found!"
    echo ""
    echo "Installing gltf-pipeline globally..."
    npm install -g gltf-pipeline

    if [ $? -ne 0 ]; then
        echo "❌ Failed to install gltf-pipeline"
        echo "Please run: npm install -g gltf-pipeline"
        exit 1
    fi
fi

echo "✅ gltf-pipeline found"
echo ""

# Navigate to models directory
MODELS_DIR="public/models"

if [ ! -d "$MODELS_DIR" ]; then
    echo "❌ Models directory not found: $MODELS_DIR"
    exit 1
fi

cd "$MODELS_DIR"

# Create backup directory
BACKUP_DIR="originals"
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir "$BACKUP_DIR"
    echo "✅ Created backup directory: $BACKUP_DIR"
fi

# Function to optimize a model
optimize_model() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local name="${filename%.*}"
    local output_file="${name}_optimized.glb"

    echo "---------------------------------------"
    echo "Optimizing: $filename"
    echo "---------------------------------------"

    # Get original file size
    local original_size=$(du -h "$input_file" | cut -f1)
    echo "Original size: $original_size"

    # Backup original
    cp "$input_file" "$BACKUP_DIR/$filename.backup"
    echo "✅ Backed up to: $BACKUP_DIR/$filename.backup"

    # Optimize with Draco compression
    gltf-pipeline -i "$input_file" -o "$output_file" -d

    if [ $? -eq 0 ]; then
        # Get optimized file size
        local optimized_size=$(du -h "$output_file" | cut -f1)
        echo "✅ Optimized size: $optimized_size"

        # Calculate reduction percentage
        local original_bytes=$(stat -f%z "$input_file")
        local optimized_bytes=$(stat -f%z "$output_file")
        local reduction=$(echo "scale=2; (1 - $optimized_bytes / $original_bytes) * 100" | bc)

        echo "📊 Size reduction: ${reduction}%"

        # Replace original with optimized
        mv "$output_file" "$input_file"
        echo "✅ Replaced original with optimized version"
    else
        echo "❌ Optimization failed for $filename"
    fi

    echo ""
}

# Find and optimize all GLB files
echo "Searching for GLB files..."
echo ""

glb_files=$(find . -maxdepth 1 -name "*.glb" -not -path "./$BACKUP_DIR/*")

if [ -z "$glb_files" ]; then
    echo "❌ No GLB files found in $MODELS_DIR"
    exit 1
fi

# Optimize each file
for file in $glb_files; do
    optimize_model "$file"
done

echo "========================================="
echo "Optimization Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Clear browser cache (Cmd+Shift+R)"
echo "2. Test your 3D portfolio"
echo "3. Check load times in DevTools Network tab"
echo ""
echo "Original files backed up in: $MODELS_DIR/$BACKUP_DIR"
echo ""
