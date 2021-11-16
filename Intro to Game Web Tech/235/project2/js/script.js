let categories; // a list that will store all the category inputs
var input, filter, table, tr, td, i, txtValue, itemCategory, category; // declares a bunch of variables that I'm going to need for sorting
const prefix = "kfm5870"; // a prefix for storing things
const itemKey = prefix + "item"; // a key to store the items
const locationKey = prefix + "location"; // a key to store the locations
window.onload = (e) => // initializes the search bars and stored items for the rest of the script
// also gives some events to the search bars and category buttons
{
    makeList()
    const itemBar = document.querySelector("input[name='itemSearch']");
    const locationBar = document.querySelector("input[name='locationSearch']");
    const storedItem = localStorage.getItem(itemKey);
    const storedLocation = localStorage.getItem(locationKey);

    const resetButton = document.querySelector("#resetbutton");
    resetButton.onclick = resetItems;

    if (storedItem) {
        itemBar.value = storedItem;
    }
    if (storedLocation) {
        locationBar.value = storedLocation;
    }

    itemBar.onkeyup = e => {
        localStorage.setItem(itemKey, e.target.value);
        itemSearch();
        locationSearch()
    };
    locationBar.onkeyup = e => {
        localStorage.setItem(locationKey, e.target.value);
        itemSearch();
        locationSearch()
    };
    categories = document.querySelectorAll("input[name='category']");
    for (let i = 0; i < categories.length; i++) {
        categories[i].addEventListener("click", filterCategories);
    }
};

function itemSearch() {// runs a search and brings up only items with the inputted text in the item name
    input = document.querySelector("input[name='itemSearch']");
    filter = input.value.toUpperCase();
    table = document.querySelector("table");
    tr = table.querySelectorAll("tr");
    for (i = 0; i < tr.length; i++) {
        if (tr[i].style.display == "") {
            td = tr[i].querySelectorAll("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function locationSearch() {// runs a search and brings up the items with the inputted text in the location list
    console.log("locationSearch() called");

    input = document.querySelector("input[name='locationSearch']");
    filter = input.value.toUpperCase();
    table = document.querySelector("table");
    tr = table.querySelectorAll("tr");
    for (i = 0; i < tr.length; i++) {
        if (tr[i].style.display == "") {
            td = tr[i].querySelectorAll("td")[3];
            if (td) {
                txtValue = td.innerText.split(',');
                if (txtValue[0].toUpperCase().indexOf(filter) > -1 || (txtValue[1] != null && txtValue[1].toUpperCase().indexOf(filter) > -1)) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function resetItems() {// resets both the list of items, as well as all of the searching tools
    console.log("resetItems() called");
    table = document.querySelector("table");
    tr = table.querySelectorAll("tr");
    for (i = 0; i < tr.length; i++) {
        tr[i].style.display = "";
    }

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].checked) {
            categories[i].checked = false;
        }
    }

    let searchBars = document.querySelectorAll("input[type='text']");
    searchBars[0].value = "";
    searchBars[1].value = "";
    localStorage.setItem(itemKey, "");
    localStorage.setItem(locationKey, "");
}

function filterCategories() {// updates the list depending on which category was selected
    console.log("filterList() called");

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].checked) {
            currentCategory = categories[i].value;
            category = categories[i].value;
            table = document.querySelector("table");
            tr = table.querySelectorAll("tr");
            for (i = 0; i < tr.length; i++) {
                td = tr[i].querySelectorAll("td")[2];
                if (td) {
                    itemCategory = td.innerText;
                    if (itemCategory.toUpperCase().indexOf(category.toUpperCase()) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }

                }
            }
        }
    }
    let searchBars = document.querySelectorAll("input[type='text']");
    itemSearch();
    locationSearch()
}

function makeList() {// starts a sequence of calls to access the API and make a list of everything in it
    console.log("makeList() called");

    const URL = "https://botw-compendium.herokuapp.com/api/v2";
    let url = URL;

    getData(url);
}

function getData(url) {// gets the data from the API to use later
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {// organizes the data from the API into table rows seperately
    let xhr = e.target;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    let results = obj.data.creatures.food;
    console.log("results.length = " + results.length);

    let bigLine = ``;

    bigLine += makeRow(results);

    results = obj.data.creatures.non_food;
    bigLine += makeRow(results);

    results = obj.data.equipment;
    bigLine += makeRow(results);

    results = obj.data.materials;
    bigLine += makeRow(results);

    results = obj.data.monsters;
    bigLine += makeRow(results);

    results = obj.data.treasure;
    bigLine += makeRow(results);
    document.querySelector("#myTable").innerHTML += bigLine;
    itemSearch();
    locationSearch()
}

function makeRow(results) {// makes the line of code to inject into the html
    let line;
    let bigLine = ``;
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        let image = result.image;
        let name = result.name;
        let category = result.category;
        let locations = result.common_locations;
        let drops = result.drops;
        if (drops == undefined || drops == null) {
            drops = "None";
        }
        if (locations == undefined || locations == null)
        {
            locations = "Unknown";
        }

        line = `<tr><td><h3>${name}</h3></td>`;
        line += `<td><img this.width='110'" src="${image}" width=70px height=70px></td>`;
        line += `<td>${category}</td>`;
        line += `<td>${locations}</td>`;
        line += `<td>${drops}</td></tr>`;
        bigLine += line;
    }
    return bigLine;
}

function dataError(e) {// just to prove that something isn't working if something isn't working
    console.log("An error occurred");
}