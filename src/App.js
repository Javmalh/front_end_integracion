import React from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
      <div className="App">
        <Header />
        <main>
          <HomePage />
          {/* Añadir un enrutador (como React Router Dom)
            para mostrar diferentes páginas según la URL */}
        </main>
        {}
        {}
      </div>
  );
}

export default App;