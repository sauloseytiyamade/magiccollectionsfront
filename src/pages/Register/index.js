import {React, useState, useEffect} from 'react';
import Logo from '../../img/logo.png'
import axios from 'axios'
import {BASE_URL_BACK, BASE_URL_FRONT} from '../../utils/variaveisAmbiente'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import {messages} from '../../utils/messages'

import 'react-toastify/dist/ReactToastify.min.css';
import './index.css'

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const onChangeMail = evt => {
        setEmail(evt.target.value)
    }

    const onChangePass = evt => {
        setPassword(evt.target.value)
    }

    const onChangeName = evt => {
        setName(evt.target.value)
    }

    const sendBack = (evt) => {
        evt.preventDefault()

        const data = {
            name,
            email,
            password
        }

        axios.get(`${BASE_URL_BACK}/users/${email}`)
            .then(resp => {
                if(resp.data.message == true){
                    toast.info('Já existe um usuário cadastrado em nosso sistema com este e-mail')
                    setTimeout(() => {
                        window.location.href = `${BASE_URL_FRONT}/login`
                    }, 5000)
                }else{
                    axios.post(`${BASE_URL_BACK}/users`,data)
                    .then(resp => {
                        if(resp.data.message == 'user created'){
                            toast.success('Cadastro realizado com sucesso!! Seja Bem-Vindo(a)!!')
                            setTimeout(() => {
                                window.location.href = `${BASE_URL_FRONT}/login`
                            }, 5000)
                        }
                    })
                    .catch(err => {
                        toast.info(messages(err.response.data.message))
                    })
                }
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
                        <input type='text' name='name' value={name} onChange={onChangeName} className='form-control' placeholder='Nome completo' autoFocus required />
                        <div className='input-group-prepend'>
                        <span className='input-group-text'><i className='fas fa-user'></i></span>
                        </div>
                    </div>
                    <div className='input-group mb-3'>
                        <input type='text' name='email' value={email} onChange={onChangeMail} className='form-control' placeholder='E-mail' required />
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
                <button type='submit' className='btn btn-dark mb-2'>Cadastrar-se</button>
            </form>
            <ToastContainer />
        </div>
        </div>
        </div>
    )
}

export default Login