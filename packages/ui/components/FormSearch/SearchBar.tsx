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
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="relative group w-full">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-15 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative flex items-center bg-white shadow-2xl rounded-2xl p-2 ring-1 ring-gray-900/5">
           
           {/* Search Icon (Left) */}
           {/* <div className={`flex items-center justify-center w-12 h-12 text-gray-400 ${isRTL ? "order-last ml-2 mr-1" : "order-first ml-2 mr-2"}`}>
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5 md:w-6 md:h-6" />
           </div> */}

           {/* Input Field */}
           <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Je cherche..."}
            className={`w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base md:text-lg h-12 md:h-14 ${isRTL ? "text-right" : "text-left"}`}
          />

          {/* Search Button (Right) */}
          <button
            onClick={handleSearch}
            className={`
              flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white 
              rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95
              ${isRTL ? "mr-auto order-first" : "ml-auto order-last"}
              flex items-center justify-center
              w-12 h-12 md:w-auto md:h-12 md:px-8
            `}
          >
            {/* <span className="hidden md:block font-semibold">Search</span> */}
            <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
