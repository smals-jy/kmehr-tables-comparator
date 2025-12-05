# KMEHR tables comparator

## Why ?

- https://www.ehealth.fgov.be/standards/kmehr/en/page/xschema doesn't offer full changelog for each release
- https://www.ehealth.fgov.be/standards/kmehr/en/tables doesn't offer versioned CD tables (e.g. what changed between versions 1.x & 1.y tables)
- Comparing XSD files isn't funny at all for humans

## How it works ?

It parses eHealth xsd definitions and generates a JSON summary of this release.  
Thanks to Docusaurus, we have a [diff tool](https://smals-jy.github.io/kmehr-tables-comparator/diff) that uses them.

## How to add a new version of KMEHR ?

1. Download it from https://www.ehealth.fgov.be/standards/kmehr/en/page/xschema 
2. Create a folder in `static/kmehr` (e.g. `1.39.0`)
3. Copy all files from `ehealth-kmehr/XSD` to this new folder
4. Run `npm run generate-json-tables`

⚠️ Don't forget to relaunch `npm start` / `npm run build` depending to your env.

## How to add a new table of KMEHR ?

1. Download its XML version from https://www.ehealth.fgov.be/standards/kmehr/en/tables 
2. Create a folder in `static/tables` (e.g. `CD-HCPARTY`)
3. Copy the xml file as `labels.xml` to this new folder
4. Run `npm run generate-labels`

⚠️ Don't forget to relaunch `npm start` / `npm run build` depending to your env.

## Run project in local

```bash
npm install
npm run start
```

## License

Check [License](./LICENSE) file

## Disclaimer

This project is a POC (proof of concept) of what sites that track KMEHR changes could offer. We do not offer any support for this project.
