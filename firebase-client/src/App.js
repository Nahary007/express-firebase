import React, { useEffect, useState} from "react";
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4004/getUsers')
    .then(response => {
      console.log(response.data)
      setUsers(response.data);
    })
    .catch(error => {
      console.error('Erreur : ', error);
    }) ;
  }, []);

  return (
    <div className="App">
      <h1>Liste des utilisateurs</h1>
      <table border="1" class="table table-striped table-hover ">
        <tr>
          <td><strong>Nom</strong></td>
          <td><strong>Email</strong></td>
          <td><strong>Age</strong></td>
        </tr>
        {
          users.map(user => (
            <tr key={user.id}>
              <td> {user.nom} </td>
              <td> {user.email} </td>
              <td> {user.age} </td>
            </tr>
          ))
        }
      </table>
    </div>
  );
}

export default App;