import extractTablesFromXSD from "./plugins/kmehr/extract-tables";
import { resolve as pathResolver } from "path";
import { readdir, writeFile, access, constants as FS_constants } from "fs/promises"

const KMEHR_FOLDER = pathResolver("static/kmehr");

// ehealth follows a convention for the cd file
// e.g KMEHR version 1.17.1 => cd-1_17.xsd
function convertVersion(inputVersion : string) {
    // Split the input version string into an array of parts
    const parts = inputVersion.split('.');
    return `${parts[0]}_${parts[1]}`;
}

async function main() {
    // Scan available folders
    const kmehr_versions = (await readdir(KMEHR_FOLDER, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    // For each version, compute their own tables 
    for (let kmehr_version of kmehr_versions) {
        console.log(`Processing KMEHR ${kmehr_version}`);
        const path_to_cd = pathResolver(KMEHR_FOLDER, kmehr_version, `cd-${convertVersion(kmehr_version)}.xsd`);
        const output = pathResolver(KMEHR_FOLDER, kmehr_version, `tables-${convertVersion(kmehr_version)}.json`)
        try {
            try {
                await access(output, FS_constants.F_OK);
                console.log("\t Result file does exist - Skipping ...");
            } catch (err) {
                console.log(`\t Result file doesn't exist - Creating ...`);
                const tables = await extractTablesFromXSD(path_to_cd);
                await writeFile(output, JSON.stringify(tables, null, "\t"));
            }
        } catch (err) {
            console.log(`\t Something went wrong`);
            console.error(err);
        }
    }    
}

main();