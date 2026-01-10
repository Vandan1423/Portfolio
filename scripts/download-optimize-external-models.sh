#!/bin/bash

# External Models Download & Optimization Script
# Downloads models from Cloudinary and optimizes them

echo "========================================="
echo "External Models Download & Optimization"
echo "========================================="
echo ""

# Create planets directory
PLANETS_DIR="public/models/planets"
mkdir -p "$PLANETS_DIR"

echo "✅ Created directory: $PLANETS_DIR"
echo ""

# Model URLs
declare -A MODELS=(
    ["Sun.glb"]="https://res.cloudinary.com/didezuerl/image/upload/v1766050619/Sun_h53741.glb"
    ["Pluto.glb"]="https://res.cloudinary.com/didezuerl/image/upload/v1766050617/Pluto_zwcgdv.glb"
    ["Earth.glb"]="https://res.cloudinary.com/didezuerl/image/upload/v1766050615/Earth_qgvnkk.glb"
    ["Planet1.glb"]="https://res.cloudinary.com/didezuerl/image/upload/v1766050616/Planet1_hjnset.glb"
    ["Planet2.glb"]="https://res.cloudinary.com/didezuerl/image/upload/v1766050616/Planet2_uoitxj.glb"
)

# Download function
download_model() {
    local filename="$1"
    local url="$2"
    local filepath="$PLANETS_DIR/$filename"

    echo "---------------------------------------"
    echo "Downloading: $filename"
    echo "---------------------------------------"
    echo "URL: $url"

    # Download with curl
    curl -L -o "$filepath" "$url"

    if [ $? -eq 0 ]; then
        local size=$(du -h "$filepath" | cut -f1)
        echo "✅ Downloaded: $size"
    else
        echo "❌ Failed to download $filename"
        return 1
    fi

    echo ""
}

# Download all models
echo "Downloading models from Cloudinary..."
echo ""

for filename in "${!MODELS[@]}"; do
    download_model "$filename" "${MODELS[$filename]}"
done

echo "========================================="
echo "Download Complete!"
echo "========================================="
echo ""
echo "Now optimizing downloaded models..."
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

# Optimize each downloaded model
cd "$PLANETS_DIR"

for filename in *.glb; do
    if [ -f "$filename" ]; then
        echo "---------------------------------------"
        echo "Optimizing: $filename"
        echo "---------------------------------------"

        original_size=$(du -h "$filename" | cut -f1)
        echo "Original size: $original_size"

        # Create backup
        cp "$filename" "${filename}.backup"

        # Optimize
        gltf-pipeline -i "$filename" -o "${filename}.opt" -d

        if [ $? -eq 0 ]; then
            optimized_size=$(du -h "${filename}.opt" | cut -f1)
            echo "✅ Optimized size: $optimized_size"

            # Calculate reduction
            original_bytes=$(stat -f%z "$filename")
            optimized_bytes=$(stat -f%z "${filename}.opt")
            reduction=$(echo "scale=2; (1 - $optimized_bytes / $original_bytes) * 100" | bc)

            echo "📊 Size reduction: ${reduction}%"

            # Replace original
            mv "${filename}.opt" "$filename"
            echo "✅ Replaced with optimized version"
        else
            echo "❌ Optimization failed for $filename"
            rm -f "${filename}.opt"
        fi

        echo ""
    fi
done

cd ../..

echo "========================================="
echo "All Models Downloaded & Optimized!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update StarSystem.jsx to use local paths:"
echo "   Replace: https://res.cloudinary.com/..."
echo "   With:    /models/planets/[ModelName].glb"
echo ""
echo "2. Clear browser cache and test"
echo ""
echo "Models location: $PLANETS_DIR"
echo "Backups saved with .backup extension"
echo ""
