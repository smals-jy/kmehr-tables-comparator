import React, { useState } from 'react';

// lodash method
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import groupBy from 'lodash/groupBy'

// Docusaurus components
import Details from "@theme/Details"
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from "@theme/CodeBlock";
import Layout from '@theme/Layout';

// Output format of the
type KMEHR_Mapping = {
    [x: string]: string[]
}

type Props = {
  versions: string[];
  dictionnary: {
    [version: string]: KMEHR_Mapping;
  };
  labels: {
    [table: string]: {
      [code: string]: {
        fr?: string,
        nl?: string,
        de?: string,
        en?: string,
      }
    }
  }
};

type Added_Value = {
    // From which kmehr table it is
    table: string;
    // The new value
    new_value: string;
};
type Deleted_Value = {
    // From which kmehr table it is
    table: string;
    // The old value
    old_value: string;
}
type Differences = {
    ADDED_VALUES: Added_Value[],
    DELETED_VALUES: Deleted_Value[],
    NEW_TABLES: string[],
    labels: {
      [table: string]: {
        [code: string]: {
          fr?: string,
          nl?: string,
          de?: string,
          en?: string,
        }
      }
    },
}

function AddedValuesViewer({ADDED_VALUES, labels}: Differences) {
  const groupedResult = groupBy(ADDED_VALUES, val => val.table);

  return (
    <Details 
      summary={"Added values"}
    >
      {
        <Tabs
          defaultValue="0"
        >
          {
            Object
              .entries(groupedResult)
              .map( ([tableName, newValues], idx) => {

                // extract labels related to this tablename and values
                const current_labels = Object
                  .entries((labels[tableName] || {}))
                  .filter(s => newValues.some(v => v.new_value == s[0]));

                return (
                  <TabItem value={idx.toString()} label={tableName}>
                    <Tabs>
                      <TabItem value='list' label='LIST' default>
                        <ul>
                          {
                            newValues.map(val => <li key={val.new_value}>{val.new_value}</li>)
                          }
                        </ul>
                      </TabItem>
                      <TabItem value='json' label='JSON'>
                        <CodeBlock language='json'>
                          {JSON.stringify(newValues.map(val => val.new_value), null, "\t")}
                        </CodeBlock>
                      </TabItem>
                      <TabItem value='labels' label='Labels'>
                        <table>
                          <thead>
                            <tr>
                              <th>Code</th>
                              <th>Meaning (English)</th>
                              <th>Meaning (French)</th>
                              <th>Meaning (Dutch)</th>
                              <th>Meaning (German)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              current_labels.map( ([code, entry]) => <tr key={code}>
                                <th>{code}</th>
                                <th>{entry.en || ""}</th>
                                <th>{entry.fr || ""}</th>
                                <th>{entry.nl || ""}</th>
                                <th>{entry.de || ""}</th>
                              </tr>)
                            }
                          </tbody>
                        </table>
                      </TabItem>
                    </Tabs>
                  </TabItem>
                )
              })
          }
        </Tabs>
      }
    </Details>
  )
}

function DeletedValuesViewer({DELETED_VALUES, labels}: Differences) {
  const groupedResult = groupBy(DELETED_VALUES, val => val.table);

  return (
    <Details 
      summary={"Deleted values"}
    >
      {
        <Tabs
          defaultValue="0"
        >
          {
            Object
              .entries(groupedResult)
              .map( ([tableName, newValues], idx) => {

                // extract labels related to this tablename and values
                const current_labels = Object
                  .entries((labels[tableName] || {}))
                  .filter(s => newValues.some(v => v.old_value == s[0]));

                return (
                  <TabItem value={idx.toString()} label={tableName}>
                    <Tabs>
                      <TabItem value='list' label='LIST' default>
                        <ul>
                          {
                            newValues.map(val => <li key={val.old_value}>{val.old_value}</li>)
                          }
                        </ul>
                      </TabItem>
                      <TabItem value='json' label='JSON'>
                        <CodeBlock language='json'>
                          {JSON.stringify(newValues.map(val => val.old_value), null, "\t")}
                        </CodeBlock>
                      </TabItem>
                      <TabItem value='labels' label='Labels'>
                        <table>
                          <thead>
                            <tr>
                              <th>Code</th>
                              <th>Meaning (English)</th>
                              <th>Meaning (French)</th>
                              <th>Meaning (Dutch)</th>
                              <th>Meaning (German)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              current_labels.map( ([code, entry]) => <tr key={code}>
                                <th>{code}</th>
                                <th>{entry.en || ""}</th>
                                <th>{entry.fr || ""}</th>
                                <th>{entry.nl || ""}</th>
                                <th>{entry.de || ""}</th>
                              </tr>)
                            }
                          </tbody>
                        </table>
                      </TabItem>
                    </Tabs>
                  </TabItem>
                )
              })
          }
        </Tabs>
      }
    </Details>
  )
}

function NewTablesViewer({NEW_TABLES}: Differences) {
  return (
    <Details
      summary={"New tables"}
    >
      <ul>
        {
          NEW_TABLES.map(table => <li key={table}>{table}</li>)
        }
      </ul>
    </Details>
  )
}

// Custom sorting function for version-dotted number strings like kmehr
function compareVersions(a : string, b : string) {
  const versionA = a.split('.').map(Number);
  const versionB = b.split('.').map(Number);

  for (let i = 0; i < versionA.length; i++) {
      if (versionA[i] < versionB[i]) return -1;
      if (versionA[i] > versionB[i]) return 1;
  }

  return 0;
}

export default function DiffComponent({ versions, dictionnary, labels }: Props) {
  const [fromVersion, setFromVersion] = useState<string | null>(null);
  const [toVersion, setToVersion] = useState<string | null>(null);
  const [diffResult, setDiffResult] = useState<Omit<Differences, "labels">>({
    ADDED_VALUES: [],
    DELETED_VALUES: [],
    NEW_TABLES: []
  });

  const handleFromVersionChange = (version: string) => {
    setFromVersion(version);
  };

  const handleToVersionChange = (version: string) => {
    setToVersion(version);
  };

  const computeDiff = () => {
    if (!fromVersion || !toVersion || compareVersions(fromVersion, toVersion) !== -1 ) {
      alert('Please select valid "from" and "to" versions.');
      return;
    }

    // Fetch data
    const fromData = dictionnary[fromVersion];
    const toData = dictionnary[toVersion];

    // Perform diff
    const differences = {
        "ADDED_VALUES": findAddedValues(fromData, toData),
        "DELETED_VALUES": findDeletedValues(fromData, toData),
        "NEW_TABLES": findNewTables(fromData, toData)
    };
    setDiffResult(differences);
  };

  return (
    <Layout>
      <h2>Select Versions:</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <label>
          From Version:
          <select value={fromVersion || ''} onChange={(e) => handleFromVersionChange(e.target.value)}>
            <option value="">Select a version</option>
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </label>

        <label>
          To Version:
          <select value={toVersion || ''} onChange={(e) => handleToVersionChange(e.target.value)}>
            <option value="">Select a version</option>
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </label>
        <button onClick={computeDiff}>Compute Diff</button>
      </div>
      
      <div>
        <h2>Diff Result:</h2>
        {diffResult.ADDED_VALUES.length > 0 && <AddedValuesViewer {...diffResult} labels={labels} />}
        {diffResult.DELETED_VALUES.length > 0 && <DeletedValuesViewer {...diffResult} labels={labels} />}
        {diffResult.NEW_TABLES.length > 0 && <NewTablesViewer {...diffResult} labels={labels} />}
      </div>
    </Layout>
  );
}

function findAddedValues(fromData: KMEHR_Mapping, toData: KMEHR_Mapping) : Added_Value[] {

    const common_keys = intersection(Object.keys(fromData), Object.keys(toData)) as string[];
    let result : Added_Value[] = [];
    for(let key of common_keys) {
      const new_values = difference(toData[key], fromData[key]);
      if (new_values.length > 0) {
        result.push(
          ...new_values.map(val => ({
            table: key,
            new_value: val
          }))
        )
      }
    }
    return result;

}

function findDeletedValues(fromData: KMEHR_Mapping, toData: KMEHR_Mapping) : Deleted_Value[] {

  const common_keys = intersection(Object.keys(fromData), Object.keys(toData)) as string[];
  let result : Deleted_Value[] = [];
  for(let key of common_keys) {
    const removed_values = difference(fromData[key], toData[key]);
    if (removed_values.length > 0) {
      result.push(
        ...removed_values.map(val => ({
          table: key,
          old_value: val
        }))
      )
    }
  }
  return result;

}
function findNewTables(fromData: KMEHR_Mapping, toData: KMEHR_Mapping) : string[] {
  return difference(Object.keys(toData), Object.keys(fromData));
}

