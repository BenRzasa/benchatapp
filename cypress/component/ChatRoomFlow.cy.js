import React from 'react';
import { mount } from '@cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../../src/pages/Login';
import MainPage from '../../src/pages/MainPage';
import AuthContext from '../../src/context/AuthContext';
import apiClient from '../../src/api/apiClient';

describe('Full Chat Flow: Login -> Search Contact -> Open Chat -> Send Message -> Delete Message', () => {
  let navigateStub;

  beforeEach(() => {
    // Stub the useNavigate hook
    navigateStub = cy.stub().as('navigateStub');
    cy.stub(require('react-router-dom'), 'useNavigate').returns(navigateStub);

    // Mock API responses
    cy.stub(apiClient, 'post').callsFake((url, data) => {
      if (url === '/api/auth/login') {
        return Promise.resolve({ data: { token: 'fake-token', user: { email: data.email } } });
      }
      if (url === '/api/contacts/search') {
        return Promise.resolve({
          data: {
            contacts: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.sypher@example.com',
              },
            ],
          },
        });
      }
      if (url === '/api/messages/get-messages') {
        return Promise.resolve({
          data: {
            messages: [],
          },
        });
      }
      return Promise.reject(new Error('Unexpected API call'));
    });

    // Mock API DELETE request for deleting messages
    cy.stub(apiClient, 'delete').resolves({ data: { message: 'Messages deleted successfully' } });
  });

  it('completes the full chat flow: Login -> Search Contact -> Open Chat -> Send Message -> Delete Message', () => {
    // Mock the AuthContext if necessary
    const mockAuthContext = {
      user: { id: 'user123', firstName: 'Test', lastName: 'User', email: 'test@example.com' },
      loading: false,
      login: cy.stub().as('loginStub').resolves(),
    };

    mount(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/mainpage" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Step 1: Log in with an existing user
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button').contains('Login').click();

    // Step 2: Verify redirection to the Main Page
    cy.contains('Welcome to Benchat, Test!').should('be.visible');

    // Step 3: Search for a contact using the search box
    cy.get('input[placeholder="Search by name or email"]').type('@');
    cy.get('button').contains('Search').click();

    // Step 4: Verify that the contact is in the search results
    cy.contains('John Doe (john.sypher@example.com)').should('be.visible');

    // Step 5: Click on the contact in the search results to add it to the contact list
    cy.contains('John Doe (john.sypher@example.com)').click();

    // Step 6: Verify that the contact is added to the contact list
    cy.get('.contact-list').contains('John Doe (john.sypher@example.com)').should('be.visible');

    // Step 7: Click on the contact in the contact list to open the chat popup
    cy.get('.contact-list').contains('John Doe (john.sypher@example.com)').click();

    // Step 8: Verify that the chat popup is opened
    cy.get('.chat-popup-overlay').should('be.visible');

    // Scroll the chat popup into view to ensure it is fully visible
    cy.get('.chat-popup-overlay').scrollIntoView();

    // Step 9: Verify that the chat input box and "Send" button are visible
    cy.get('textarea[placeholder="Type your message here"]').should('be.visible');
    cy.get('button').contains('Send').should('be.visible');

    // Step 10: Send a message in the chat room
    cy.get('textarea[placeholder="Type your message here"]').type('Hello, John!');
    cy.get('button').contains('Send').click();

    // Step 11: Verify that the message is sent
    cy.contains('Hello, John!').should('be.visible');

    // Step 12: Delete the message using the delete button
    cy.contains('Hello, John!')
      .parent() // Navigate to the message bubble
      .find('.delete-button') // Find the delete button within the message bubble
      .click(); // Click the delete button

    // Step 13: Verify that the message is deleted
    cy.contains('Hello, John!').should('not.exist');

    // Step 14: Confirm all steps have completed successfully
    cy.log('All steps completed successfully!');
  });
});