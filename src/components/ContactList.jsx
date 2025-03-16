// ContactList.jsx
import React from "react";

const ContactList = ({ contacts }) => {
  return (
    <div className="contact-list">
      <h2>Contacts</h2>
      <div className="scrollable-list">
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              {contact.firstName} {contact.lastName} ({contact.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactList;