import './App.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import {useState,useEffect} from 'react';
import Register from "./Register";
import UserContext from "./UserContext";
import axios from "axios";
import Login from "./Login";
import Home from "./Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.min.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faArrowsUpDown, faListCheck, faCookie, faCookieBite , faCow ,faCarrot, faFish, faUtensils, faCartShopping, faFaceMeh, faFaceSmileWink} from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faArrowsUpDown, faListCheck, faCookie, faCookieBite, faCow, faCarrot, faFish, faUtensils, faCartShopping, faFaceMeh, faFaceSmileWink);

const baseURL = "https://grocer-Me-api.onrender.com"
//const baseURL = 'http://localhost:4000"

function App() {
  const [email,setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get(baseURL + '/user', {withCredentials:true})
      .then(response => {
        setEmail(response.data.email);
        setName(response.data.name);
      });
  }, []);

  function logout() {
    axios.post(baseURL + '/logout', {}, {withCredentials:true})
      .then(() => 
      {
        setEmail('');
        setName('');
      });
  } 

  return (
    <UserContext.Provider value={{email,setEmail, name, setName}}>
      <BrowserRouter>
        <nav>
        <div className="btn-group" role="group" aria-label="Basic example">
        <Link className="btn btn-secondary" to="/Home">Home</Link>
          {!email && (
            <>
              <Link className="btn btn-secondary" to={'/Login'}>Login</Link>
              <Link className="btn btn-secondary" to={'/Register'}>Register</Link>
            </>
          )}
          {!!email && (
            <a href="/#" className="btn btn-secondary" onClick={e => {e.preventDefault();logout();}}>Logout</a>
          )}
        </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/Home" element={<Home/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
          </Routes>
        </main>
        
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;