// Get the last row clicked
let data = get("rowClicked").resurrect();

// Create the tables
let table = {
  main: tableDataMain(data),
  pathways: tableDataPathways(data)
};

// Find the sink divs
let sink = {
  main: document.querySelector("#tableMain"),
  pathways: document.querySelector("#tablePathways")
};

// Empty the sinks and append the corresponding tables
for (let g in sink) {
  sink[g].innerHTML = '';
  sink[g].append(table[g]);
};


/** -- Function definitions -- **/

// Apply a set of attributes to a DOM node
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

// Helper function to create a div table
function divTable() {
  let attrs = {
    class: "table",
    style: {
      display: "table"
    }
  };
  return applyAttributes(document.createElement("div"), attrs);
};

// Helper function to create a div table row
function divTableRow() {
  let attrs = {
    class: "table-row",
    style: {
      display: "table-row"
    }
  };
  return applyAttributes(document.createElement("div"), attrs);
};

// Helper function to create a div table cell
function divTableCell() {
  let attrs = {
    class: "table-cell",
    style: {
      display: "table-cell"
    }
  };
  return applyAttributes(document.createElement("div"), attrs);
};

// Function for creating the table of the main data
function tableDataMain(data) {
  let tableData = new Array();
  let keys = Object.keys(data.main).sort();
  let table = divTable();
  let headerRow = divTableRow();
  let headerCellAttr = {
    style: {
      borderBottom: "2px solid #000",
      fontWeight: "bold"
    }
  };
  ["Attribute", "Value"].forEach(v => {
    headerCellAttr.innerHTML = v;
    headerRow.append(applyAttributes(divTableCell(), headerCellAttr));
  });
  table.append(headerRow);
  keys.forEach(k => {
    let send = data.main[k];
    if (typeof(send) === "string") send = [send];
    if (send === undefined || send === null) send = [''];
    tableData.push({lead: k, data: send.map(s => switchDataLink(k, s))});
  });
  return addRowsLeader(table, tableData);
};

// Helper function for adding a series of "leader" rows to a table
function addRowsLeader(table, data) {
  data.forEach(d => tableRowsLeader(d).forEach(r => table.append(r)));
  return table;
};

// Function for creating a "leader"-type set of rows
function tableRowsLeader(content) {
  let output = new Array();
  let leaderAttrs = {
    innerHTML: content.lead,
    style: {
      borderRight: "1px solid #000",
      fontWeight: "bold",
      width: "96px"
    }
  };
  let data = content.data;
  if (typeof(data) === "string") data = [data];
  if (data === undefined || data === null) data = [''];
  data = data.sort();
  let leaderRow = divTableRow();
  leaderRow.append(applyAttributes(divTableCell(), leaderAttrs));
  leaderRow.append(applyAttributes(divTableCell(), {innerHTML: data[0]}));
  output.push(leaderRow);
  leaderAttrs.innerHTML = '';
  data = data.slice(1);
  while (data.length > 0) {
    let row = divTableRow();
    row.append(applyAttributes(divTableCell(), leaderAttrs));
    row.append(applyAttributes(divTableCell(), {innerHTML: data[0]}));
    output.push(row);
    data = data.slice(1);
  };
  return output;
};

// Function for creating the table of pathways data
function tableDataPathways(data) {
  let keys = Object.keys(data.pathways[0]).sort();
  let table = divTable();
  let headerRow = divTableRow();
  let headerCellAttr = {
    style: {
      borderBottom: "2px solid #000",
      fontWeight: "bold"
    }
  };
  keys.forEach(k => {
    headerCellAttr.innerHTML = k;
    headerRow.append(applyAttributes(divTableCell(), headerCellAttr));
  });
  table.append(headerRow);
  sortJsonKey(data.pathways, "PathBank ID").forEach(p => {
    table.append(pathwayRow(p));
  });
  return table;
};

// Helper function for adding a row for the pathway data table
function pathwayRow(data) {
  let row = divTableRow();
  row.append(linkCellPathwaySvg(data["PathBank ID"]));
  ["Pathway Name", "Pathway Subject"].forEach(k => {
    row.append(applyAttributes(divTableCell(), {innerHTML: data[k]}));
  });
  return row;
};

// Helper function for creating a table cell with an anchor as innerHTML
function linkCell(attr) {
  let aAttrs = {
    href: attr.href,
    innerHTML: attr.innerHTML,
    rel: "noopener noreferrer",
    target: "_blank"
  };
  let a = applyAttributes(document.createElement("a"), aAttrs);
  return applyAttributes(divTableCell(), {innerHTML: a.outerHTML});
};

function linkCellPathwaySvg(id) {
  return linkCell({
    href: `https://pathbank.org/view/${id}`,
    innerHTML: id
  });
};

// Inefficient helper function for sorting an Object by a particular attribute
function sortJsonKey(obj, key) {
  let output = new Array();
  let values = obj.map(o => o[key]).sort();
  let data = values.map(v => obj.filter(o => o[key] === v));
  data.forEach(dt => dt.forEach(d => output.push(d)));
  return output;
};

// Get anchor element outerHTML, given input spec (href/innerHTML)
function aOhtml(i) {
  let aAttr = {
    href: i.href,
    innerHTML: i.innerHTML,
    rel: "noopener noreferrer",
    target: "_blank"
  };
  return applyAttributes(document.createElement("a"), aAttr).outerHTML;
};

// Helper function for getting KEGG ID anchor outerHTML
function aKegg(id) {
  return aOhtml({
    href: `https://www.kegg.jp/dbget-bin/www_bget?cpd:${id}`,
    innerHTML: id
  });
};

// Helper function for getting ChEBI ID anchor outerHTML
function aChebi(id) {
  return aOhtml({
    href: `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${id}`,
    innerHTML: id
  });
};

// Helper function for getting HMDB ID anchor outerHTML
function aHmdb(id) {
  return aOhtml({
    href: `https://hmdb.ca/metabolites/${id}`,
    innerHTML: id
  });
};

// Helper function for getting CAS Registry ID anchor outerHTML
function aCas(id) {
  return aOhtml({
    href: `https://webbook.nist.gov/cgi/cbook.cgi?ID=${id}&Units=SI`,
    innerHTML: id
  });
};

// Helper function for getting chemical formula anchor outerHTML
function aFormula(id) {
  return aOhtml({
    href: `https://webbook.nist.gov/cgi/cbook.cgi?Formula=${id}&Units=SI`,
    innerHTML: id
  });
};

// Helper function for getting InChI ID or Key anchor outerHTML
function aInchi(id) {
  // NIST requires "InChI=" before keys as well
  let idHref = (/^InChI\=/.test(id)) ? id : `InChI=${id}`;
  return aOhtml({
    href: `https://webbook.nist.gov/cgi/cbook.cgi?${idHref}&Units=SI`,
    innerHTML: id
  });
};

// Switch to get the aOhtml of the corresponding key
function switchDataLink(key, id) {
  if (id === '') return id;
  switch (key) {
    case "CAS": return aCas(id);
    case "ChEBI ID": return aChebi(id);
    case "Formula": return aFormula(id);
    case "HMDB ID": return aHmdb(id);
    case "InChI":
    case "InChI Key": return aInchi(id);
    case "KEGG ID": return aKegg(id);
    default: return id;
  };
};
