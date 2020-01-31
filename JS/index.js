function getText(element) {
    return element.value;
}

function changeTableElements(data){
    document.getElementById("pokemonPic").src = data["sprites"]["front_shiny"];
    document.getElementById("pokedexNumber").textContent = data["id"].toString().padStart(3, '0');
    document.getElementById("pokemonName").textContent = capitalizeFirstLetter(data["name"]);
}

function getInfoFromAPI (pokemon, eventFunction){
    var apiURL = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
    const request = new Request(apiURL, {method: "GET", headers: {"Content-Type": "application/json"}});
    fetch(request)
        .then(response => {
            if(response.status === 200){
                return response.json();
            }
            else{
                throw new Error("Something is wrong!");
            }
        })
        .then(response => {
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
