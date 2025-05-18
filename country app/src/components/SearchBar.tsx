import React from "react";

type Props = {
  onSearch: (value: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search by country name..."
      className="w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBar;
