import os
import requests
from bs4 import BeautifulSoup

# Create the directory for storing XML files
os.makedirs("static/tables", exist_ok=True)

# Fetch the HTML content
html_content = requests.get("https://www.ehealth.fgov.be/standards/kmehr/en/tables").text

# Parse HTML content
soup = BeautifulSoup(html_content, "html.parser")

# Initialize counter for processed rows
processed_rows = 0

# Find tbody tag and extract rows within it
tbody = soup.find('tbody')
rows = tbody.find_all("tr") if tbody else []

for row in rows:
    cols = row.find_all("td")
    if len(cols) >= 2:
        name = cols[0].find('a').get_text().strip().upper()  # Convert name to uppercase
        link = cols[1].find('a', class_="btn-primary", href=lambda x: x and x.endswith('.xml'))

        if link:
            link = link['href']
            # Download and save the XML file
            print(f"Downloading reference {name}...")
            xml_content = requests.get(f"https://www.ehealth.fgov.be{link}").text
            xml_path = f"static/tables/{name}/labels.xml"
            os.makedirs(os.path.dirname(xml_path), exist_ok=True)
            with open(xml_path, "w") as file:
                file.write(xml_content)

            # Increment the processed row counter
            processed_rows += 1

# Display the number of processed rows
print(f"Processed {processed_rows} rows.")
print("Script completed.")
