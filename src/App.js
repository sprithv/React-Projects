import React from 'react';
import './App.css';
import AddressFormComponent from './component/AddressFormComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="m-4">
          Address Validation Application
        </p>
      </header>
      <AddressFormComponent/>
    </div>
  );
}

export default App;
