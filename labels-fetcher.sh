#!/bin/bash

# Step 1 : Extract links and references names from the website
page_content=$(curl -s https://www.ehealth.fgov.be/standards/kmehr/en/tables)
link=$(echo "$page_content" | grep -oP '<a[^>]*\shref="([^"]*)"[^>]*class="btn btn-primary icon-kmehr"[^>]*>\s*xml\s*</a>')

# Count the number of links found
num_links=$(echo "$links" | wc -l)
echo "Found $num_links links."

# Create the temp directory and navigate to it
mkdir -p temp
echo "Created temp directory."

echo "$links" | while read -r line; do

    # Prepare variables
    table=$(echo "$link" | sed -n 's/.*name=\([^&]*\).*/\1/p' | tr '[:lower:]' '[:upper:]')
    full_href=$(echo "$line" | sed -n 's/.*href="\([^"]*\).*/\1/p')

    # Step 2: Download the files
    echo "Downloading version $table..."
    wget -O "temp/$table.xml" "https://www.ehealth.fgov.be$full_href"

    # Step 3 : Replace old xml file
    cp -r "temp/$table.xml" "static/tables/$table/labels.xml"

done

# Clean up by removing the temp directory
rm -r "temp"
echo "Removed temp directory."

echo "Script completed."