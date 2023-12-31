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

// Custom sorting function for version-dotted number strings like kmehr
function compareVersions(a, b) {
    const versionA = a.split('.').map(Number);
    const versionB = b.split('.').map(Number);

    for (let i = 0; i < versionA.length; i++) {
        if (versionA[i] < versionB[i]) return -1;
        if (versionA[i] > versionB[i]) return 1;
    }

    return 0;
}

// Fetch data
async function retrieveKMEHRDefinitions() {
    const KMEHR_FOLDER = pathResolver(__dirname, "../../..","static/kmehr");

    // Scan available folders
    const kmehr_versions = (await readdir(KMEHR_FOLDER, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort(compareVersions);
    
    let result = {};

    // Extract the json payload for each & merge them into a single array
    for (let kmehr_version of kmehr_versions) {
        const output_path = pathResolver(KMEHR_FOLDER, kmehr_version, `tables-${convertVersion(kmehr_version)}.json`);
        const json = JSON.parse(await readFile(output_path));
        result[kmehr_version] = json;
    }

    return [kmehr_versions, result];
}

// Fetch labels
async function retrieveKMEHRLabels() {
    const KMEHR_FOLDER = pathResolver(__dirname, "../../..","static/tables");

    // Scan available folders
    const kmehr_labels = (await readdir(KMEHR_FOLDER, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    let result = {};

    // Extract the json payload for each & merge them into a single array
    for (let kmehr_label of kmehr_labels) {
        const output_path = pathResolver(KMEHR_FOLDER, kmehr_label, `labels.json`);
        const json = JSON.parse(await readFile(output_path));
        result[kmehr_label] = json;
    }

    return result;
}

// Docusaurus declaration
function KMEHR_DIFF(context, _opts) {
    return {
        name: "docusaurus-eHealth-kmehr-plugin",
        // load json files that holds the table
        async loadContent() {
            return Promise.all([
                retrieveKMEHRDefinitions(),
                retrieveKMEHRLabels(),
            ])
        },
        async contentLoaded({content, actions}) {
            const {createData, addRoute} = actions;
            const [KMEHR, LABELS] = content;
            const [VERSIONS, RESULT] = KMEHR;

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

            // Create labels.json
            const labelsJsonPath = await createData(
                'labels.json',
                JSON.stringify(LABELS),
            );

            // Add the '/diff' routes, and ensure it receives the props
            // Workaround to work both on local & remote
            const baseUrl = context.siteConfig.baseUrl !== "/" ? context.siteConfig.baseUrl.slice(0, context.siteConfig.baseUrl.length - 1) : "";
            addRoute({
                path: `${baseUrl}/diff`,
                component: '@site/src/components/Diff.tsx',
                modules: {
                    // propName -> JSON file path
                    versions: versionsJsonPath,
                    dictionnary: resultJsonPath,
                    labels: labelsJsonPath
                },
                exact: false,
            });

        }
    }
}

module.exports = KMEHR_DIFF;