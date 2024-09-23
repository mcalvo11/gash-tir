import React, { useState } from 'react';
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import { useDropzone } from 'react-dropzone';
import './App.css';

Amplify.configure(awsconfig);

function App() {
  const [fileUrl, setFileUrl] = useState('');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileName = file.name;

    Storage.put(fileName, file)
      .then((result) => {
        console.log('Archivo subido con éxito:', result);
        Storage.get(result.key).then((url) => {
          setFileUrl(url);
        });
      })
      .catch((err) => console.error('Error al subir el archivo:', err));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Subir archivo a S3</h1>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Arrastra un archivo o haz clic para seleccionarlo</p>
        </div>
        {fileUrl && (
          <div>
            <p>Archivo subido:</p>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {fileUrl}
            </a>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;