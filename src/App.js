import React, { useState, useCallback } from 'react';
import { Amplify, Storage } from 'aws-amplify';
import { useDropzone } from 'react-dropzone';
import awsconfig from './aws-exports';
import './App.css';
import ContainerInfoTable from './ContainerInfoTable';
Amplify.configure(awsconfig);

function App() {
  const [fileUrl, setFileUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileName = file.name;
      setPreviewUrl(URL.createObjectURL(file)); 

      Storage.put(fileName, file, {
        contentType: file.type,
      })
        .then((result) => {
          console.log('Archivo subido con éxito:', result);
          return Storage.get(result.key);
        })
        .then((url) => {
          setFileUrl(url);
        })
        .catch((err) => console.error('Error al subir el archivo:', err));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });
  const containerData = {
    owner: '',
    type: '',
    id: '',
    verifier: '',
    isoType: '',
  };
  return (
    <div className="App">
      <div className="upload-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="preview-section">
          <div className="preview-area">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="placeholder-image">
                <span role="img" aria-label="Image icon">🖼️</span>
              </div>
            )}
          </div>
          <div className="center-container">
            <div className="upload-section">
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Arrastre la imagen aquí ...</p>
                ) : (
                  <button className="choose-file-btn">Seleccione una imagen</button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="table-section">
          <h1>Información del Contenedor</h1>
          <ContainerInfoTable containerData={containerData} />
        </div>
      </div>
      {fileUrl && (
        <div>
          <p>Archivo subido:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
        </div>
      )}
    </div>
  );
}

export default App;