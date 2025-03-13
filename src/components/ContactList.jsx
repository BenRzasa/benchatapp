import React from "react";

const ContactList = ({ contacts }) => {
  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <div key={contact.id} className="contact">
          <p>{contact.email}</p>
        </div>
      ))}
    </div>
  );
};

export default ContactList;