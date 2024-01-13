import extractLabelsFromXML from "./src/plugins/kmehr/extract-labels";
import { resolve as pathResolver } from "path";
import { readdir, writeFile } from "fs/promises"

const KMEHR_FOLDER = pathResolver("static/tables");

async function main() {
    // Scan available folders
    const kmehr_tables = (await readdir(KMEHR_FOLDER, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);    

    // For each table, compute their own labels
    for (let kmehr_table of kmehr_tables) {
        console.log(`Processing ${kmehr_table}`);
        const path_to_cd = pathResolver(KMEHR_FOLDER, kmehr_table, `labels.xml`);
        const output = pathResolver(KMEHR_FOLDER, kmehr_table, `labels.json`);
        try {
            const tables = await extractLabelsFromXML(path_to_cd);
            await writeFile(output, JSON.stringify(tables, null, "\t"));
        } catch (err) {
            console.log(`\t Something went wrong`);
            console.error(err);
        }
    } 
}

main();
