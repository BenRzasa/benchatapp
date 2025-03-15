import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import apiClient from "../api/apiClient";

const ContactList = () => {
  const { user } = useContext(AuthContext); // Access user data
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await apiClient.get("/api/contacts/all-contacts");
        setContacts(response.data.contacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="contact-list">
      <h2>Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.firstName} {contact.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;