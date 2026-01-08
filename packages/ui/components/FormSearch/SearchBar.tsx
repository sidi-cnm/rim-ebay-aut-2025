"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  placeholder?: string;
  isRTL?: boolean;
}

export default function SearchBar({ placeholder, isRTL = false }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("aiQuery") || "");

  const handleSearch = () => {
    // Start fresh with just the AI query, ignoring other existing filters
    // as per user request ("used alone")
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("aiQuery", query.trim());
    }
    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-4 md:mx-auto mb-6">
      <div className="relative flex items-center bg-white shadow-md rounded-xl ring-1 ring-gray-200 p-1.5">
        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Je cherche..."}
          className={`flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base px-3 py-2.5 ${isRTL ? "text-right" : "text-left"}`}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className={`
            flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white 
            rounded-lg transition-colors
            ${isRTL ? "order-first mr-1.5" : "order-last ml-1.5"}
            flex items-center justify-center
            w-12 h-12
          `}
        >
          <FontAwesomeIcon icon={faSearch} className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
