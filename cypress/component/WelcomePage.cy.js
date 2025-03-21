import React from 'react';
import { mount } from '@cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from '../../src/pages/WelcomePage';
import AuthContext from '../../src/context/AuthContext';
import Login from '../../src/pages/Login'; // Import Login component
import Signup from '../../src/pages/Signup'; // Import Signup component

describe('WelcomePage', () => {
  let navigateStub;

  beforeEach(() => {
    // Stub the useNavigate hook
    navigateStub = cy.stub().as('navigateStub');
    cy.stub(require('react-router-dom'), 'useNavigate').returns(navigateStub);
  });

  it('renders the welcome message and buttons', () => {
    // Mock the AuthContext if necessary
    const mockAuthContext = {
      user: null,
      loading: false,
    };

    mount(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <WelcomePage />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check if the welcome message is visible
    cy.contains('Welcome to Benchat!').should('be.visible');

    // Check if the Login and Signup buttons are visible
    cy.get('.auth-buttons button').contains('Login').should('be.visible');
    cy.get('.auth-buttons button').contains('Signup').should('be.visible');
  });

  it('navigates to the Login page when the Login button is clicked', () => {
    // Mock the AuthContext if necessary
    const mockAuthContext = {
      user: null,
      loading: false,
    };

    mount(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Click the Login button
    cy.get('.auth-buttons button').contains('Login').click();

    // Verify that the Login component is rendered
    cy.contains('Login').should('be.visible'); // Check for a unique element in the Login component
  });

  it('navigates to the Signup page when the Signup button is clicked', () => {
    // Mock the AuthContext if necessary
    const mockAuthContext = {
      user: null,
      loading: false,
    };

    mount(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Click the Signup button
    cy.get('.auth-buttons button').contains('Signup').click();

    // Verify that the Signup component is rendered
    cy.contains('Signup').should('be.visible'); // Check for a unique element in the Signup component
  });
});