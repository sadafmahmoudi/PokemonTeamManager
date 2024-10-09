const team = [];
const reserves = [];
let allPokemonData = [];

document.addEventListener('DOMContentLoaded', function () {
    window.showSearchView = function () {
        document.getElementById('search-container').style.display = 'block';
        document.getElementById('team-container').style.display = 'none';
    };

    window.showTeamView = function () {
        document.getElementById('search-container').style.display = 'none';
        document.getElementById('team-container').style.display = 'block';
        renderTeam(); 
    };

    async function fetchPokemonData() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=100');
            const data = await response.json();
            allPokemonData = data.results; 
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
        ul.innerHTML = ''; 

        for (const pokemon of pokemonList) {
            const imageUrl = await fetchPokemonImage(pokemon.url);
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = pokemon.name;

            const li = document.createElement('li');
            li.appendChild(img);
            li.appendChild(document.createTextNode(pokemon.name));

            // Smeknamnsinput
            const nicknameInput = document.createElement('input');
            nicknameInput.type = 'text';
            nicknameInput.placeholder = 'Enter nickname';
            nicknameInput.className = 'nickname-input';
            nicknameInput.id = `nickname-${pokemon.name}`; // Unikt id
            nicknameInput.name = `nickname-${pokemon.name}`; // Unikt namn

            // Apply-knapp för att spara smeknamn
            const applyButton = document.createElement('span');
            applyButton.textContent = 'Apply';
            applyButton.className = 'apply-button';
            applyButton.addEventListener('click', function (e) {
                e.stopPropagation();
                const nickname = nicknameInput.value.trim();
                if (nickname) {
                    // Spara smeknamn
                    nicknameInput.value = nickname; // Visar smeknamnet i inputfältet
                }
            });

            // Plus-ikon för att lägga till Pokémon
            const addButton = document.createElement('span');
            addButton.textContent = ' + ';
            addButton.className = 'add-button';
            addButton.addEventListener('click', function (e) {
                e.stopPropagation();
                const nickname = nicknameInput.value.trim();
                addToTeam({ ...pokemon, imageUrl, nickname: nickname || pokemon.name });
            });

            li.appendChild(nicknameInput);
            li.appendChild(applyButton);
            li.appendChild(addButton);
            ul.appendChild(li);
        }
    }

    function renderFilteredPokemonList(filter) {
        const filteredList = allPokemonData.filter(pokemon => 
            pokemon.name.toLowerCase().includes(filter.toLowerCase())
        );

        
        const sortedList = filteredList.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName.startsWith(filter.toLowerCase())) return -1;
            if (bName.startsWith(filter.toLowerCase())) return 1;
            return 0;
        });

        
        if (filter === '') {
            renderPokemonList(allPokemonData);
        } else {
            renderPokemonList(sortedList);
        }
    }

    async function addToTeam(pokemon) {
        if (team.length < 3) {
            team.push(pokemon);
        } else if (!reserves.some(r => r.name === pokemon.name)) {
            reserves.push(pokemon);
        }
        renderTeam();
    }

    function removeFromTeam(pokemon) {
        const index = team.findIndex(t => t.name === pokemon.name);
        if (index > -1) {
            team.splice(index, 1);
            renderTeam();
        }
    }

    function removeFromReserves(pokemon) {
        const index = reserves.findIndex(r => r.name === pokemon.name);
        if (index > -1) {
            reserves.splice(index, 1);
            renderTeam();
        }
    }

    function renderTeam() {
        const teamContainer = document.querySelector('.team-list');
        teamContainer.innerHTML = ''; 

        team.forEach(pokemon => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = pokemon.imageUrl;
            img.alt = pokemon.name;

            li.appendChild(img);
            li.appendChild(document.createTextNode(pokemon.nickname)); 

            const removeButton = document.createElement('span');
            removeButton.textContent = ' − ';
            removeButton.className = 'remove-button';
            removeButton.addEventListener('click', function (e) {
                e.stopPropagation();
                removeFromTeam(pokemon);
            });

            li.appendChild(removeButton);
            teamContainer.appendChild(li);
        });

        
        const reserveContainer = document.querySelector('.reserve-list');
        reserveContainer.innerHTML = ''; 

        reserves.forEach(pokemon => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = pokemon.imageUrl;
            img.alt = pokemon.name;

            li.appendChild(img);
            li.appendChild(document.createTextNode(pokemon.nickname)); 

            const removeButton = document.createElement('span');
            removeButton.textContent = ' − ';
            removeButton.className = 'remove-button';
            removeButton.addEventListener('click', function (e) {
                e.stopPropagation();
                removeFromReserves(pokemon);
            });

            li.appendChild(removeButton);
            reserveContainer.appendChild(li);
        });
    }

    document.getElementById('search').addEventListener('input', function () {
        renderFilteredPokemonList(this.value);
    });

    // Initial setup - Fetch Pokémon data and render list
    fetchPokemonData();
});

async function fetchPokemonImage(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.sprites && data.sprites.front_default) {
            return data.sprites.front_default;
        } else {
            console.warn(`No image found for URL: ${url}`);
            return 'path/to/default/image.png'; // Lägga till en default bild om ingen finns
        }
    } catch (error) {
        console.error('Error fetching Pokémon image:', error);
        return 'path/to/default/image.png'; // Lägga till en default bild om fetch misslyckas
    }
}
