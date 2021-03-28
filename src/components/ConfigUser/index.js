import React, { useEffect, useState, useContext, useRef } from 'react';
import jwt from 'jsonwebtoken'
import {useHistory, Link, Redirect} from 'react-router-dom'
import {BASE_URL_BACK, BASE_URL_PHOTO, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import { toast, ToastContainer } from 'react-toastify'
import {AuthContext} from '../../utils/auth'
import Loading from '../Loading'
import axios from 'axios';
import _ from 'lodash'

const ConfigUser = () => {
    
    let {isAuth} = useContext(AuthContext)
    const token = localStorage.getItem('token')
    const {id} = jwt.decode(token) || 'error'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const refLoading = useRef()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // Busca informações no backend para montar a tela
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/users`,configAxios)
        .then(resp => {
            const user = _.filter(resp.data, {'id': id})
            const name = user[0].name
            const email = user[0].email
            setName(name)
            setEmail(email)
            refLoading.current.executeLoading()
        })
        .catch(err => {
            try{
                if(token != 'sair'){
                    toast.info(messages(err.response.data.message))
                }
                if(err.response.data.message == 'Token invalid'){
                    setTimeout(() => {
                        window.location.href = `${BASE_URL_LOGIN}`
                    }, 5000);
                }
            }catch(err){
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages('Ops'))
            }
        })
    },[id])

    // Verifica se o usuário está autenticado
    if (isAuth == false) {
        window.location.href = `${BASE_URL_LOGIN}`
    }

    if (isAuth == false) {
        return null
    }

    // Verifica se existe alguma alteração no formulário para salvar no estado
    const changeName = evt => {
        setName(evt.target.value)
    }

    // Verifica se existe alguma alteração no formulário para salvar no estado
    const changeNameFile = evt => {
        const label = document.querySelector('.custom-file-label')
        label.innerHTML = evt.target.files[0].name
    }

    // Salva os dados cadastrado pelo usuário
    const saveUser = (evt) => {
        evt.preventDefault()
        refLoading.current.executeLoading()
        if(evt.target[1].files[0]){
            const formData = new FormData()
            formData.append('img', evt.target[1].files[0])

            axios.post(`${BASE_URL_BACK}/upload`,formData,configAxios)
            .then(resp => {
                    refLoading.current.executeLoading()
                    const objUser = {
                        name,
                        photo: `${BASE_URL_PHOTO}/${resp.data.filename}`,                    
                    }
                    axios.put(`${BASE_URL_BACK}/users/${email}`,objUser,configAxios)
                    .then(resp => {
                        toast.success(messages(resp.data.message))
                        setTimeout(() => {
                            document.location.reload()
                        }, 5000);
                    })
                    .catch(err => {
                        //Caso dê algum erro é enviada uma mensagem para o usuário
                        toast.info(messages(err.response.data.message))
                    })
                })
            .catch(err => {
                if(err.response.data.indexOf('file not supported') != -1){
                    toast.info('Arquivo não suportado')
                    setTimeout(() => {
                        document.location.reload()
                    }, 5000);
                }else{
                    //Caso dê algum erro é enviada uma mensagem para o usuário
                    toast.info(messages(err.response.data.message))
                }
            })
        }else{
            const objUser = {
                name                 
            }
            axios.put(`${BASE_URL_BACK}/users/${email}`,objUser,configAxios)
            .then(resp => {
                refLoading.current.executeLoading()
                toast.success(messages(resp.data.message))                
                setTimeout(() => {
                    document.location.reload()
                }, 5000);
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
        }        

    }

    return(
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                <div className="col-12 mt-2 mb-3">
                    <h1>Configurações do Usuário</h1>
                </div>
                </div>

                <form onSubmit={saveUser}>
                    <div className="row">
                        <div className="col-lg-4 mb-5">
                            <div className="form-group">
                            <label>Nome</label>
                                <input type="text" name='nameUser' value={name} onChange={changeName} className="form-control" placeholder="Digite o seu nome" maxLength="200" required />
                            </div>
                        </div>
                        <div className="col-lg-4 mb-5">
                            <div className="form-group">
                                <label>Foto do avatar</label>
                                <div className="custom-file">
                                    <input type="file" onChange={changeNameFile} className="custom-file-input" name="img"/>
                                    <label className="custom-file-label">Escolha a foto</label>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <button type="submit" className="btn btn-dark mr-2">Alterar</button>
                            <Link className="btn btn-dark mr-2" to='/usercollection/dashboard'>Voltar</Link>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
            <Loading
                ref={refLoading}
            />
        </section>
    )
}

export default ConfigUser