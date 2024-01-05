#!/bin/bash

# Fetch the HTML content and use hxselect to extract rows with role="row"
rows=$(curl -s https://www.ehealth.fgov.be/standards/kmehr/en/tables | hxselect 'tr[role="row"]')

# Initialize counter for processed rows
processed_rows=0

# Create the temp directory and navigate to it
mkdir -p temp
echo "Created temp directory."

# Loop through each row
while read -r row; do
    name=$(echo "$row" | hxselect 'td.sorting_1' | sed 's/<[^>]*>//g' | tr -d '\n\r' | tr '[:upper:]' '[:lower:]')
    link=$(echo "$row" | hxselect 'a.btn-primary.icon-kmehr[href$=".xml"]' | sed -n 's/.*href="\([^"]*\)".*/\1/p')

    if [ -n "$link" ]; then
        # Download and copy the XML file
        echo "Downloading reference $name..."
        wget -O "temp/$name.xml" "https://www.ehealth.fgov.be$link"
        cp -r "temp/$name.xml" "static/tables/$name/labels.xml"

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
