#!/bin/bash

# Step 1: Collect all folder names in /static/kmehr
folder_names=$(find /static/kmehr -mindepth 1 -maxdepth 1 -type d -printf "%f\n")

# Step 2: Extract links and version names from the website
page_content=$(curl -s https://www.ehealth.fgov.be/standards/kmehr/en/page/xschema)
links=$(echo "$page_content" | grep -oP '<a href="[^"]*"><span class="linkToZIP">ehealthxsd-[^<]*</span></a>')

# Count the number of links found
num_links=$(echo "$links" | wc -l)
echo "Found $num_links links."

# Create the /temp directory and navigate to it
mkdir -p /temp
echo "Created /temp directory."

echo "$links" | while read -r line; do
  version=$(echo "$line" | sed -n 's/.*ehealthxsd-\(.*\)\.zip.*/\1/p' | head -n 1)
  full_href=$(echo "$line" | sed -n 's/.*href="\([^"]*\).*/\1/p')

  # Check if version is not found in folder_names
  version_not_found=true
  for folder in "${folder_names[@]}"; do
    if [[ "$folder" == "$version" ]]; then
      version_not_found=false
      break
    fi
  done

  # Step 3: Download the files
  if $version_not_found; then
    echo "Downloading version $version..."
    wget -O "$version.zip" "https://www.ehealth.fgov.be$full_href"

    # Step 4: Unzip only the files under ehealth-kmehr/XSD/
    echo "Unzipping version $version..."
    unzip -j "$version.zip" "ehealth-kmehr/XSD/*" -d "/temp/$version"

    # Step 5: Copy the full version folder to /static/kmehr
    echo "Copying version $version to /static/kmehr/$version"
    cp -r "/temp/$version" "/static/kmehr/$version"
  fi
done

# Clean up by removing the /temp directory
rm -r "/temp"
echo "Removed /temp directory."

echo "Script completed."