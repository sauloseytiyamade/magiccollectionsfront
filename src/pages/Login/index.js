import {React, useState, useEffect} from 'react';
import Logo from '../../img/logo.png'
import axios from 'axios'
import {BASE_URL_BACK} from '../../utils/variaveisAmbiente'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import {handlerError} from '../../utils/errors'
import {Link} from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.min.css';
import './index.css'

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onChangeMail = evt => {
        setEmail(evt.target.value)
    }

    const onChangePass = evt => {
        setPassword(evt.target.value)
    }

    const sendBack = (evt) => {
        evt.preventDefault()

        const data = {
            email,
            password
        }
        axios.post(`${BASE_URL_BACK}/login`,data)
        .then(resp => {
            toast.success('Seja Bem-Vindo(a)!!!')
            localStorage.setItem('token', resp.data.token)
        })
        .catch(err => {
            toast.info(handlerError(err.response.data.message))
        })
    }

    return(
        <div className='wrapper'>
        <div className='row text-center contentLogin'>
        <div className='col-md-6 offset-md-3 col-10 offset-1'>
            <img src={Logo} className='img-fluid' alt='Logo Magic Collections'/>
            <form onSubmit={sendBack}>
                <div className='row'>
                    <div className='col-md-6 offset-md-3 col-10 offset-1'>
                    <div className='input-group mb-3'>
                        <input type='text' name='email' value={email} onChange={onChangeMail} className='form-control' placeholder='E-mail' autoFocus required />
                        <div className='input-group-prepend'>
                        <span className='input-group-text'><i className='fas fa-envelope'></i></span>
                        </div>
                    </div>
                    <div className='input-group mb-3'>
                        <input type='password' value={password} onChange={onChangePass} className='form-control' placeholder='Senha' required/>
                        <div className='input-group-prepend'>
                        <span className='input-group-text'><i className='fas fa-unlock-alt'></i></span>
                        </div>
                    </div>
                    </div>
                </div>
                <button type='submit' className='btn btn-dark mb-2'>Entrar</button>
                <p>Não tem uma conta? <Link to='/register'>Crie sua conta agora!</Link></p>
            </form>
            <ToastContainer />
        </div>
        </div>
        </div>
    )
}

export default Login