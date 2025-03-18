import React from "react";

const ContactList = ({ contacts, onContactClick }) => {
  // Limit the displayed contacts to 10 entries
  const displayedContacts = contacts.slice(0, 10);

  return (
    <div className="contact-list">
      <h2>Contacts</h2>
      <div className="scrollable-list">
        <ul>
          {displayedContacts.map((contact) => (
            <li
              key={contact.id || `${contact.firstName}-${contact.lastName}-${contact.email}`}
              onClick={() => onContactClick(contact)}
            >
              {contact.firstName} {contact.lastName} ({contact.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactList;