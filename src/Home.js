import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserContext from "./UserContext";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import toastr from 'toastr';
import moment from 'moment';
import { hide } from "@popperjs/core";

function Home() {

  /* Set up state */
  const userInfo = useContext(UserContext);
  const [inputVal, setInputVal] = useState('');
  const [errorInputVal, setErrorInputVal] = useState('');
  const [todos, setTodos] = useState([]);
  const [inputDate, setInputDate] = useState('');
  const [errorInputDate, setErrorInputDate] = useState('');
  const [eventType, setEventType] = useState('produce');
  const [calenderType, setCalenderType] = useState('text');
  const [isBuyOpen, setisBuyOpen] = useState(false);
  const [isUseOpen, setisUseOpen] = useState(false);

  /* Load todos upon page open */
  useEffect(() => {
    axios.get(baseURL + '/todos', { withCredentials: true })
      .then(
        (response) => {
          setTodos(response.data);
        }, () => {
          console.log("No tasks");
        })
  }, []);

  {/** If user is not logged in tell them about the website */ }
  if (!userInfo.email) {
    return <div>
      <h2 className="whiteText"> Grocery Tracker <FontAwesomeIcon className="text-success" icon="fa-shopping-cart" /></h2>
      <h3 className="whiteText"> Welcome! The purpose of this website is to help the community to keep track of their groceries and expiration dates with the goal of reducing food waste</h3>
      <h4 className="whiteText"> Please  <Link to={'/Login'}>login</Link> or <Link to={'/Register'}> register</Link> to use our service </h4>
    </div>
  }

  /* Add todo to database with toBuy information */
  function addToBuyTodo(e) {
    e.preventDefault();
    if (!isValid()) return;
    hideBuyModal();
    const nonFormatDated = inputDate;
    let formatedDate = moment(nonFormatDated, "YYYY-MM-DD");
    formatedDate = formatedDate.format("MM/DD/YYYY");
    axios.put(baseURL + '/todos', { text: inputVal, dtime: formatedDate, eType: eventType, toUse: false }, { withCredentials: true })
      .then(
        (response) => {

          /** Concact new todo w/ old todos */
          let concatedTodos = [...todos].concat(response.data);
          setTodos(concatedTodos);
          setInputVal('');
          setInputDate('');
        }, () => {
          console.log("Cannot add Todo");
        });
  }

  /* Add todo to database with toUse information */
  function addToUseTodo(e) {
    e.preventDefault();
    if (!isValid()) return;
    hideUseModal();
    const nonFormatDated = inputDate;
    let formatedDate = moment(nonFormatDated, "YYYY-MM-DD");
    formatedDate = formatedDate.format("MM/DD/YYYY");
    axios.put(baseURL + '/todos', { text: inputVal, dtime: formatedDate, eType: eventType, toUse: true }, { withCredentials: true })
      .then(
        (response) => {
         
          /** Concact new todo w/ old todos */
          let concatedTodos = [...todos].concat(response.data);
          setTodos(concatedTodos);
          setInputVal('');
          setInputDate('');

        }, () => {
          console.log("Cannot add Todo");
        });
  }
  /* Note - prior two functions are redundant but I plan to refactor into seperate todo models so I am keeping this structure */
  
  const baseURL = "https://grocer-Me-api.onrender.com"
  //const baseURL = 'http://localhost:4000"

  /** Handle the deleting of state changes and making the local changes reflective */
  function deleteTodo(todo) {
    const data = { id: todo._id, delete: true };
    axios.post(baseURL + '/todos', data, { withCredentials: true })
      .then(() => {
        const newTodos = todos.filter(t => {
          return t._id !== todo._id;
        });
        setTodos([...newTodos]);
      });
  }

  /** Handle the updating of state changes and making the local changes reflective */
  function updateTodo(todo) {
    const data = { id: todo._id, done: !todo.done, delete: false };
    axios.post(baseURL + '/todos', data, { withCredentials: true })
      .then(() => {
        const newTodos = todos.map(t => {
          if (t._id === todo._id) {
            t.done = !t.done;
          }
          return t;
        });
        setTodos([...newTodos]);
      });
  }

  /** Form Validation */
  function isValid() {

    let valid = true;

    if (!inputVal) {
      valid = false;
      setErrorInputVal("invalid");
      toastr.error("Please write a description");
    }
    else{
      setErrorInputVal("");
    }

    if (inputDate.length < 10) {
      valid = false;
      setErrorInputDate("invalid");
      toastr.error("Pick a valid date")
    }
    else{
      setErrorInputDate("");
    }

    return valid;
  }

  const showBuyModal = () => {
    setisBuyOpen(true);
  };

  const hideBuyModal = () => {
    setisBuyOpen(false);
    setCalenderType('text');
    setInputVal('');
    setInputDate('');
    setErrorInputDate('');
    setErrorInputVal('');
  };

  const showUseModal = () => {
    setisUseOpen(true);
  };

  const hideUseModal = () => {
    setisUseOpen(false);
    setCalenderType('text');
    setInputVal('');
    setInputDate('');
    setErrorInputDate('');
    setErrorInputVal('');
  };


  return <div style={{ height: "95vh" }}>

    {/** Modal respective to grocery items to use */}
    <Modal show={isUseOpen} onHide={hideUseModal}>
      <Modal.Header>
        <Modal.Title style={{fontWeight: "bold"}}>Add a new grocery item to eat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <input placeholder={'Describe your grocery item'}
            className= {errorInputVal ? "form-control is-invalid" : "form-control"}
            type='text'
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
          />
          <input placeholder={'Pick your item\'s expiration date'}
            className= {errorInputDate ? "form-control is-invalid" : "form-control"}
            type={calenderType}
            value={inputDate}
            onFocus={e => setCalenderType('date')}
            onChange={e => setInputDate(e.target.value)}
          />
          <select className="form-select" onChange={(e) => setEventType(e.target.value)}>
            <option value="produce">Produce</option>
            <option value="meat">Meat</option>
            <option value="dairy">Dairy</option>
            <option value="other">Other</option>
          </select>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={hideUseModal}>Cancel</button>
        <button className="btn btn-success" type="submit" onClick={e => addToUseTodo(e)}>Submit Task</button>
      </Modal.Footer>
    </Modal>

    {/** Modal respective to grocery items to buy */}
    <Modal show={isBuyOpen} onHide={hideBuyModal}>
      <Modal.Header>
        <Modal.Title style={{ fontWeight: "bold" }}>Add a new grocery item to buy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <input placeholder={'Describe your grocery item'}
            className='form-control'
            type='text'
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
          />
          <input placeholder={'Pick a date to buy it by'}
            className='form-control'
            type={calenderType}
            value={inputDate}
            onFocus={e => setCalenderType('date')}
            onChange={e => setInputDate(e.target.value)}
          />
          <select className="form-select" onChange={(e) => setEventType(e.target.value)}>
            <option value="produce">Produce</option>
            <option value="meat">Meat</option>
            <option value="dairy">Dairy</option>
            <option value="other">Other</option>
          </select>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={hideBuyModal}>Cancel</button>
        <button className="btn btn-success" type="submit" onClick={e => addToBuyTodo(e)}>Submit Task</button>
      </Modal.Footer>
    </Modal>

    {/** Logged in welcome display*/}
    <h2 style={{ padding: "20px" }} className="whiteText"> Welcome <span> {userInfo.name} </span>! Here is the status on your groceries</h2>
    <div className="row">

      <div className="col-md-1" />
      <div className="col-md-5">

        {/** Card for items to eat*/}
        <div className="card">
          <div className="card-header row" style={{ fontWeight: "bold" }}>
            <div className="col-sm-4" />
            <div className="col-sm-4"> <h5 style={{ fontWeight: "bold" }} >Groceries To Eat </h5></div>
            <div className="col-sm-2" />
            <div className="col-sm-2"> <button className="btn btn-outline-success btn-sm" onClick={showUseModal}> <FontAwesomeIcon icon="fa-solid fa-cookie-bite" /></button> </div>
          </div>
          <div className="card-body">

            {/** Display items to eat*/}
            {todos.filter(todo => todo.toUse).map(todo => (
              <div key={todo._id} className="card" style={{ backgroundColor: "salmon !important" }}>
                <div className="row align-items-center" style={{ justifyContent: "center !important" }}>
                  <div className="col-sm-1">
                    <div>

                      {/** Display the appropriate icon for the type of item */}
                      {!todo.done && <span><FontAwesomeIcon icon="fa-solid fa-face-blank" /></span>}
                     
                      <input type={'checkbox'}
                        checked={todo.done}
                        onChange={() => updateTodo(todo)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-5 groceryContent" >
                    {todo.done ? <del>{todo.text}</del> : todo.text}
                  </div>

                  {/** Calculate and display the number of days till expiration */}
                  <div className="col-sm-4 groceryContent" style={moment(todo.dtime, "MM/DD/YYYY").diff(moment(), 'days') <= 0 ? { fontWeight: "bold", color: "red" } : {}}>
                    {moment(todo.dtime, "MM/DD/YYYY").diff(moment(), 'days') < 0 ? 0 : moment(todo.dtime, "MM/DD/YYYY").diff(moment(), 'days')}
                    <span> days till expiration </span>
                  </div>

                  <div className="col-sm-2" >
                    <button type="button" className="btn" onClick={() => deleteTodo(todo)}><FontAwesomeIcon icon="fa-solid fa-trash" size="sm" /></button>
                  </div>
                </div>
              </div>
            ))}

            {/** If there are no groceries prompt the user to add some*/}
            {todos.filter(todo => todo.toUse).length == 0 &&
              <h3 style={{ backgroundColor: "salmon !important" }}>Click the green cookie to add items!</h3>}

          </div>
        </div>
      </div>

      {/** Card for items to buy*/}
      <div className="col-md-5">
        <div className="card">
          <div className="card-header row" style={{ fontWeight: "bold" }}>
            <div className="col-sm-4" />
            <div className="col-sm-4"> <h5 style={{ fontWeight: "bold" }} >Groceries To Buy </h5></div>
            <div className="col-sm-2" />
            <div className="col-sm-2"> <button className="btn btn-outline-success btn-sm" onClick={showBuyModal}><FontAwesomeIcon icon="fa-solid fa-cookie" /></button></div>
          </div>
          <div className="card-body" >

            {/** Display items to buy*/}
            {todos.filter(todo => !todo.toUse).map(todo => (
              <div key={todo._id} className="card">
                <div className="row align-items-center" >
                  <div className="col-sm-2">
                    <div >

                      {/*Show respective icon for product type*/}
                      {!todo.done && todo.eType == 'dairy' && <span>  <FontAwesomeIcon icon="fa-solid fa-cow" style={{ paddingRight: "0.5em" }} /></span>}
                      {!todo.done && todo.eType == 'produce' && <span>  <FontAwesomeIcon icon="fa-solid fa-carrot" style={{ paddingRight: "0.5em" }} /></span>}
                      {!todo.done && todo.eType == 'meat' && <span>  <FontAwesomeIcon icon="fa-solid fa-fish" style={{ paddingRight: "0.5em" }} /></span>}
                      {!todo.done && todo.eType == 'other' && <span>  <FontAwesomeIcon icon="fa-solid fa-utensils" style={{ paddingRight: "0.5em" }} /></span>}

                      {todo.done && <span><FontAwesomeIcon className="text-success" icon="fa-solid fa-cookie-bite" style={{ paddingRight: "0.5em" }} /></span>}

                      <input type={'checkbox'}
                        checked={todo.done}
                        onChange={() => updateTodo(todo)}
                      />

                    </div>
                  </div>
                  <div className="col-sm-4 groceryContent">
                    {todo.done ? <del>{todo.text}</del> : todo.text}
                  </div>
                 {/** Calculate and display the number of days till expiration */}
                 <div className="col-sm-4 groceryContent" style={moment(todo.dtime, "MM/DD/YYYY").diff(moment(), 'days') <= 0 ? { fontWeight: "bold", color: "red" } : {}}>
                    {moment(todo.dtime, "MM/DD/YYYY").diff(moment(), 'days') < 0 ? 0 : moment(todo.dtime, "MM/DD/YYYY").diff(moment(), 'days')}
                    <span> days to buy </span>
                  </div>
                  <div className="col-sm-2">
                    <button type="button" className="btn" onClick={() => deleteTodo(todo)}><FontAwesomeIcon icon="fa-solid fa-trash" size="sm" /></button>
                  </div>
                </div>
              </div>
            ))}

            {/** If there are no groceries prompt the user to add some*/}
            {todos.filter(todo => !todo.toUse).length == 0 &&
              <h3 style={{ backgroundColor: "salmon !important" }}>Click the green cookie to add items!</h3>}

          </div>
        </div>
      </div>
      <div className="col-md-1" />
    </div>

  </div>
}

export default Home;
