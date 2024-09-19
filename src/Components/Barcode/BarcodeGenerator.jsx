import React, { useState } from 'react';
import QRCode from 'qrcode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Generator.css';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrColor, setQrColor] = useState('#000000'); // Default color: black
  const [qrSize, setQrSize] = useState(200); // Default size: 200x200 pixels
  const [qrImage, setQrImage] = useState(null); // State to store the QR code image URL

  const generateQRCode = async () => {
    const successToastId = 'qr-success-toast-id';
    const errorToastId = 'qr-error-toast-id';

    if (!text.trim()) {
      toast.error('Please enter text to encode.');
      return;
    }

    try {
      const options = {
        color: {
          dark: qrColor, // QR code color
          light: '#FFFFFF', // Background color (white)
        },
        width: qrSize, // Size of the QR code
      };

      const url = await QRCode.toDataURL(text, options);
      setQrImage(url);

      // Display success toast if not already shown
      if (!toast.isActive(successToastId)) {
        toast.success('QR Code generated successfully!', { toastId: successToastId });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);

      // Display error toast if not already shown
      if (!toast.isActive(errorToastId)) {
        toast.error('Error generating QR code. Please try again.', { toastId: errorToastId });
      }
    }
  };

  const downloadQRCode = () => {
    if (qrImage) {
      const link = document.createElement('a');
      link.href = qrImage;
      link.download = 'qrcode.png';
      link.click();
      toast.success('Generated QR downloaded successfully!');
    } else {
      toast.warn('Please generate a QR code before downloading.');
    }
  };

  return (
    <div className='content'>
      <textarea
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to encode"
        className='QR-inp'
      />
      <div className='container2'>
        <div className='card2'>
          <label className='label1'>Color:</label>
          <input
            type="color"
            value={qrColor}
            onChange={(e) => setQrColor(e.target.value)}
            className='color'
          />
        </div>

        <div className='card2'>
          <label className='label1'>Size:</label>
          <input
            type="range"
            min="100"
            max="500"
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            className='range'
          />
          <span>{qrSize} px</span>
        </div>
      </div>

      <button onClick={generateQRCode} className='btn1' style={{ margin: '15px' }}>
        Generate QR Code
      </button>

      {qrImage && (
        <div className='qr-code-container'>
          <img src={qrImage} alt="QR Code" className='qr-code-image' style={{ borderRadius: '12px' }} />
        </div>
      )}

      <div className='down-container'>
        <button onClick={downloadQRCode} className='btn1 download' style={{ margin: '15px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
