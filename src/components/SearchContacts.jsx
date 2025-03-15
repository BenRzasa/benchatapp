import React, { useState } from "react";
import apiClient from "../api/apiClient";

const SearchContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await apiClient.post("/api/contacts/search", { searchTerm });
        setSearchResults(response.data.contacts);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }
  };

  return (
    <div className="search-contacts">
      <h2>Search Contacts</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((contact) => (
          <li key={contact.id}>
            {contact.firstName} {contact.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchContacts;