"use server";

import axios from "axios";

export async function fetchAllPokemon() {
  const response = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?limit=905&offset=0"
  );

  const getPokemonId = (url: string): string => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };

  const pokemonList = await Promise.all(
    response.data.results.map(async (pokemon: any) => {
      const pokemonId = getPokemonId(pokemon.url);
      return {
        id: pokemonId,
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
      };
    })
  );
  console.log(pokemonList);

  return pokemonList;
}

export async function fetchPokemonDetails(pokemonId: number) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  );
  const speciesResponse = await axios.get(response.data.species.url);
  return {
    ...response.data,
    entry: speciesResponse.data.flavor_text_entries.find(
      (entry: any) => entry.language.name === "en"
    )?.flavor_text,
  };
}
