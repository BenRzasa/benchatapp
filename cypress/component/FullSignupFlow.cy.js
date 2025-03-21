import React from 'react';
import { mount } from '@cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from '../../src/pages/WelcomePage';
import Signup from '../../src/pages/Signup';
import Login from '../../src/pages/Login';
import MainPage from '../../src/pages/MainPage';
import AuthContext from '../../src/context/AuthContext'; 
import apiClient from '../../src/api/apiClient'; 

describe('Full User Flow: Signup -> Login -> MainPage', () => {
  let navigateStub;

  beforeEach(() => {
    // Stub the useNavigate hook
    navigateStub = cy.stub().as('navigateStub');
    cy.stub(require('react-router-dom'), 'useNavigate').returns(navigateStub);

    // Mock API responses
    cy.stub(apiClient, 'post').callsFake((url, data) => {
      if (url === '/api/auth/signup') {
        return Promise.resolve({ data: { message: 'Signup successful!' } });
      }
      if (url === '/api/auth/login') {
        return Promise.resolve({ data: { token: 'fake-token', user: { email: data.email } } });
      }
      return Promise.reject(new Error('Unexpected API call'));
    });
  });

  it('completes the full user flow: Signup -> Login -> MainPage', () => {
    // Mock the AuthContext if necessary
    const mockAuthContext = {
      user: null,
      loading: false,
      login: cy.stub().as('loginStub').resolves(),
    };

    mount(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mainpage" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Step 1: Start on the Welcome Page
    cy.contains('Welcome to Benchat!').should('be.visible');

    // Step 2: Navigate to the Signup Page
    cy.get('.auth-buttons button').contains('Signup').click();
    cy.contains('Signup').should('be.visible'); // Verify Signup Page is rendered

    // Step 3: Fill out the Signup form and submit
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Confirm Password"]').type('password123');
    cy.get('button').contains('Signup').click();

    // Step 4: Verify redirection to the Login Page
    cy.contains('Login').should('be.visible'); // Verify Login Page is rendered

    // Step 5: Fill out the Login form and submit
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button').contains('Login').click();

    // Step 6: Verify redirection to the Main Page
    cy.contains('Welcome to Benchat, User!').should('be.visible'); // Verify Main Page is rendered
  });
});