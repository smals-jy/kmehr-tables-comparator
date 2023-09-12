# KMEHR tables comparator

## Why ?

- https://www.ehealth.fgov.be/standards/kmehr/en/page/xschema doesn't offer full changelog for each release
- https://www.ehealth.fgov.be/standards/kmehr/en/tables doesn't offer versioned CD tables (e.g. what changed between versions 1.x & 1.y tables)
- Comparing XSD files isn't funny at all for humans

## How it works ?

It parses eHealth xsd definitions and generates a JSON summary of this release.  
Thanks to Docusaurus, we have a [diff tool](https://smals-jy.github.io/kmehr-tables-comparator/diff) that uses them.

## How to add an new version of the KMEHR ?

1. Download it from https://www.ehealth.fgov.be/standards/kmehr/en/page/xschema 
2. Create a folder in `static/kmehr` (e.g. `1.39.0`)
3. Copy all files from `ehealth-kmehr/XSD` to this new folder
4. Run `npm run generate-json-tables`

⚠️ Don't forget to relaunch `npm start` / `npm run build` depending to your env.

## License

TODO