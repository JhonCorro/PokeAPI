function getText(element) {
    return element.value;
}

// Changes DOM's elements with data fetched from API.
function changeTableElements(data){
    document.getElementById("pokemonPic").src = data["sprites"]["front_shiny"];
    // If number has less than 3 digits will fill with zeroes to the left
    document.getElementById("pokedexNumber").textContent = data["id"].toString().padStart(3, '0');
    document.getElementById("pokemonName").textContent = capitalizeFirstLetter(data["name"]);
}

// Fetches data from the PokeAPI
// Recieves the pokemon name (or pokedex number) to search and
// a callback function to later change DOM elements.
function getInfoFromAPI (pokemon, eventFunction){
    // Completes url with the pokemon name or pokedex number.
    var apiURL = "https://pokeapi.co/api/v2/pokemon/" + pokemon.toLowerCase();
    // Creates request object
    const request = new Request(apiURL, {method: "GET", headers: {"Content-Type": "application/json"}});
    fetch(request)
        .then(response => {
            // If response status is OK.
            if(response.status === 200){
                return response.json();
            }
            else{
                throw new Error("Something is wrong!");
            }
        })
        .then(response => {
            // When data is actually ready to use.
            eventFunction(response)
        }).catch(error => {
            console.log(error)
        });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function buttonClick() {
    var text = getText(document.getElementById("searchBox"));
    getInfoFromAPI(text, changeTableElements);
}


var button = document.getElementById("searchButton");
button.addEventListener("click", buttonClick.bind(button))
