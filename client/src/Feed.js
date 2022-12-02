import { useState, useEffect } from 'react';
import ReadMessage from './ReadMessage';

function Feed(props) {
    const socket = props.socket;
    const [recievedMessages, setMessage] = useState([]);
    const [display, setDisplay] = useState(false);

    function handleClick(event){
        let data = recievedMessages.filter((item)=> (item._id === event.currentTarget.id))[0];
        setDisplay(data);
    }

    useEffect(async function(){
        socket.on('new-message', msg=>{
            msg['new'] = true;
            setMessage(current => [msg, ...current]);
        });
        const response = await fetch('/get-feed', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({user: window.sessionStorage.getItem('name')})
          });
          if(response.ok){
              let responseData = await response.json();
              setMessage(responseData);
          }
    },[]);

  return (
    <div className='feed'>
        <ReadMessage display={display} setDisplay={setDisplay} />
        <h5 className='text-center'>Recieved messages</h5>
        <div className='recieved-messages'>
            <ul className="list-group list-group-flush">
                {recievedMessages.map(message=>(
                    <li onClick={handleClick} id={message._id} className={(message.new) ? "list-group-item msg new-message" : "list-group-item msg"} key={message._id}>
                        <div className='msg-group mb-1'>
                            <div className='msg-name fw-bold pe-2'>{message.sender}</div>
                            <div className='msg-time'>{(new Date(message.time)).toLocaleString()}</div>
                        </div>
                        <div className='msg-group'>
                            <div className='msg-title fw-semibold'>{message.title}</div>
                            <div className='msg-body'>{message.body}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
}

export default Feed;
