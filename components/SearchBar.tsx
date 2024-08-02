"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";

interface Props {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  return (
    <Input
      name="input"
      type="text"
      placeholder="Search Pokémon"
      onChange={(e) => onSearch(e.target.value)}
      className="max-w-lg"
    />
  );
};

export default SearchBar;
