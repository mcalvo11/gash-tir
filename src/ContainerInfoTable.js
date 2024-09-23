import React from 'react';
import './ContainerInfoTable.css';

const ContainerInfoTable = ({ containerData }) => {
  return (
    <div className="container-info-table">
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Propietario del contenedor</td>
            <td>{containerData.owner || ''}</td>
          </tr>
          <tr>
            <td>Tipo de contenedor</td>
            <td>{containerData.type || ''}</td>
          </tr>
          <tr>
            <td>ID</td>
            <td>{containerData.id || ''}</td>
          </tr>
          <tr>
            <td>Verificador</td>
            <td>{containerData.verifier || ''}</td>
          </tr>
          <tr>
            <td>Tipo ISO del contenedor</td>
            <td>{containerData.isoType || ''}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContainerInfoTable;