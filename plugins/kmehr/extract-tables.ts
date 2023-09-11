import { readFile } from "fs/promises"
import { DOMParser } from "@xmldom/xmldom"

// type of result
type KMEHR_MAPPING = {
    [x: string]: string[]
}

export default async function extractTableFromXSD(path: string) : Promise<KMEHR_MAPPING> {
    // Load the XSD file
    const xsdContent = await readFile(path, {
        encoding: "utf-8"
    });

    // Initialize an empty object to store the enumeration values
    let enumValuesObject : KMEHR_MAPPING = {};

    // Create a DOMParser
    const parser = new DOMParser();

    // Parse the XSD content
    const xsdDoc = parser.parseFromString(xsdContent, 'text/xml');

    // Function to recursively extract enumeration values
    function extractEnumValues(node : Element) {
        if (node.tagName === 'xsd:simpleType') {
            const nameAttribute = node.getAttribute('name');
            if (nameAttribute && nameAttribute.match(/.+values$/)) {
                const enumValues = [];
                const enumerationElements = node.getElementsByTagName('xsd:enumeration');
                for (let i = 0; i < enumerationElements.length; i++) {
                    enumValues.push(enumerationElements[i].getAttribute('value'));
                }
                enumValuesObject[nameAttribute] = enumValues;
            }
        }
        
        for (let child = node.firstChild; child; child = child.nextSibling) {
            if (child.nodeType === 1) {
                extractEnumValues(child as Element);
            }
        }
    }

    // Start extraction from the root element
    extractEnumValues(xsdDoc.documentElement);

    // Remove the "values" suffix from the keys
    for (const key in enumValuesObject) {
        const parentName = key.replace(/values$/, '');
        enumValuesObject[parentName] = enumValuesObject[key];
        delete enumValuesObject[key];
    }

    // return result
    return enumValuesObject;
}