import React, { useState, useContext } from 'react';
import {Link, useHistory, Redirect} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {AuthContext} from '../../utils/auth'
import axios from 'axios'
import {messages} from '../../utils/messages'

const AddQualityCard = () => {
    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)
    const [quality, setQuality] = useState('')
    const token = localStorage.getItem('token')
    const history = useHistory()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // Verifica se existe alguma alteração no formulário para salvar no estado
    const changeQuality = evt => {
        setQuality(evt.target.value)
    }

    // Salva os dados cadastrado pelo usuário
    const saveQuality = evt => {
        evt.preventDefault()

        const objQuality ={
            quality
        }

        axios.post(`${BASE_URL_BACK}/cardqualities`,objQuality,configAxios)
            .then(resp => {
                toast.success(messages(resp.data.message))
                setTimeout(() => {
                    history.push('/usercollection/qualities')
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

    // Verifica se o usuário está autenticado
    if(isAuth == false){
        return (
            window.location.href = `${BASE_URL_LOGIN}`
        )
    }
    
    if(isAuth == false){
        return null
    }

    // Verifica se o usuário é administrador
    if(isAdmin == false){
        return (
            <Redirect to='/usercollection/cards' />
        )
    }

    if(isAdmin == false){
        return null
    }

    return (
        <>
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 mt-2 mb-3">
                            <h1>Cadastrar Qualidade</h1>
                        </div>
                    </div>

                    <form onSubmit={saveQuality}>
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Nome da qualidade</label>
                                    <input type="text" className="form-control" value={quality} placeholder="Digite a qualidade" onChange={changeQuality} maxLength="45" required />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <button type="submit" className="btn btn-dark mr-2">Cadastrar</button>
                                <Link className="btn btn-dark mr-2" to='/usercollection/qualities'>Voltar</Link>
                            </div>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </section>
        </>
    )
}

export default AddQualityCard