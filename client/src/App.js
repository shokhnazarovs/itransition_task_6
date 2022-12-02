import Login from './Login';
import Feed from './Feed';
import MessageComposer from './MessageComposer';
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import './App.css';

const socket = io();


socket.io.on('reconnect', ()=>{
  if(window.sessionStorage.getItem('name')) socket.emit('username', window.sessionStorage.getItem('name'));
});

function App() {
  const [isLogged, setLogged] = useState((window.sessionStorage.getItem('name')) ? true : false);

  useEffect(()=>{
    if(window.sessionStorage.getItem('name')) socket.emit('username', window.sessionStorage.getItem('name'));
  }, [isLogged]);

  return (
    <div>
      {!isLogged && <Login setLogged={setLogged}/>}
      {isLogged && 
        <div className='container layout'>
          <MessageComposer socket={socket} />
          <Feed socket={socket} />
        </div>
      }
    </div>
  );
}

export default App;
