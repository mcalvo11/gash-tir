import React, { useState, useCallback } from 'react';
import { Amplify, Storage } from 'aws-amplify';
import { useDropzone } from 'react-dropzone';
import awsconfig from './aws-exports';
import './App.css';
import ContainerInfoTable from './ContainerInfoTable';
import DataInfoConfidence from './DataInfoConfidence';
import detectText from "./rekognition";
Amplify.configure(awsconfig);

function App() {
  const [fileUrl, setFileUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [detectedTexts, setDetectedTexts] = useState([]);
  const [containerData, setContainerData] = useState({
    owner: '',
    type: '',
    id: '',
    verifier: '',
    isoType: '',
  });
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (file) {
      const fileName = file.name;
      setPreviewUrl(URL.createObjectURL(file)); 
  
      try {
        const result = await Storage.put(fileName, file, {
          contentType: file.type,
          level: 'public',
        });
        const detectedTextResults = await detectText(fileName);
        setDetectedTexts(detectedTextResults); 
        if (detectedTextResults.length >= 4) {
          const ownerAndType = detectedTextResults[0].text;
          const newContainerData = {
            owner: ownerAndType.slice(0, 3),
            type: ownerAndType.slice(3, 4),
            id: detectedTextResults[1].text,
            verifier: detectedTextResults[2].text,
            isoType: detectedTextResults[3].text,
          };
          setContainerData(newContainerData);
        }

        const url = await Storage.get(result.key);
        setFileUrl(url);
      } catch (err) {
        console.error('Error al subir el archivo:', err);
      }
    }
  }, []);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });
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
          <DataInfoConfidence containerData={detectedTexts} />
        </div>
      </div>
    </div>
  );
}

export default App;