const team = [];
let allPokemonData = [];

document.addEventListener('DOMContentLoaded', function () {
    window.showSearchView = function () {
        document.getElementById('search-container').style.display = 'block';
        document.getElementById('team-container').style.display = 'none';
    };

    window.showTeamView = function () {
        document.getElementById('search-container').style.display = 'none';
        document.getElementById('team-container').style.display = 'block';
        renderTeam(); // Rendera teamet när vyn visas
    };

    async function fetchPokemonData() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=100');
            const data = await response.json();
            allPokemonData = data.results; // Spara all Pokémon data för att kunna söka
            renderPokemonList(allPokemonData);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    async function fetchPokemonImage(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.sprites.front_default;
        } catch (error) {
            console.error('Error fetching Pokémon image:', error);
        }
    }

    async function renderPokemonList(pokemonList) {
        const ul = document.querySelector('.pokemon-list');
        ul.innerHTML = ''; // Rensa listan innan rendering

        for (const pokemon of pokemonList) {
            const imageUrl = await fetchPokemonImage(pokemon.url);
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = pokemon.name;

            const li = document.createElement('li');
            li.appendChild(img);
            li.appendChild(document.createTextNode(pokemon.name));

            // Plus-ikon för att lägga till Pokémon
            const addButton = document.createElement('span');
            addButton.textContent = ' + ';
            addButton.style.cursor = 'pointer';
            addButton.style.marginLeft = '10px'; // Lägg till marginal
            addButton.addEventListener('click', function (e) {
                e.stopPropagation(); // Stoppa bubbla för att inte trigga li-klick
                addToTeam(pokemon);
            });

            li.appendChild(addButton);
            ul.appendChild(li);
        }
    }

    function renderFilteredPokemonList(filter) {
        const filteredList = allPokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(filter.toLowerCase()));
        renderPokemonList(filteredList);
    }

    async function addToTeam(pokemon) {
        if (!team.some(t => t.name === pokemon.name)) {
            const imageUrl = await fetchPokemonImage(pokemon.url); // Hämta bild här
            team.push({ ...pokemon, imageUrl }); // Spara också bild-URL
            console.log("Team:", team);
            renderTeam();
        }
    }

    function removeFromTeam(pokemon) {
        const index = team.findIndex(t => t.name === pokemon.name);
        if (index > -1) {
            team.splice(index, 1);
            console.log("Team after removal:", team);
            renderTeam();
        }
    }

    function renderTeam() {
        const teamContainer = document.querySelector('.team-list');
        teamContainer.innerHTML = ''; // Rensa team listan

        team.forEach(pokemon => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = pokemon.imageUrl; // Använd bild-URL
            img.alt = pokemon.name;
            img.style.width = '50px'; // Sätt en storlek för bilderna
            img.style.marginRight = '10px'; // Marginal mellan bild och namn

            li.appendChild(img);
            li.appendChild(document.createTextNode(pokemon.name));

            // Minus-ikon för att ta bort Pokémon
            const removeButton = document.createElement('span');
            removeButton.textContent = ' − ';
            removeButton.style.cursor = 'pointer';
            removeButton.style.marginLeft = '10px'; // Lägg till marginal
            removeButton.addEventListener('click', function (e) {
                e.stopPropagation(); // Stoppa bubbla för att inte trigga li-klick
                removeFromTeam(pokemon);
            });

            li.appendChild(removeButton);
            teamContainer.appendChild(li);
        });
    }

    document.getElementById('search').addEventListener('input', function () {
        renderFilteredPokemonList(this.value);
    });

    // Initial setup - Fetch Pokémon data and render list
    fetchPokemonData();
});