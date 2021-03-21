import {React, useState, useEffect} from 'react';
import Logo from '../../img/logo.png'
import axios from 'axios'
import {BASE_URL_BACK, BASE_URL_FRONT} from '../../utils/variaveisAmbiente'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import {messages} from '../../utils/messages'

import 'react-toastify/dist/ReactToastify.min.css';
import './index.css'

const Reset = (props) => {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [name, setName] = useState('')

    //Pega os valores de password e adiciona no estado
    const onChangePass = evt => {
        setPassword(evt.target.value)
    }

    //Pega os valores de password e adiciona no estado
    const onChangePassConfirm = evt => {
        setPasswordConfirm(evt.target.value)
    }

    //Envia os dados para o backend validar
    const sendBack = (evt) => {
        evt.preventDefault()
        const uuid = props.location.pathname.split('/')[2]

        //Verifica se as senhas informadas são iguais
        if(password == passwordConfirm){
            const data = {
                password,
                hashUrl: uuid
            }
            if(password.length >= 6){
                // Neste momento é enviado a senha para o backend
                // O backend salvará a nova senha fornecida
                axios.post(`${BASE_URL_BACK}/reset`,data)
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
            }else{
                //Caso a senha não sejam iguais é apresentada a mensagem
                toast.info('A senha precisa de ter mais de 6 caracteres')
            }            
        }else{
            //Caso a senha não sejam iguais é apresentada a mensagem
            toast.info('As senhas não coincidem')
        }
            
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
                            <input type='password' value={password} onChange={onChangePass} className='form-control' placeholder='Senha' required/>
                            <div className='input-group-prepend'>
                            <span className='input-group-text'><i className='fas fa-unlock-alt'></i></span>
                            </div>
                        </div>
                        <div className='input-group mb-3'>
                            <input type='password' value={passwordConfirm} onChange={onChangePassConfirm} className='form-control' placeholder='Confirme sua senha' required/>
                            <div className='input-group-prepend'>
                            <span className='input-group-text'><i className='fas fa-unlock-alt'></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <button type='submit' className='btn btn-dark mb-2'>Alterar Senha</button>
            </form>
            <ToastContainer />
        </div>
        </div>
        </div>
    )
}

export default Reset