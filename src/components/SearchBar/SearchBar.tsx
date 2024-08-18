import React, { useState } from "react";
import "./SearchBar.scss";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form className='search-bar' onSubmit={handleSearch}>
      <input
        type='text'
        className='search-bar__input'
        placeholder='Search articles...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type='button'
          className='search-bar__clear'
          onClick={handleClear}
        >
          &times;
        </button>
      )}
      <button type='submit' className='search-bar__button'>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
