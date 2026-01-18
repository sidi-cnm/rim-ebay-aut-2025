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
      <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-200 mb-3 overflow-hidden">
        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Je cherche..."}
          className={`w-full py-3 px-4 text-gray-700 outline-none h-12 ${isRTL ? "pl-14 text-right" : "pr-14 text-left"}`}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className={`flex items-center justify-center bg-blue-600 text-white w-12 h-12 absolute top-0 ${isRTL ? "left-0" : "right-0"}`}
        >
          <FontAwesomeIcon icon={faSearch} className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
