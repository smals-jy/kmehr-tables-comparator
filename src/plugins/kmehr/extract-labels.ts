import { readFile } from "fs/promises"
import { DOMParser } from "@xmldom/xmldom"

// type of result
type KMEHR_MAPPING = {
    [x: string]: {
        fr?: string,
        nl?: string,
        de?: string,
        en?: string,
    }
}

export default async function extractTableFromXSD(path: string) : Promise<KMEHR_MAPPING> {
    // Load the XSD file
    const xsdContent = await readFile(path, {
        encoding: "utf-8"
    });

    // Initialize an empty object to store the enumeration values
    let result : KMEHR_MAPPING = {};

    // Create a DOMParser
    const parser = new DOMParser();

    // Parse the XSD content
    const xsdDoc = parser.parseFromString(xsdContent, 'text/xml');

    const valueElements = xsdDoc.getElementsByTagName('VALUE');

    // Iterate through each <VALUE> element and populate the result object
    for (let i = 0; i < valueElements.length; i++) {
        const valueElement = valueElements[i];
    
        // Extract code from the <VALUE> element
        const code = valueElement.getElementsByTagName('CODE')[0].textContent;
    
        // Initialize an object for the current code if not exists
        if (!result[code]) {
            result[code] = {};
        }
    
        // Extract and store descriptions in different languages
        const descriptionElements = valueElement.getElementsByTagName('DESCRIPTION');
        for (let j = 0; j < descriptionElements.length; j++) {
            const descriptionElement = descriptionElements[j];
            const language = descriptionElement.getAttribute('L') || 'en';
            const description = descriptionElement.textContent;
    
            // Update the result object with the extracted information
            result[code][language] = description;
        }
    }

    return result;
}