import {useState, useContext} from 'react';
import axios from 'axios';
import UserContext from "./UserContext";
import {Navigate} from "react-router-dom";

function Register() {

  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [navigate,setNavigate] = useState(false);
  const [registerError,setRegisterError] = useState(false);

  const user = useContext(UserContext);

  const baseURL = "http://grocer-Me-api.onrender.com"
  //const baseURL = 'http://localhost:4000"

  /* Upon form submission attempt to register user with provided information */
  function registerUser(e) {
    e.preventDefault();

    const data = {name,email,password};
    console.log("data:");
    console.log(data);
    axios.post(baseURL + '/register', data, {withCredentials:true})
      .then(response => {
        user.setName(response.data.name);
        user.setEmail(response.data.email);
        setName('');
        setEmail('');
        setPassword('');
        setRegisterError(false);
        setNavigate(true);
      })
      .catch((e)=>{
        setRegisterError(true);
        console.log(e);
      });
  }

  if (navigate) {
    return <Navigate to={'/'} />
  }

  return (
    <form action="" onSubmit={e => registerUser(e)}>
      {registerError && (
        <div className="redText"> Email already registered. Please log in or use a new email</div>
      )}
      <input className='form-control' type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/><br />
      <input className='form-control' type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/><br />
      <input className='form-control' type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/><br />
      <button className='btn btn-primary' type="submit">Register</button>
    </form>
  );
}

export default Register;