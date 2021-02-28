import {React, useState, useEffect, useRef} from 'react';
import Logo from '../../img/logo.png'
import axios from 'axios'
import {BASE_URL_BACK, BASE_URL_FRONT} from '../../utils/variaveisAmbiente'
import {Link, Redirect, useHistory} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import {messages} from '../../utils/messages'

import 'react-toastify/dist/ReactToastify.min.css';
import './index.css'

const Forgot = (props) => {
    const [email, setEmail] = useState('')

    //Pega os valores de e-mail e adiciona no estado
    const onChangeMail = evt => {
        setEmail(evt.target.value)
    }

    // Esta é ação executada quando o usuário clica no botão esqueci minha senha
    const sendBack = (evt) => {
        evt.preventDefault()

        const sendButton = document.querySelector('.sendButton')
        sendButton.innerHTML = 'Aguarde...'

        const data = {
            email
        }

        // Nesta etapa o sistema envia as informações para o backend processar
        // O usuário neste momento deverá receber um e-mail
        axios.post(`${BASE_URL_BACK}/forgot`,data)
        .then(resp => {
            toast.success(messages(resp.data.message))
            setTimeout(() => {
                window.location.href = `${BASE_URL_FRONT}/login`
            }, 5000)
        })
        .catch(err => {
            try{
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
                setTimeout(() => {
                    window.location.href = `${BASE_URL_FRONT}/login`
                }, 5000)
            }catch(err){
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages('Ops'))
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
                            <input type='text' name='email' value={email} onChange={onChangeMail} className='form-control' placeholder='E-mail' required />
                            <div className='input-group-prepend'>
                            <span className='input-group-text'><i className='fas fa-envelope'></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <button type='submit' className='btn btn-dark mb-2 mr-2 sendButton'>Esqueci minha senha</button>
                <p><Link className='btn btn-dark mb-2' to='/login'>Voltar</Link></p>
            </form>
            <ToastContainer />
        </div>
        </div>
        </div>
    )
}

export default Forgot