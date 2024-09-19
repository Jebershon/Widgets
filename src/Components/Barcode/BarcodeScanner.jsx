import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Scanner.css';

const BarcodeScannerComponent = () => {
  const videoRef = useRef(null);
  const [barcodeResult, setBarcodeResult] = useState('No barcode detected');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraHidden, setCameraHidden] = useState(false);

  // Error throttle ref to prevent rapid repeated error handling
  const lastErrorTimeRef = useRef(0);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    const successToastId = 'success-toast-id'; // Unique ID for success toast
    const errorToastId = 'error-toast-id'; // Unique ID for error toast

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadedmetadata', () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                setIsScanning(true);
                scanBarcode();
              }).catch(error => {
                console.log('Error starting video playback:', error);
                if (!toast.isActive(errorToastId)) {
                  toast.error('Error starting video playback. Please check your camera.', { toastId: errorToastId });
                }
              });
            }
          });
        }
      } catch (err) {
        console.log('Error accessing camera:', err);
        if (!toast.isActive(errorToastId)) {
          toast.error('Error accessing camera. Please allow camera access.', { toastId: errorToastId });
        }
      }
    };

    const scanBarcode = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const track = videoRef.current.srcObject.getVideoTracks()[0];
        const constraints = { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } };
        track.applyConstraints(constraints).then(() => {
          codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
            if (result && result.text) {
              if (isValidBarcode(result.text)) {
                setBarcodeResult(result.text);
                setIsScanning(false);
                setCameraHidden(true);  // Hide the camera after successful scan
                setCameraStarted(false); // Update cameraStarted state
                if (!toast.isActive(successToastId)) {
                  toast.success('QR Code successfully scanned!', { toastId: successToastId });
                }
              }
            } else if (error) {
              const now = Date.now();
              if (error instanceof NotFoundException) {
                if (now - lastErrorTimeRef.current > 2000) {
                  console.log('Barcode not found.');
                  lastErrorTimeRef.current = now;
                }
              } else {
                console.log('Error scanning barcode:', error);
                if (!toast.isActive(errorToastId)) {
                  toast.error('Error scanning barcode.', { toastId: errorToastId });
                }
              }
            }
          });
        }).catch(err => {
          console.log('Error applying constraints:', err);
          if (!toast.isActive(errorToastId)) {
            toast.error('Error applying constraints. Please try again.', { toastId: errorToastId });
          }
        });
      }
    };

    if (cameraStarted && !cameraHidden) {
      startVideo();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStarted, cameraHidden]);

  const isValidBarcode = (barcodeText) => {
    return barcodeText && barcodeText.trim() !== '';
  };

  const toggleCamera = () => {
    console.log("Before toggle:", { cameraStarted, cameraHidden });
    if (cameraStarted) {
      setCameraStarted(false);
      setCameraHidden(true);
      setBarcodeResult('No barcode detected');
    } else {
      setCameraStarted(true);
      setCameraHidden(false);
    }
    console.log("After toggle:", { cameraStarted, cameraHidden });
  };

  const copyToClipboard = () => {
    if (barcodeResult && barcodeResult !== 'No barcode detected') {
      navigator.clipboard.writeText(barcodeResult).then(() => {
        const toastId = 'copy-toast-id';
        if (!toast.isActive(toastId)) {
          toast.success('Barcode result copied to clipboard!', { toastId });
        }
      }).catch(error => {
        console.log('Error copying to clipboard:', error);
        toast.error('Error copying to clipboard.');
      });
    } else {
      toast.warn('No barcode result to copy.');
    }
  };

  return (
    <div>
      {!cameraHidden && (
        <div className='video-container'>
          <video ref={videoRef} style={{ width: '40%', height: 'auto' }} />
        </div>
      )}
      <div className='container-row'>
        <p className='out'>Result: {barcodeResult}</p>
        <div className='container-copy'>
          <button className="copy" onClick={copyToClipboard} disabled={barcodeResult === 'No barcode detected'}>
            <span data-text-end="Copied!" data-text-initial="Copy to clipboard" className="tooltip"></span>
            <span>
            <svg
                xmlSpace="preserve"
                style={{ enableBackground: 'new 0 0 512 512' }}
                viewBox="0 0 6.35 6.35"
                height="20"
                width="20"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className="clipboard"
            >
                <g>
                <path
                    fill="currentColor"
                    d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
                />
                </g>
            </svg>
            <svg
                xmlSpace="preserve"
                style={{ enableBackground: 'new 0 0 512 512' }}
                viewBox="0 0 24 24"
                height="18"
                width="18"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className="checkmark"
            >
                <g>
                <path
                    data-original="#000000"
                    fill="currentColor"
                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                />
                </g>
            </svg>
            </span>
          </button>
        </div>
      </div>
      {isScanning && !cameraHidden && (
        <div className='load-comp'>
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </div>
      )}
      <button onClick={toggleCamera} className='btn1' style={{ margin: '15px' }}>
        {cameraStarted ? 'Stop Camera' : 'Start Camera'}
      </button>
      {/* <ToastContainer
        closeOnClick={true}
        className="custom-toast"/> */}
    </div>
  );
};

export default BarcodeScannerComponent;
