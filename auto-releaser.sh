#!/bin/bash

# Step 1: Extract links and version names from the website
page_content=$(curl -s https://www.ehealth.fgov.be/standards/kmehr/en/page/xschema)
links=$(echo "$page_content" | grep -oP '<a[^>]*\shref="([^"]*)"[^>]*><span class="linkToZIP">ehealthxsd-[^<]*</span></a>')

# Count the number of links found
num_links=$(echo "$links" | wc -l)
echo "Found $num_links links."

# Create the temp directory and navigate to it
mkdir -p temp
echo "Created temp directory."

echo "$links" | while read -r line; do
  version=$(echo "$line" | sed -n 's/.*ehealthxsd-\(.*\)\.zip.*/\1/p' | head -n 1)
  full_href=$(echo "$line" | sed -n 's/.*href="\([^"]*\).*/\1/p')
  absolute_url=$(realpath "https://www.ehealth.fgov.be/standards/kmehr/en/page/xschema/$full_href")

  # Step 2: Download the files
  
  # Check if the version directory does not exist
  if [ ! -d "static/kmehr/$version" ]; then
    echo "Downloading version $version..."
    wget -O "temp/$version.zip" "$absolute_url"

    # Step 3: Unzip only the files under ehealth-kmehr/XSD/
    echo "Unzipping version $version..."
    unzip -j "temp/$version.zip" "ehealth-kmehr/XSD/*" -d "temp/$version"

    # Step 4: Copy the full version folder to static/kmehr
    echo "Copying version $version to static/kmehr/$version"
    cp -r "temp/$version" "static/kmehr/$version"
  fi
done

# Clean up by removing the temp directory
rm -r "temp"
echo "Removed temp directory."

echo "Script completed."
