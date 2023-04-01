import {useState, useContext} from 'react';
import axios from 'axios';
import UserContext from "./UserContext";
import {Navigate} from "react-router-dom";

function Login() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loginError,setLoginError] = useState(false);
  const [navigate,setNavigate] = useState(false);

  const user = useContext(UserContext);

  const baseURL = "https://grocer-me-api.onrender.com"
  //const baseURL = 'http://localhost:4000"

  function loginUser(e) {
    e.preventDefault();

    const data = {email,password};
    axios.post(baseURL + '/login', data, {withCredentials:true})
      .then(response => {
        user.setEmail(response.data.email);
        user.setName(response.data.name);
        setEmail('');
        setPassword('');
        setLoginError(false);
        setNavigate(true);
      })
      .catch(() => {
        setLoginError(true);
      });
  }

  if (navigate) {
    return <div>{<Navigate to={"/"}/>}</div>
  }

  return (
    <form action="" onSubmit={e => loginUser(e)}>
      {loginError && (
        <div className="redText">Could not log in. Wrong email or password. Please try again or create an account.</div>
      )}
      <input className="form-control" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/><br />
      <input className="form-control"  type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/><br />
      <button className="btn btn-primary" type="submit">Log in</button>
    </form>
  );
}

export default Login;