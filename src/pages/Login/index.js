import {React, useState,} from 'react';
import Logo from '../../img/logo.png'
import axios from 'axios'
import {BASE_URL_BACK} from '../../utils/variaveisAmbiente'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import {messages} from '../../utils/messages'
import {Link} from 'react-router-dom'
import {BASE_URL_FRONT} from '../../utils/variaveisAmbiente'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'


import 'react-toastify/dist/ReactToastify.min.css';
import './index.css'

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //Pega os valores de e-mail e adiciona no estado
    const onChangeMail = evt => {
        setEmail(evt.target.value)
    }

    //Pega os valores de password e adiciona no estado
    const onChangePass = evt => {
        setPassword(evt.target.value)
    }

    //Envia os dados para o backend validar
    const sendBack = (evt) => {
        evt.preventDefault()

        const data = {
            email,
            password
        }

        //Faz uma requisição post para o backend
        axios.post(`${BASE_URL_BACK}/login`,data)
        .then(resp => {
            //Caso o login seja feito, é gerado um token e adicionado no localstorage
            //Também é gerada uma mensagem para o usuário
            toast.success('Seja Bem-Vindo(a)!!!')
            localStorage.setItem('token', resp.data.token)
            setTimeout(() => {
                window.location.href = `${BASE_URL_FRONT}/cards`
            }, 5000);
        })
        .catch(err => {
            try{
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            }catch(err){
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages('Ops'))
            }
        })
    }

    //Esta função é utilizada para fazer login pelo google
    const responseGoogle = (resp) => {
        // Verifica se o usuário fechou a janela da autorização
        if(resp.profileObj){
            const {profileObj: {email, name, googleId}} = resp
            //Verifica se existe algum usuário com o e-mail cadastrado no sistema
        axios.get(`${BASE_URL_BACK}/users/${email}`)
        .then(resp => {
            if(resp.data.message == true){
                const data = {
                    email,
                    password: googleId,
                }
                //Se existir um usuário cadastrado no sistema ele tenta fazer o login
                //Como existe três sistemas de login, optei por apresentar uma mensagem de erro genérica.
                axios.post(`${BASE_URL_BACK}/login`,data)
                .then(resp => {
                    toast.success('Seja Bem-Vindo(a)!!!')
                    localStorage.setItem('token', resp.data.token)
                    setTimeout(() => {
                        window.location.href = `${BASE_URL_FRONT}/cards`
                    }, 5000);
                })
                .catch(err => {
                    //Caso o usuário tente fazer o login com uma conta do google e já exista um usuário com o mesmo e-mail
                    // O sistema informa que já existe usuário cadastrado
                    try{
                        //Caso dê algum erro é enviada uma mensagem para o usuário
                        toast.info('Existe um usuário em nosso sistema com este e-mail, por favor faça o login através do sistema')
                    }catch(err){
                        //Caso dê algum erro é enviada uma mensagem para o usuário
                        toast.info(messages('Ops'))
                    }
                })

            }else{
                //Se não existir nenhum e-mail cadastrado no sistema
                //O sistema cadastra o novo e-mail e já efetiva o login
               const data = {
                   name,
                   email,
                   password: googleId,
                   external_login: 1,
               } 

               //Criação do usuário no backend
               axios.post(`${BASE_URL_BACK}/users`,data)
                .then(resp => {
                    if(resp.data.message == 'user created'){
                        toast.success('Você foi cadastrado com sucesso!!! Aguarde um momento...')
                        const data = {
                            email,
                            password: googleId
                        }

                        setTimeout(() => {
                            //O sistema apresenta a mensagem do cadastro por 5 segundos e já executa o login
                            axios.post(`${BASE_URL_BACK}/login`,data)
                            .then(resp => {
                                toast.success('Seja Bem-Vindo(a)!!!')
                                localStorage.setItem('token', resp.data.token)
                                setTimeout(() => {
                                    window.location.href = `${BASE_URL_FRONT}/cards`
                                }, 5000);
                            })
                            .catch(err => {
                                try{
                                    //Caso dê algum problema aparece esta mensagem
                                    toast.info('Opsss!! Algo deu errado, tente novamente mais tarde')
                                }catch(err){
                                    //Caso dê algum erro é enviada uma mensagem para o usuário
                                    toast.info(messages('Ops'))
                                }
                                
                            })
                        }, 5000);
                    }
                })
            }
        })
        .catch(err => {
            try{
                //Caso dê algum problema aparece esta mensagem
                toast.info('Opsss!! Algo deu errado, tente novamente mais tarde')
            }catch(err){
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages('Ops'))
            }
        })
        }else{
            return null
        }
        
    }

    //Esta função é utilizad para fazer login pelo facebook
    const responseFacebook = (resp) => {
        // Verifica se o usuário fechou a janela da autorização
        if(resp.status != 'unknown'){
            const {email, name, id } = resp

            //Verifica se existe algum usuário com o e-mail cadastrado no sistema
            axios.get(`${BASE_URL_BACK}/users/${email}`)
            .then(resp => {
                if(resp.data.message == true){
                    const data = {
                        email,
                        password: id
                    }
                    //Se existir um usuário cadastrado no sistema ele tenta fazer o login
                    //Como existe três sistemas de login, optei por apresentar uma mensagem de erro genérica.
                    axios.post(`${BASE_URL_BACK}/login`,data)
                    .then(resp => {
                        toast.success('Seja Bem-Vindo(a)!!!')
                        localStorage.setItem('token', resp.data.token)
                        setTimeout(() => {
                            window.location.href = `${BASE_URL_FRONT}/cards`
                        }, 5000);
                    })
                    .catch(err => {
                        try{
                           //Caso o usuário tente fazer o login com uma conta do facebook e já exista um usuário com o mesmo e-mail
                        // O sistema informa que já existe usuário cadastrado
                        toast.info('Existe um usuário em nosso sistema com este e-mail, por favor faça o login através do sistema')
                        }catch(err){
                            //Caso dê algum erro é enviada uma mensagem para o usuário
                            toast.info(messages('Ops'))
                        }
                    })

                }else{
                    //Se não existir nenhum e-mail cadastrado no sistema
                    //O sistema cadastra o novo e-mail e já efetiva o login
                    const data = {
                        name,
                        email,
                        password: id,
                        external_login: 1,
                    } 
                    //Criação do usuário no backend
                axios.post(`${BASE_URL_BACK}/users`,data)
                    .then(resp => {
                        if(resp.data.message == 'user created'){
                            toast.success('Você foi cadastrado com sucesso!!! Aguarde um momento...')
                            const data = {
                                email,
                                password: id
                            }

                            setTimeout(() => {
                                //O sistema apresenta a mensagem do cadastro por 5 segundos e já executa o login
                                axios.post(`${BASE_URL_BACK}/login`,data)
                                .then(resp => {
                                    toast.success('Seja Bem-Vindo(a)!!!')
                                    localStorage.setItem('token', resp.data.token)
                                    setTimeout(() => {
                                        window.location.href = `${BASE_URL_FRONT}/cards`
                                    }, 5000);
                                })
                                .catch(err => {
                                    try{
                                        //Caso dê algum problema aparece esta mensagem
                                        toast.info('Existe um usuário em nosso sistema com este e-mail, por favor faça o login através do sistema')
                                     }catch(err){
                                         //Caso dê algum erro é enviada uma mensagem para o usuário
                                         toast.info(messages('Ops'))
                                     }
                                })
                            }, 5000);
                        }
                    })
                }
            })
            .catch(err => {
                try{
                    //Caso dê algum problema aparece esta mensagem
                    toast.info('Opsss!! Algo deu errado, tente novamente mais tarde')
                 }catch(err){
                     //Caso dê algum erro é enviada uma mensagem para o usuário
                     toast.info(messages('Ops'))
                 }
            })
        }else{
            return null
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
                <div>
                    <button type='submit' className='btn btn-dark mb-2'>Entrar</button>
                </div>
                <div>
                    <GoogleLogin
                        clientId="791822174732-erldq4nsbg2sk70iv0i6p0gcm1gja3qf.apps.googleusercontent.com"
                        buttonText="Login Magic Collections"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        className="mb-2"
                    />
                </div>
                <div>
                    <FacebookLogin
                    appId="693791067965683"
                    fields="name,email,picture"
                    callback={responseFacebook} 
                    cssClass="my-facebook-button-class mb-2"
                    />
                </div>
                <p className="mb-1">Não tem uma conta? <Link to='/register'>Crie sua conta agora!</Link></p>
                <p className="mb-1">Esqueceu a senha? <Link to='/forgot'>Esqueci minha senha</Link></p>
            </form>
            <ToastContainer />
        </div>
        </div>
        </div>
    )
}

export default Login