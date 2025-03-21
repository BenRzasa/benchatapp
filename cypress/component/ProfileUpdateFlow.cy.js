import React from 'react';
import { mount } from '@cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../../src/pages/Login';
import MainPage from '../../src/pages/MainPage'; 
import Profile from '../../src/pages/Profile'; 
import AuthContext from '../../src/context/AuthContext'; 
import apiClient from '../../src/api/apiClient';

describe('Profile Update and Logout Flow', () => {
    let navigateStub;
  
    beforeEach(() => {
      // Set the viewport size to simulate a full page
      cy.viewport(1280, 1024);
  
      // Stub the useNavigate hook
      navigateStub = cy.stub().as('navigateStub');
      cy.stub(require('react-router-dom'), 'useNavigate').returns(navigateStub);
  
      // Mock API responses
      cy.stub(apiClient, 'post').callsFake((url, data) => {
        if (url === '/api/auth/login') {
          return Promise.resolve({ data: { token: 'fake-token', user: { email: data.email } } });
        }
        if (url === '/api/auth/update-profile') {
          return Promise.resolve({ data: { message: 'Profile updated successfully' } });
        }
        if (url === '/api/auth/logout') {
          return Promise.resolve({ data: { message: 'Logged out successfully' } });
        }
        return Promise.reject(new Error('Unexpected API call'));
      });
  
      // Mock API GET request for user info
      cy.stub(apiClient, 'get').callsFake((url) => {
        if (url === '/api/auth/userinfo') {
          return Promise.resolve({
            data: {
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              bio: 'Test bio',
              profilePicture: 'https://via.placeholder.com/150',
            },
          });
        }
        return Promise.reject(new Error('Unexpected API call'));
      });
    });
  
    it('completes the profile update and logout flow', () => {
      // Mock the AuthContext if necessary
      const mockAuthContext = {
        user: { id: 'user123', firstName: 'Test', lastName: 'User', email: 'test@example.com' },
        loading: false,
        login: cy.stub().as('loginStub').resolves(),
        logout: cy.stub().as('logoutStub').resolves(),
      };
  
      mount(
        <AuthContext.Provider value={mockAuthContext}>
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/mainpage" element={<MainPage />} />
              <Route path="/profile" element={<Profile />} />
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
  
      // Step 3: Navigate to the Profile page using the custom Profile button
      cy.get('.buttons').within(() => {
        cy.get('button').contains('Profile').scrollIntoView().click(); // Scroll into view before clicking
      });
  
      // Step 4: Verify that the Profile page is loaded
      cy.contains("Test User's Profile").should('be.visible');
  
      // Step 5: Update the first name and last name fields
      cy.get('input[placeholder="First Name"]').clear().type('UpdatedFirstName');
      cy.get('input[placeholder="Last Name"]').clear().type('UpdatedLastName');
  
      // Step 6: Save the changes
      cy.get('button').contains('Save').click();
  
      // Step 7: Verify redirection back to the Main Page
      cy.contains('Welcome to Benchat, UpdatedFirstName!').should('be.visible');
  
      // Step 8: Log out using the custom Logout button
      cy.get('.buttons').within(() => {
        cy.get('button').contains('Logout').scrollIntoView().click(); // Scroll into view before clicking
      });
  
      // Step 9: Verify redirection to the Login page
      cy.contains('Login').should('be.visible');
  
      // Step 10: Confirm all steps have completed successfully
      cy.log('All steps completed successfully!');
    });
  });