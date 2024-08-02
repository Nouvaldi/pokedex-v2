"use client";

import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonCard from "@/components/PokemonCard";
import PokemonDetails from "@/components/PokemonDetails";
import SearchBar from "@/components/SearchBar";
import { fetchAllPokemon } from "./actions";
import { PuffLoader } from "react-spinners";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollUpButton } from "@/components/ScrollUpButton";

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const ITEMS_PER_PAGE = 30;

export default function Pokedex() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const loadAllPokemon = async () => {
      setLoading(true);
      const pokemonData = await fetchAllPokemon();
      setAllPokemon(pokemonData);
      setDisplayedPokemon(pokemonData.slice(0, ITEMS_PER_PAGE));
      await delay(1000);
      setLoading(false);
    };
    loadAllPokemon();
  }, []);

  useEffect(() => {
    const filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedPokemon(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [searchTerm, allPokemon]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const loadMore = () => {
    const filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const newDisplayed = filtered.slice(
      0,
      displayedPokemon.length + ITEMS_PER_PAGE
    );
    setDisplayedPokemon(newDisplayed);
    setHasMore(newDisplayed.length < filtered.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PuffLoader loading={loading} size={200} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-col h-screen"
    >
      <ScrollUpButton />
      <div className="flex fixed top-0 w-full justify-center p-5 z-40 bg-red-500 shadow-md">
        <SearchBar onSearch={handleSearch} />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-1 mt-20 justify-center"
      >
        <div className="w-full xl:w-2/5">
          <InfiniteScroll
            dataLength={displayedPokemon.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5 px-28 xl:px-5">
              {displayedPokemon.map((pokemon) => (
                <div key={pokemon.id}>
                  {/* For small and medium screens */}
                  <div className="xl:hidden">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div>
                          <PokemonCard
                            pokemon={pokemon}
                            onClick={() => setSelectedPokemon(pokemon.id)}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="">
                        <DialogHeader className="hidden">
                          <DialogTitle className="hidden">
                            {pokemon.name}
                          </DialogTitle>
                          <DialogDescription className="hidden">
                            {pokemon.id}
                          </DialogDescription>
                        </DialogHeader>
                        <PokemonDetails pokemonId={pokemon.id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  {/* For large screens */}
                  <div className="hidden xl:block">
                    <PokemonCard
                      pokemon={pokemon}
                      onClick={() => setSelectedPokemon(pokemon.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
        <div className="hidden xl:block w-1/4 p-5">
          <div className="fixed w-1/4">
            {selectedPokemon ? (
              <PokemonDetails pokemonId={selectedPokemon} />
            ) : (
              <Card className="h-full xl:h-screen p-5">
                <CardHeader className="hidden">
                  <CardTitle className="hidden">Pokemon</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full p-0 justify-center items-center text-center">
                  <div>
                    Select a Pokemon
                    <br />
                    to view the details
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
