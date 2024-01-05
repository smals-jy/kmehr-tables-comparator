#!/bin/bash

# Step 1 : Extract links and references names from the website
page_content=$(curl -s https://www.ehealth.fgov.be/standards/kmehr/en/tables)

# Extract rows with role="row" using pup
rows=$(echo "$page_content" | pup 'tr[role="row"]')

# Initialize counter for processed rows
processed_rows=0

# Create the temp directory and navigate to it
mkdir -p temp
echo "Created temp directory."

# Loop through each row
while read -r row; do
    name=$(echo "$row" | pup 'td.sorting_1 text{}')
    link=$(echo "$row" | pup 'a.btn-primary.icon-kmehr[href$=".xml"] attr{href}')

    if [ -n "$link" ]; then
        # Clean name (convert to uppercase)
        cleaned_name=$(echo "$name" | tr -d '\n\r' | tr '[:upper:]' '[:lower:]')

        # Download and copy the XML file
        echo "Downloading reference $cleaned_name..."
        wget -O "temp/$cleaned_name.xml" "https://www.ehealth.fgov.be$link"
        cp -r "temp/$cleaned_name.xml" "static/tables/$cleaned_name/labels.xml"

        # Increment the processed row counter
        ((processed_rows++))
    fi
done <<< "$rows"

# Display the number of processed rows
echo "Processed $processed_rows rows."

# Clean up by removing the temp directory
rm -r "temp"
echo "Removed temp directory."

echo "Script completed."
