import { changePokemonName } from './changepokename.js';

const team = [];
const reserves = [];
let allPokemonData = [];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('start-page').addEventListener('click', function (e) {
        e.preventDefault();
        showSearchView();
    });

    document.getElementById('team-lineup').addEventListener('click', function (e) {
        e.preventDefault();
        showTeamView();
    });

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

            const nicknameInput = document.createElement('input');
            nicknameInput.type = 'text';
            nicknameInput.placeholder = 'Enter nickname';
            nicknameInput.className = 'nickname-input';
            nicknameInput.id = `nickname-${pokemon.name}`;

            const addButton = document.createElement('span');
            addButton.textContent = ' + ';
            addButton.className = 'add-button';
            addButton.addEventListener('click', function (e) {
                e.stopPropagation();
                const nickname = nicknameInput.value.trim();
                addToTeam({ ...pokemon, imageUrl, nickname: nickname || pokemon.name });
            });

            li.appendChild(nicknameInput);
            li.appendChild(addButton);
            ul.appendChild(li);
        }
    }

    function showSearchView() {
        document.getElementById('search-container').style.display = 'block';
        document.getElementById('team-container').style.display = 'none';
    }

    function showTeamView() {
        document.getElementById('search-container').style.display = 'none';
        document.getElementById('team-container').style.display = 'block';
        renderTeam();
    }

    async function addToTeam(pokemon) {
        if (team.length < 3) {
            team.push(pokemon);
        } else if (!reserves.some(r => r.name === pokemon.name)) {
            reserves.push(pokemon);
        }
        renderTeam();
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

            const changeNameButton = document.createElement('span');
            changeNameButton.textContent = ' ✏️ ';
            changeNameButton.className = 'change-name-button';
            changeNameButton.addEventListener('click', () => {
                changePokemonName(pokemon, (updatedPokemon) => {
                    renderTeam();
                });
            });

            const removeButton = document.createElement('span');
            removeButton.textContent = ' − ';
            removeButton.className = 'remove-button';
            removeButton.addEventListener('click', function (e) {
                e.stopPropagation();
                removeFromTeam(pokemon);
            });

            li.appendChild(changeNameButton);
            li.appendChild(removeButton);
            teamContainer.appendChild(li);
        });

        // Rendera reserver
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
        const filter = this.value.toLowerCase();
        const filteredList = allPokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(filter));
        renderPokemonList(filteredList);
    });

    // Initial setup
    fetchPokemonData();
});
