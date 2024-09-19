// src/App.js
import React, { useState } from 'react';
import BarcodeGenerator from './BarcodeGenerator';
import BarcodeScanner from './BarcodeScanner';
import './Home.css';
import { ToastContainer } from 'react-toastify';

function Home() {
  const [scannedValue, setScannedValue] = useState('');

  const handleDetected = (code) => {
    setScannedValue(code);
  };

  return (
    <div className="App">
      <div className='container'>
      <div className='card'>
        <h2>Barcode Generator</h2>
        <BarcodeGenerator/>
      </div>

      <div className='card'>
        <h2>Barcode Scanner</h2>
        <BarcodeScanner onDetected={handleDetected} />
        {scannedValue && <p>Scanned Barcode: {scannedValue}</p>}
      </div>
      </div>
      <ToastContainer
        closeOnClick={true}
        className="custom-toast"/>
    </div>
  );
}

export default Home;
