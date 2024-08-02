import Image from "next/image";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

interface Props {
  pokemon: Pokemon;
  onClick: () => void;
}

const PokemonCard: React.FC<Props> = ({ pokemon, onClick }) => {
  const formatPokemonId = (number: number): string => {
    return `${String(number).padStart(3, "0")}`;
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.1 }}>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer relative"
        onClick={onClick}
      >
        <CardHeader className="hidden">
          <CardTitle className="hidden">
            N&deg;{formatPokemonId(pokemon.id)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex justify-center">
          <Image
            unoptimized={true}
            priority={true}
            src={pokemon.image}
            alt={pokemon.name}
            width={300}
            height={300}
            className="z-20 p-2"
          />
          <div className="absolute top-0 left-0 font-bold px-2 py-2 text-2xl text-gray-200">
            N&deg;{formatPokemonId(pokemon.id)}
          </div>
          <div className="absolute bottom-1 w-full text-center font-bold uppercase text-gray-300 text-xs">
            {pokemon.name}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PokemonCard;
