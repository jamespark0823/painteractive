import './Authenticator.css'
import React, {useState} from 'react';
import Modal from 'react-modal';
import axios from "axios";

const customModalStyles = {
    content: {
        top            : '40%',
        left           : '50%',
        right          : 'auto',
        bottom         : 'auto',
        marginRight    : '-50%',
        transform      : 'translate(-50%, -40%)',
        backgroundColor: '#b4a7d6'
    }
}

function Authenticator (props) {
    const [isOpen, setIsOpen] = useState(false);
    const [registering, setRegistering] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
        leaveRegistration();
    }

    const enterRegistration = () => {
        setRegistering(true);
    }

    const leaveRegistration = () => {
        setRegistering(false);
    }

    props.authModalRef(openModal)

    const invokeLogIn = (user) => {
        props.logIn(user);
        closeModal();
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal} style={customModalStyles} appElement={document.getElementById('root')}>
            {registering ?
                <div>
                    <Register/>
                    <button onClick={leaveRegistration}>Go Back</button>
                </div>
                : <div>
                    <Login invokeLogIn={invokeLogIn}/>
                    <button onClick={enterRegistration}>Register Here</button>
                </div>}
            <button onClick={closeModal}>close</button>
        </Modal>
    )
}

function Login (props) {
    const username = useFormInput('');
    const password = useFormInput('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setError(null);
        setLoading(true);
        axios.post('http://localhost:2121/user/authenticate', { username: username.value, password: password.value }).then(response => {
            setLoading(false);
            props.invokeLogIn(response.data);
            //TODO - setUserSession(response.data.token, response.data.user);
        }).catch(error => {
            setLoading(false);
            if (error.response.status === 401) setError(error.response.data.message);
            else setError("Something went wrong. Please try again later.");
        });
    }

    return (
        <div>
            Login<br /><br />
            <div>
                Username<br />
                <input type="text" onChange={username.update}/>
            </div>
            <div style={{ marginTop: 10 }}>
                Password<br />
                <input type="password" onChange={password.update}/>
            </div>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
            <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
        </div>
    )
}

function Register () {
    const username = useFormInput('');
    const password = useFormInput('');
    const email = useFormInput('');
    const firstName = useFormInput('');
    const lastName = useFormInput('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = () => {
        // TODO - Check fields for validity
        setError(null);
        setLoading(true);
        axios.post('http://localhost:2121/user/register', { username: username.value, password: password.value, email: email.value, firstName: firstName.value, lastName: lastName.value }).then(response => {
            setLoading(false);
            console.log("gaming");
            //TODO - setUserSession(response.data.token, response.data.user);
        }).catch(error => {
            setLoading(false);
            if (error.response.status === 401) setError(error.response.data.message);
            else setError("Something went wrong. Please try again later.");
        });
    }

    return (
        <div>
            Register<br /><br />
            <div>
                Username<br />
                <input type="text" onChange={username.update}/>
            </div>
            <div style={{ marginTop: 10 }}>
                Password<br />
                <input type="password" onChange={password.update}/>
            </div>
            <div style={{ marginTop: 10 }}>
                Email Address<br />
                <input type="text" onChange={email.update}/>
            </div>
            <div style={{ marginTop: 10 }}>
                First Name<br />
                <input type="text" onChange={firstName.update}/>
            </div>
            <div style={{ marginTop: 10 }}>
                Last Name<br />
                <input type="text" onChange={lastName.update}/>
            </div>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
            <input type="button" value={loading ? 'Loading...' : 'Register'} onClick={handleRegister} disabled={loading} /><br />
        </div>
    )
}

const useFormInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const updateHandler = (e) => {
        setValue(e.target.value);
    }

    return {
        value: value,
        update: updateHandler
    }
}

export default Authenticator
