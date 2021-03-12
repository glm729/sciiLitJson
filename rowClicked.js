// Get the required data
let code = get("rowClicked");
let data = get("dataLiterature");

if (data === undefined) {
  // Warn if the literature JSON has not been uploaded
  console.warn("Please upload the literature JSON to continue!");
} else {
  // Show the current relevant literature entr(y|ies) (if any)
  code = code.resurrect().SMILES;
  data = data.resurrect();
  let currentEntries = data.filter(d => d.SMILES === code);
  API.createData("currentEntries", currentEntries);
};
