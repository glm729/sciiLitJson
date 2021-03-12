/** -- Operations -- **/

// Retrieve the data, and locate the div in the Twig
let data = API.getData("rowClicked").resurrect();
let divTwig = document.querySelector("#inputNext");

// Initialise the innerHTML of the regulation data input select
let inputRegulationIhtml = new String();

// Append options to the regulation input select innerHTML
["---", "decreased", "increased", "unknown"].forEach(e => {
  let option = document.createElement("option");
  option.innerHTML = e;
  inputRegulationIhtml += option.outerHTML;
});

// Define the label elements
let label = {
  smiles: makeNode({
    node: "label",
    attr: {
      for: "inputSmiles",
      innerHTML: "SMILES code",
      disabled: true,
      readonly: true
    }
  }),
  name: makeNode({
    node: "label",
    attr: {
      for: "inputName",
      innerHTML: "Name(s)"
    }
  }),
  disease: makeNode({
    node: "label",
    attr: {
      for: "inputDisease",
      innerHTML: "Disease status"
    }
  }),
  doi: makeNode({
    node: "label",
    attr: {
      for: "inputDoi",
      innerHTML: "DOI"
    }
  }),
  regulation: makeNode({
    node: "label",
    attr: {
      for: "inputRegulation",
      innerHTML: "Regulation"
    }
  })
};

// Define the input elements
let input = {
  smiles: makeNode({
    node: "input",
    attr: {
      id: "inputSmiles",
      type: "text",
      value: data.SMILES,
      disabled: true,
      readonly: true
    }
  }),
  name: makeNode({
    node: "input",
    attr: {
      id: "inputName",
      type: "text",
      value: (function() {
        let n = data.main["Metabolite Name"];
        if (typeof(n) === "string") return n;
        return n.join(", ");
      })(),
      disabled: true,
      readonly: true
    }
  }),
  disease: makeNode({
    node: "input",
    attr: {
      id: "inputDisease",
      type: "text",
      placeholder: "e.g. SARS-CoV-2",
      required: true
    }
  }),
  doi: makeNode({
    node: "input",
    attr: {
      id: "inputDoi",
      type: "text",
      placeholder: "e.g. 10.1111/evj.13292",  // Shameless self-promotion!
      required: true
    }
  }),
  regulation: makeNode({
    node: "select",
    attr: {
      id: "inputRegulation",
      innerHTML: inputRegulationIhtml
    }
  })
};

// Initialise the table and get the keys to iterate over
let table = divTable();
let keys = Object.keys(label);
// ^ ONLY because the keys are identical by design

// For each key, append the label and select elements
keys.forEach(k => {
  table.append(tableRowLabelNode({label: label[k], node: input[k]}));
});

// Clear out the Twig template div and append the table
divTwig.innerHTML = '';
divTwig.append(table);

// Create the button to add a new entry
let button = makeNode({
  node: "button",
  attr: {
    innerHTML: "ADD NEW LITERATURE ENTRY",
    style: {
      borderRadius: "0px",
      fontFamily: "monospace",
      fontWeight: "normal",
      margin: "4px 6px"
    }
  }
});
// ^ Would like to centre this under the table.
//   Perhaps wrap the table and button in a div?  Use the main Twig div?

// Cannot assign functions using applyAttributes -- fix, if possible?
button.onclick = submitFormData;

// Append the button to the Twig template div
divTwig.append(button);

/* -- End of operations -- */


/** -- Function definitions -- **/

// Function for creating a table row containing a label and a DOM node
function tableRowLabelNode(data) {
  let row = divTableRow();
  row.append(applyAttributes(
    divTableCell(),
    {innerHTML: data.label.outerHTML}
  ));
  row.append(applyAttributes(
    divTableCell(),
    {innerHTML: data.node.outerHTML}
  ));
  return row;
};

// Helper function for creating a node using the provided spec
function makeNode(spec) {
  return applyAttributes(document.createElement(spec.node), spec.attr);
};

// Helper function for applying a group of attributes to a DOM node
function applyAttributes(element, attributes) {
  for (let attr in attributes) {
    if (attr === "style") {
      for (let s in attributes.style) element.style[s] = attributes.style[s];
    } else if (attr === "innerHTML") {
      element.innerHTML = attributes.innerHTML;
    } else {
      element.setAttribute(attr, attributes[attr]);
    };
  };
  return element;
};

// Helper function for initialising a div table
function divTable() {
  let attrs = {
    class: "table",
    style: {
      display: "table"
    }
  };
  return applyAttributes(document.createElement("div"), attrs);
};

// Helper function for initialising a div table row
function divTableRow() {
  let attrs = {
    class: "table-row",
    style: {
      display: "table-row"
    }
  };
  return applyAttributes(document.createElement("div"), attrs);
};

// Helper function for initialising a div table cell
function divTableCell() {
  let attrs = {
    class: "table-cell",
    style: {
      display: "table-cell"
    }
  };
  return applyAttributes(document.createElement("div"), attrs);
};

// Special-purpose function for submitting the HTML (Twig) form data provided
// for the new literature entry
function submitFormData() {
  let output = new Object();
  let keys = {
    smiles: "SMILES",
    name: "Name",
    disease: "Disease Status",
    doi: "DOI",
    regulation: "Regulation"
  };
  for (let k in keys) {
    let selector = `#input${k.replace(/^[a-z]/, l => l.toUpperCase())}`;
    output[keys[k]] = document.querySelector(selector).value;
  };
  API.createData("newLiterature", output);
  return;
};
