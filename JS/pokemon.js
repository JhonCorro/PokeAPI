function getText(element) {
    return element.value;
}

// Gets stat data from JSON result.
function getStatsData(data) {
    // Empty stats object to be returned.
    var stats = {};
    // Looking for the six stats: HP, ATTACK, SP. ATTACK, DEFENSE, SP. DEFENSE and SPEED
    for (var i = 0; i < 6; i++) {
        // Adds property (stat name) and value to stats object
        stats[data["stats"][i]["stat"]["name"]] = data["stats"][i]["base_stat"];
    }
    return stats;
}

// Creates DOM's elements to display stats.
function displayStats(data) {
    function createElements() {
        var rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row justify-content-md-center");
        var firstColDiv = document.createElement("div");
        firstColDiv.setAttribute("class", "col-3")
        var secondColDiv = firstColDiv.cloneNode(true);
        var nameSpan = document.createElement("span");
        nameSpan.setAttribute("name", "statName");
        var valueSpan = document.createElement("span");
        valueSpan.setAttribute("name", "statValue");
        rowDiv.appendChild(firstColDiv);
        firstColDiv.appendChild(nameSpan);
        rowDiv.appendChild(secondColDiv);
        secondColDiv.appendChild(valueSpan);

        var statsContainer = document.getElementById("statsContainer");
        statsContainer.appendChild(rowDiv);
    }

    var statsObj = getStatsData(data);
    for (var i = 0; i < Object.values(statsObj).length; i++) createElements();

    namesArray = document.getElementsByName("statName");
    valueArray = document.getElementsByName("statValue");

    namesArray.forEach((element, index) => element.textContent = capitalizeFirstLetter(Object.getOwnPropertyNames(statsObj).reverse()[index].replace("-", " ")));
    valueArray.forEach((element, index) => element.textContent = Object.values(statsObj).reverse()[index]);
}

// Changes DOM's elements with data fetched from API.
function changeTableElements(data) {
    document.getElementById("pokemonPic").src = data.sprites["front_shiny"];
    // If number has less than 3 digits will fill with zeroes to the left
    document.getElementById("pokedexNumber").textContent = data.id.toString().padStart(3, "0");
    document.getElementById("pokemonName").textContent = capitalizeFirstLetter(data.name);
}

// Fetches data from the PokeAPI
// Recieves the pokemon name (or pokedex number) to search and
// a callback function to later change DOM elements.
function getInfoFromAPI(pokemon, ...eventFunctions) {
    // Completes url with the pokemon name or pokedex number.
    var apiURL = "https://pokeapi.co/api/v2/pokemon/" + pokemon.toLowerCase();
    // Creates request object
    const request = new Request(apiURL, { method: "GET", headers: { "Content-Type": "application/json" } });
    fetch(request)
        .then(response => {
            // If response status is OK.
            if (response.status === 200) {
                return response.json();
            }
            else {
                throw new Error("Something is wrong!");
            }
        })
        .then(response => {
            // When data is actually ready to use.
            eventFunctions[0](response);
            eventFunctions[1](response);
        }).catch(error => {
            console.log(error)
        });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function buttonClick() {
    var text = getText(document.getElementById("searchBox"));
    getInfoFromAPI(text, changeTableElements, displayStats);
}

var button = document.getElementById("button-addon2");
button.addEventListener("click", buttonClick.bind(button))
