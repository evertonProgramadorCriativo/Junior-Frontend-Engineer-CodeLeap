import React from 'react';
import Header from './Header/Header';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app">
      <Header />
      <main className="app-main">{children}</main>
    </div>
  );
};

export default Layout;