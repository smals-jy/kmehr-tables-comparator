import {expect, test} from '@jest/globals';
import { resolve as pathResolver } from "path";
import extractTableFromXSD from "@site/plugins/kmehr/extract-tables";


test("Extract table from XSD", async () => {
    const path = "static/kmehr/1-38.1/cd-1_38.xsd";
    const absolutePath = pathResolver(__dirname, "..", path);
    const result = await extractTableFromXSD(absolutePath);
    expect(result).toHaveProperty("CD-HCPARTY");
    expect(result).not.toHaveProperty("CD-TRANSACTIONschemes");
    // toHaveProperty
});