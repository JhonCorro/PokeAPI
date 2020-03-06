function showLoadingIcon() {
    document.getElementById("loading-icon-front").classList.add("show");
    document.getElementById("loading-icon-back").classList.add("show");
}

function hideLoadingIcon() {
    document.getElementById("loading-icon-front").classList.remove("show");
    document.getElementById("loading-icon-back").classList.remove("show");
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCard(data) {
    /* <li class="card">
        <a href="../HTML/pokemon.html?pokemon=<pokemon-name-here>" target="_blank">
            <img class="card-image" id=<pokedex-number-here> src=<image-src-here>
            <h2 class="card-title"><#pokedex-number-here></h2>
            <p class="card-subtitle"><pokemon-name-here></p>
        </a>
       </li>
    */
    var card = document.createElement("li");
    card.setAttribute("class", "card");
    var imageLink = document.createElement("a");
    imageLink.setAttribute("href", "../HTML/pokemon.html?pokemon=" + data.name);
    imageLink.setAttribute("target", "_blank");
    var img = document.createElement("img");
    img.setAttribute("class", "card-image");
    img.setAttribute("id", data.id)
    img.setAttribute("src", data.image);
    imageLink.appendChild(img);
    card.appendChild(imageLink);
    var pokedexNumber = document.createElement("h2");
    pokedexNumber.setAttribute("class", "card-title")
    pokedexNumber.textContent = "#" + data.id.toString().padStart(3, "0");
    card.appendChild(pokedexNumber);
    var pokemonName = document.createElement("p");
    pokemonName.setAttribute("class", "card-subtitle")
    pokemonName.textContent = capitalizeFirstLetter(data.name);
    card.appendChild(pokemonName);
    return card;
}

// Fetches first 151 pokemon data from the PokeAPI
// Recieves a callback function to later display the pokemon on cards.
function getAllInfoFromAPI(...eventFunctions) {
    const promises = []
    for (let i = 1; i <= 151; i++) {
        // Completes url with the the first 151 pokemon.
        var apiURL = "https://pokeapi.co/api/v2/pokemon/" + i.toString();
        // Creates request object
        const request = new Request(apiURL, { method: "GET", headers: { "Content-Type": "application/json" } });
        promises.push(fetch(request)
            .then(response => {
                // If response status is OK.
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    throw new Error("Something is wrong!");
                }
            }));
    }
    Promise.all(promises)
        .then(response => {
            const pokemon = response.map(result => ({
                name: result.name,
                id: result.id,
                image: result.sprites["front_shiny"]
            }));
            var mainContainer = document.getElementById("pokemon-list");
            pokemon.forEach(element => mainContainer.appendChild(eventFunctions[0](element)))
            eventFunctions[1]();
        })
        .catch(error => console.log(error));
}

function windowLoad() {
    showLoadingIcon();
    getAllInfoFromAPI(createCard, hideLoadingIcon);
}

window.addEventListener("load", windowLoad);