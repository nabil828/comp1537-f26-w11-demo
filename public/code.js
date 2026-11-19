async function updateTheListOfFavoritePokemons() {
  const response = await fetch("/api/favorites");
  const response_JSON = await response.json();

  favoriteList.innerHTML = ""
  for (pokemon of response_JSON) {
    const liElement = document.createElement("li")
    liElement.innerHTML = pokemon
    favoriteList.appendChild(liElement)
  }


}


async function addToFavorites(pokemonToAdd) {
  const response = await fetch("/api/favorite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "pokemon": `${pokemonToAdd}`,
    }),
  });
  const response_JSON = await response.json();

  console.log(response_JSON);

  updateTheListOfFavoritePokemons()
}

async function login() {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    }),
  });
  const response_JSON = await response.json();

  console.log(response_JSON);

  if (response.status === 200) {
    pokeApp.style.display = "block";
    errorPara.style.display = "none";
  } else {
    errorPara.innerHTML = response_JSON.error;
  }

  // ?
}

async function fetchPokemons() {
  const response = await fetch("/pokemons");
  const response_JSON = await response.json();

  if (response.status !== 200) {
    console.log("Oops");
    pokeApp.innerHTML = "Oops";
  } else {
    console.log(response_JSON);

    for (let i = 0; i < response_JSON.length; i++) {
      // console.log(response_JSON[i].name);
      const liElement = document.createElement("li");
      liElement.innerHTML = `
              ${response_JSON[i].name}
              <button onclick="addToFavorites('${response_JSON[i].name}')">
                  Add to Favorites List
              </button>
            `;
      pokeUlList.appendChild(liElement);
    }
  }
}

fetchPokemons();