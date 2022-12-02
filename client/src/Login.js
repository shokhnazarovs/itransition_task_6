import { useState } from 'react';

function Login(props) {

    const [isPending, setPending] = useState(false);
    const [gotError, setError] = useState(false);

  async function handleSubmit(event){
    event.preventDefault();
    setPending(true);
    let name = event.target.name.value.trim();
    const response = await fetch('/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify({name: name})
    });
    setPending(false);
    if(response.ok){
        window.sessionStorage.setItem('name', name);
        props.setLogged(true);
    } else {
        setError(true);
    }
  }

  return (
    <div className='form-signin w-100 m-auto position-absolute top-50 start-50 translate-middle'>
      <form onSubmit={handleSubmit}>
        {gotError && <div className='text-center mb-3'>Something went wrong, try again later</div>}
        <h5 className='text-center mb-3'>Sign in to start messaging</h5>
        <div className="form-floating my-2">
          <input name="name" type="text" className="form-control" id="floatingInput" placeholder="Enter your name" required />
          <label htmlFor="floatingInput">Enter your name</label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">{(isPending) ? 'Loading...' : 'Enter'}</button>
      </form>
    </div>
  );
}

export default Login;
