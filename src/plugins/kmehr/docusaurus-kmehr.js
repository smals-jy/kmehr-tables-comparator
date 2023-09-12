// I can't use import / esm syntax in Docusaurus yet
const path = require("path");
const pathResolver = path.resolve;
const { readdir, readFile } = require("fs/promises");

// ehealth follows a convention for the cd file
// e.g KMEHR version 1.17.1 => cd-1_17.xsd
function convertVersion(inputVersion) {
    // Split the input version string into an array of parts
    const parts = inputVersion.split('.');
    return `${parts[0]}_${parts[1]}`;
}

// Fetch data
async function retrieveKMEHRDefinitions() {
    const KMEHR_FOLDER = pathResolver(__dirname, "../../..","static/kmehr");

    // Scan available folders
    const kmehr_versions = (await readdir(KMEHR_FOLDER, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    let result = {};

    // Extract the json payload for each & merge them into a single array
    for (let kmehr_version of kmehr_versions) {
        const output_path = pathResolver(KMEHR_FOLDER, kmehr_version, `tables-${convertVersion(kmehr_version)}.json`);
        const json = JSON.parse(await readFile(output_path));
        result[kmehr_version] = json;
    }

    return [kmehr_versions, result];
}

// Docusaurus declaration
function KMEHR_DIFF() {
    return {
        name: "docusaurus-eHealth-kmehr-plugin",
        // load json files that holds the table
        async loadContent() {
            return retrieveKMEHRDefinitions();
        },
        async contentLoaded({content, actions}) {
            const {createData, addRoute} = actions;
            const [VERSIONS, RESULT] = content;

            // Create versions.json
            const versionsJsonPath = await createData(
                'versions.json',
                JSON.stringify(VERSIONS),
            );

            // Create result.json
            const resultJsonPath = await createData(
                'result.json',
                JSON.stringify(RESULT),
            );

            // Add the '/diff' routes, and ensure it receives the props
            addRoute({
                path: '/diff',
                component: '@site/src/components/Diff.tsx',
                modules: {
                    // propName -> JSON file path
                    versions: versionsJsonPath,
                    dictionnary: resultJsonPath
                },
                exact: false,
            });

        }
    }
}

module.exports = KMEHR_DIFF;