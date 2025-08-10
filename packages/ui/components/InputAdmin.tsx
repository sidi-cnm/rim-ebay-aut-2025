import React from "react";
import { FaSearch } from "react-icons/fa";

export default function Input() {
  return (
    <div className="relative mx-28">
      <input
        className="h-10 w-96  outline-none pl-10 pr-3 rounded-lg shadow-md"
        name="name"
        placeholder="Search"
      />
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
    </div>
  );
}
