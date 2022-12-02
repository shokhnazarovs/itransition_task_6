import { useState, useEffect } from 'react';
import ReadMessage from './ReadMessage';

function MessageComposer(props) {
    const socket = props.socket;
    const [isPending, setPending] = useState(false);
    const [sentMessages, setMessage] = useState([]);
    const [messageReciever, setReciever] = useState('');
    const [display, setDisplay] = useState(false);

    useEffect(()=>{
        socket.on('sent-messages', msg=>{
            setMessage(msg);
        });
    }, []);

    function handleClick(event){
        let data = sentMessages.filter((item)=> (item._id === event.currentTarget.id))[0];
        setDisplay(data);
    }

    function handleBlur(event){
        let recipient = event.currentTarget.value.trim();
        if(recipient) {
            socket.emit('sent-messages', {user: window.sessionStorage.getItem('name'), recipient: recipient});
            setReciever(recipient);
            setMessage([]);
        }
    }

    async function handleSubmit(event){
        event.preventDefault();
        setPending(true);
        let data = {
            sender: window.sessionStorage.getItem('name'),
            recipient: event.currentTarget.recipient.value.trim(),
            title: event.currentTarget.title.value.trim(),
            body: event.currentTarget.body.value.trim()
        }
        const response = await fetch('/new-message', {
          method: 'POST',
          headers: {'Content-Type': 'application/json;charset=utf-8'},
          body: JSON.stringify(data)
        });
        setPending(false);
        if(response.ok){
            let responseData = await response.json();
            setMessage(current => [responseData, ...current]);
        }
      }

  return (
    <div>
        <div className='message-composer'>
        <ReadMessage display={display} setDisplay={setDisplay} />
            <div>
                <h5 className='text-center'>{'Welcome ' + window.sessionStorage.getItem('name')}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <input onBlur={handleBlur} name="recipient" type="text" className="form-control" placeholder="Recipient name" required />
                    </div>
                    <div className="my-2">
                        <input name="title" type="text" className="form-control" placeholder="Message title" />
                    </div>
                    <div className="my-2">
                        <textarea name="body" className="form-control" placeholder="Write your message here" style={{height: 120 + 'px'}} required></textarea>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">{(isPending) ? 'Sending...' : 'Send'}</button>
                </form>
            </div>
            <div className='mt-4'>
                {messageReciever && <div className='pb-2'>Messages sent to <span className='fw-semibold'>{messageReciever + ':'}</span></div>}
                <div className='sent-messages'>
                    <ul className="list-group list-group-flush">
                        {sentMessages.map(message=>(
                            <li onClick={handleClick} id={message._id} time={message.time} recipient={message.recipient} className="list-group-item msg" key={message._id}>
                                <div className='msg-group'>
                                    <div className='msg-title fw-semibold'>{message.title}</div>
                                    <div className='msg-body'>{message.body}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
}

export default MessageComposer;
