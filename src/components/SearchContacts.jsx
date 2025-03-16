import React, { useState } from "react";
import apiClient from "../api/apiClient";

const SearchContacts = ({ onAddContact }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/api/contacts/search", { searchTerm });
      const contacts = response.data.contacts || [];

      // Validate that each contact has firstName and lastName
      const validatedContacts = contacts.filter(
        (contact) => contact.firstName && contact.lastName
      );

      setSearchResults(validatedContacts);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-contacts">
      <h2>Search Contacts</h2>
      <div className="search-input">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="scrollable-list">
        <ul className="search-results">
          {searchResults.map((contact) => (
            <li
              key={contact.id || `${contact.firstName}-${contact.lastName}-${contact.email}`}
              onClick={() => onAddContact(contact)}
            >
              {contact.firstName} {contact.lastName} ({contact.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchContacts;