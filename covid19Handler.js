/**
 *  @author SOSELab@NTOU <albert@ntou.edu.tw>
 */
let dataSourceUrl = "https://corona.lmao.ninja/countries?sort=country";
let countryListUrl = "countries.json";
let countryMap = new Map();
let fieldNames = ["flag", "country", "cases", "deaths", "active", "todayCases", "todayDeaths"];
let sortType = ["asc", "asc", "asc", "asc", "asc", "asc", "asc"];
let covid19Data;

$(function() {
    buildCountryMap();
    $("#taiwan").hide();
    $.getJSON(dataSourceUrl, function(data) {
        data.reverse();
        covid19Data = data;
        showTable();
    });
    setFilterDataBtn();
});

function buildCountryMap() {
    $.getJSON(countryListUrl, function(data) {
        for (idx in data) {
            countryMap.set(data[idx].country, data[idx].chineseCountryName);
        }
    });
}

function showTable() {
    let googleUrlPrefix = "https://www.google.com/search?q=";
    $("#myTable").empty();
    let idx, date;
    if (covid19Data) {
        for (idx in covid19Data) {
            let countryName = covid19Data[idx].country;
            let content =
                "<tr id='tr-" + countryName + "' >" +
                "<td><a target='_blank' href='" + googleUrlPrefix + countryName + "+country'><img width='40px' src='" + covid19Data[idx].countryInfo.flag + "' /></a></td>" +
                "<td>" + countryName + (countryMap.get(countryName) ? "<br>(" + countryMap.get(countryName) + ")" : "<br>(" + countryName + ")") + "</td>" +
                "<td class='number'>" + covid19Data[idx].cases.toLocaleString() + "</td>" +
                "<td class='number'>" + covid19Data[idx].deaths.toLocaleString() + "</td>" +
                "<td class='number'>" + covid19Data[idx].active.toLocaleString() + "</td>" +
                "<td class='number optional'>" + covid19Data[idx].todayCases.toLocaleString() + "</td>" +
                "<td class='number optional'>" + covid19Data[idx].todayDeaths.toLocaleString() + "</td>" +
                "</tr>";
            $("#myTable").append(content);
        }

        let updated = "Updated: " + new Date(covid19Data[idx].updated);
        console.log(updated);
        $("#update").html(updated);
        $("#loading").hide();
        $("#taiwan").show();
    }
}

function sortData(fieldNumber) {

    covid19Data.sort(function(a, b) {
        if (sortType[fieldNumber] == "asc") {
            if (a[fieldNames[fieldNumber]] > b[fieldNames[fieldNumber]]) return -1;
            else return 1;
        } else if (sortType[fieldNumber] == "desc") {
            if (a[fieldNames[fieldNumber]] <
                b[fieldNames[fieldNumber]])
                return -1;
            else return 1;
        }
    });
    clearHighlight();
    $("#field-" + fieldNumber).css("color", "navy");
    if (sortType[fieldNumber] == "asc") {
        $("#sort-style-" + fieldNumber).html("▼"); //replace ⬇
        sortType[fieldNumber] = "desc";
    } else if (sortType[fieldNumber] == "desc") {
        $("#sort-style-" + fieldNumber).html("▲"); //replace ⬆
        sortType[fieldNumber] = "asc";
    }
    showTable(covid19Data);
}

function clearHighlight() {
    for (let i = 1; i <= 6; i++) {
        $("#field-" + i).css("color", "black");
        $("#sort-style-" + i).html("&nbsp;");
    }
}

function setFilterDataBtn() {
    $("#search").on("click", function() {
        search();
    });
    $("#myInput").on("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard 
        if (event.keyCode === 13) {
            // Cancel the default action, if needed 
            event.preventDefault();
            search();
        }
    });
}

function search(countryName) {
    //Filter data based on the user input 
    let value = (countryName ? countryName.toLowerCase() : $("#myInput").val().toLowerCase());
    $("#myTable tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
}