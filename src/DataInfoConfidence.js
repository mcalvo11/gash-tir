import React from 'react';
import './ContainerInfoTable.css';

const DataInfoConfidence = ({ containerData }) => {
  return (
    <div className="container-info-table">
      <table>
        <tbody>
          <tr>
            <th>Valor</th>
            <th>Nivel de confianza</th>
          </tr>
          <tr>
          <td>{containerData[0]?.text}</td>
          <td>{containerData[0]?.confidence}</td>
          </tr>
          <tr>
          <td>{containerData[1]?.text}</td>
          <td>{containerData[1]?.confidence}</td>
          </tr>
          <tr>
          <td>{containerData[2]?.text}</td>
          <td>{containerData[2]?.confidence}</td>
          </tr>
          <tr>
          <td>{containerData[3]?.text}</td>
          <td>{containerData[3]?.confidence}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataInfoConfidence;