#!/bin/bash

# Create the temp directory and navigate to it
mkdir -p temp
echo "Created temp directory."

# Initialize counter for processed rows
processed_rows=0

# Fetch the HTML content
html_content=$(curl -s https://www.ehealth.fgov.be/standards/kmehr/en/tables)

# Save the HTML content to a temporary file
echo "$html_content" > temp/index.html

# Use tidy to clean up the HTML content
tidy -o temp/tables.html temp/index.html > /dev/null 2>&1

# Read the cleaned HTML content back into a variable
cleaned_content=$(<temp/tables.html)

# Extract rows from cleaned HTML content using hxselect
rows=$(echo "$cleaned_content" | hxselect 'tr[role="row"]')

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

# For debug, to see the file used
cp -r "temp/tables.html" "static/tables/tables.html"

# Clean up by removing the temp directory
rm -r "temp"
echo "Removed temp directory."

echo "Script completed."
