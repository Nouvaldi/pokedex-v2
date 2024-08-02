"use client";

import React, { useState, useEffect, useCallback } from "react";
import { fetchPokemonDetails } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { PuffLoader } from "react-spinners";
import { motion } from "framer-motion";

interface Props {
  pokemonId: number;
}

interface CacheItem {
  data: any;
  timestamp: number;
}

// const sessionStorage = sessionsessionStorage;
// local sessionStorage is better choice
// but can switch to session sessionStorage

const cacheData = (id: number, data: any) => {
  const cacheItem: CacheItem = {
    data,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(`pokemon-${id}`, JSON.stringify(cacheItem));
};

const updateCacheTimestamp = (id: number) => {
  const cachedItem = sessionStorage.getItem(`pokemon-${id}`);
  if (cachedItem) {
    const { data } = JSON.parse(cachedItem) as CacheItem;
    cacheData(id, data);
  }
};

const PokemonDetails: React.FC<Props> = ({ pokemonId }) => {
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const variants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const cleanupCache = useCallback(() => {
    const maxCacheSize = 10;
    const keys = Object.keys(sessionStorage);
    const pokemonKeys = keys.filter((key) => key.startsWith("pokemon-"));

    if (pokemonKeys.length > maxCacheSize) {
      const cacheItems = pokemonKeys.map((key) => {
        const item = JSON.parse(
          sessionStorage.getItem(key) || "{}"
        ) as CacheItem;
        return { key, timestamp: item.timestamp };
      });

      // Sort by timestamp, oldest first
      cacheItems.sort((a, b) => a.timestamp - b.timestamp);

      // Remove oldest entries until we're at max cache size
      while (cacheItems.length > maxCacheSize) {
        const oldestItem = cacheItems.shift();
        if (oldestItem) {
          sessionStorage.removeItem(oldestItem.key);
        }
      }
    }
  }, []);

  useEffect(() => {
    const loadPokemonDetails = async () => {
      setLoading(true);
      await delay(1000);
      const cachedItem = sessionStorage.getItem(`pokemon-${pokemonId}`);
      if (cachedItem) {
        const { data, timestamp } = JSON.parse(cachedItem) as CacheItem;
        setPokemon(data);
        // Update the timestamp to mark it as recently accessed
        updateCacheTimestamp(pokemonId);
      } else {
        const pokemonData = await fetchPokemonDetails(pokemonId);
        setPokemon(pokemonData);
        cacheData(pokemonId, pokemonData);
      }
      cleanupCache();
      await delay(1000);
      setLoading(false);
    };
    loadPokemonDetails();
  }, [pokemonId, cleanupCache]);

  // if (!pokemon) {
  //   return (
  //     <Card className="hidden h-full p-10">
  //       <CardHeader className="hidden">
  //         <CardTitle className="hidden">Pokemon</CardTitle>
  //       </CardHeader>
  //       <CardContent className="flex h-full p-10 justify-center items-center">
  //         <PuffLoader loading={loading} />
  //       </CardContent>
  //     </Card>
  //   );
  // }

  if (!pokemon || loading) {
    return (
      <Card className="h-full xl:h-screen p-10">
        <CardHeader className="hidden">
          <CardTitle className="hidden">Pokemon</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full p-10 justify-center items-center">
          <PuffLoader loading={loading} />
        </CardContent>
      </Card>
    );
  }

  const formattedEntry = pokemon.entry
    ? pokemon.entry.replace(/\f/g, " ").trim()
    : "No Pokedex entry available.";

  const formatPokemonId = (number: number): string => {
    return `${String(number).padStart(3, "0")}`;
  };

  const shownAbilities = pokemon.abilities.filter(
    (ability: any) => !ability.is_hidden
  );

  const getStatColor = (baseStat: number): string => {
    if (baseStat <= 49) {
      return "bg-orange-400";
    } else if (baseStat <= 89) {
      return "bg-yellow-300";
    } else if (baseStat <= 119) {
      return "bg-lime-300";
    } else if (baseStat <= 149) {
      return "bg-green-400";
    } else {
      return "bg-blue-400";
    }
  };

  const typeColor: { [key: string]: string } = {
    normal: "bg-[#aa9]",
    steel: "bg-[#aab]",
    fire: "bg-[#f42]",
    grass: "bg-[#7c5]",
    water: "bg-[#39f]",
    electric: "bg-[#fc3]",
    ice: "bg-[#6cf]",
    flying: "bg-[#89f]",
    fighting: "bg-[#b54]",
    poison: "bg-[#a59]",
    ground: "bg-[#db5]",
    psychic: "bg-[#f59]",
    bug: "bg-[#ab2]",
    rock: "bg-[#ba6]",
    ghost: "bg-[#66b]",
    dragon: "bg-[#76e]",
    dark: "bg-[#754]",
    fairy: "bg-[#e9e]",
  };

  const statAbbr: { [key: string]: string } = {
    hp: "hp",
    attack: "attack",
    defense: "defense",
    "special-attack": "s.atk",
    "special-defense": "s.def",
    speed: "speed",
  };

  return (
    <motion.div
      // initial={{ opacity: 0, y: 400 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 1.2 }}
      // initial="hidden"
      // animate={loading ? "hidden" : "visible"}
      // variants={variants}
      // transition={{ duration: 0.8, ease: "easeInOut" }}
      className=""
    >
      <Card className="h-full xl:h-screen select-none">
        <CardHeader className="hidden">
          <CardTitle className="hidden">{pokemon.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center p-5 text-xs gap-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-0"
          >
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width={150}
              height={150}
              className="drop-shadow-lg"
            />
            <div className="font-bold text-gray-300">
              N&deg;{formatPokemonId(pokemon.id)}
            </div>
            <div className="font-bold text-xl capitalize">{pokemon.name}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center gap-2"
          >
            {pokemon.types.map((type: any) => (
              <div
                key={type.type.name}
                className={`flex-1 rounded-lg text-sm text-center text-white capitalize ${
                  typeColor[type.type.name]
                }`}
              >
                {type.type.name}
              </div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-400"
          >
            &quot;{formattedEntry}&quot;
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex text-center gap-2"
          >
            <div className="flex flex-col flex-1">
              <h3 className="font-bold">Height</h3>
              <div className="bg-gray-100 rounded-lg p-1">
                {pokemon.height / 10} m
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="font-bold">Weight</h3>
              <div className="bg-gray-100 rounded-lg p-1">
                {pokemon.weight / 10} kg
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col text-center"
          >
            <h3 className="font-semibold">Abilities</h3>
            <div className="flex gap-2">
              {shownAbilities.map((ability: any) => (
                <div
                  key={ability.ability.name}
                  className="flex-1 capitalize bg-gray-100 rounded-lg p-1"
                >
                  {ability.ability.name}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className=""
          >
            <h3 className="font-semibold text-center">Stats</h3>
            {pokemon.stats.map((stat: any) => (
              <div
                key={stat.stat.name}
                className="flex items-center justify-between w-full"
              >
                <div className="capitalize mr-auto">
                  {statAbbr[stat.stat.name]}
                </div>
                <div className="pr-2 text-gray-400">{stat.base_stat}</div>
                <div className="flex items-center w-3/5">
                  <Progress
                    value={stat.base_stat}
                    max={255}
                    className="h-2"
                    color={getStatColor(stat.base_stat)}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PokemonDetails;
