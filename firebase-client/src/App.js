import React, { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4004/getUsers')
    .then(response => {
      console.log(response.data);
      setUsers(response.data);
    })
    .catch(error => {
      console.error('Erreur : ', error);
    });
  }, []);

  return (
    <div className="App">
      <h1>Liste des utilisateurs</h1>
      <table border="1" className="table table-striped table-hover">
        <thead>
          <tr>
            <th><strong>Nom</strong></th>
            <th><strong>Email</strong></th>
            <th><strong>Age</strong></th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;