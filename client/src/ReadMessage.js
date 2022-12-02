function ReadMessage(props) {

    function handleClick(event){
        props.setDisplay(false);
    }

  return (
    <div>
        {props.display &&
        <div className='message'>
            <div className='message-head'>
                <div className='message-head-description fw-semibold me-3'>
                    <div>Sender</div>
                    <div>Time</div>
                    <div>Title</div>
                </div>
                <div>
                    <div>{props.display.sender}</div>
                    <div>{ (new Date(props.display.time)).toLocaleString()}</div>
                    <div>{props.display.title}</div>
                </div>
            </div>
            <hr/>
            <div className='message-body'>{props.display.body}</div>
            <hr/>
            <div className='message-footer'>
                <button onClick={handleClick} type="button" className="btn btn-secondary">Close</button>
            </div>
        </div>
        }
    </div>
  );
}

export default ReadMessage;
