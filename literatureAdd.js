// Bring in all required data
let data = API.getData("dataLiterature").resurrect();
let newData = API.getData("newLiterature").resurrect();
let rowClicked = API.getData("rowClicked").resurrect();

// Push the new entry to the literature data
data.push(newData);

// Save the new literature object, and fake a row click to refresh visible rows
API.createData("dataLiterature", data);
API.createData("rowClicked", rowClicked);

// Encode the URI component of the literature data and make the href
let uc = encodeURIComponent(JSON.stringify(data));
let hr = `data:application/json;charset=utf-8,${uc}`;

// Initialise an anchor and a button
let a = document.createElement("a");
let b = document.createElement("button");

// Hide the anchor, and set the href and time-stamped download name
a.style.display = "none";
a.setAttribute("download", `literature${timestamp()}.json`);
a.setAttribute("href", hr);

// Initialise button styles
let bStyle = {
  borderRadius: "0",
  display: "block",
  fontFamily: "monospace",
  fontWeight: "bold"
};

// Apply the styles to the button
for (let s in bStyle) b.style[s] = bStyle[s];

// Set innerHTML and the onclick function
b.innerHTML = "Download new literature JSON";
b.onclick = _ => a.click();

// init groundzero query id
let gz = document.querySelector("#dlNewLiterature");

// Clear the innerHTML of the Twig div
gz.innerHTML = '';

// Append the anchor and the button
gz.append(a);
gz.append(b);


// Helper function to make a timestamp
function timestamp() {
  let ps = v => v.toString().padStart(2, "0");
  let date = new Date();
  let year = date.getFullYear().toString();
  let month = ps(date.getMonth());
  let day = ps(date.getDay());
  let hours = ps(date.getHours());
  let minutes = ps(date.getMinutes());
  let seconds = ps(date.getSeconds());
  return `${year}${month}${day}${hours}${minutes}${seconds}`
};
