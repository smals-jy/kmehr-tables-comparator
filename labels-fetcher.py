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

# Function to make search easier for downloading link
def extract_xml_link_from_row(row):
  cols = row.find_all("td")
  for col in cols:
    links = col.find_all('a', href=True)  # Find all anchor elements with href attribute
    for link in links:
      if '/xml/' in link["href"]:
        return link["href"]
  return None

for row in rows:
    cols = row.find_all("td")
    if len(cols) >= 2:
        name = cols[0].find('a').get_text().strip().upper() 
        link = extract_xml_link_from_row(row)

        if link:
            # Download and save the XML file
            print(f"Downloading reference {name}...")
            xml_content = requests.get(f"https://www.ehealth.fgov.be/standards/kmehr/en{link}").text
            xml_path = f"static/tables/{name}/labels.xml"
            os.makedirs(os.path.dirname(xml_path), exist_ok=True)
            with open(xml_path, "w") as file:
                file.write(xml_content)

            # Increment the processed row counter
            processed_rows += 1

# Display the number of processed rows
print(f"Processed {processed_rows} rows.")
print("Script completed.")
