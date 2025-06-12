import React, { useEffect, useState } from 'react';
import { Mail, MessageCircle } from 'lucide-react';

const ShowContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/contact/contactget")
      .then((res) => res.json())
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="contacts-section">
      <div className="section-header">
        <div className="header-content">
          <h2>Contact Messages</h2>
          <p>Manage customer inquiries and messages</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{contacts.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      <div className="contacts-list">
        {loading ? (
          <p>Loading...</p>
        ) : contacts.length === 0 ? (
          <p>No contact messages found.</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact._id} className="contact-card">
              <div className="contact-header">
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  <div className="contact-meta">
                    <span className="contact-email">
                      <Mail size={14} />
                      {contact.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="contact-content">
                <h4 className="contact-subject">Subject</h4>
                <p className="contact-message">{contact.subject}</p>
              </div>

              <div className="contact-content">
                <h4 className="contact-subject">Message</h4>
                <p className="contact-message">{contact.message}</p>
              </div>

              
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowContact;
