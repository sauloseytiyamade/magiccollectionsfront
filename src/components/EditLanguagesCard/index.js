import React, { useState, useContext, useEffect } from 'react';
import {Link, useHistory, Redirect} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {AuthContext} from '../../utils/auth'
import axios from 'axios'
import {messages} from '../../utils/messages'
import _ from 'lodash'

const EditLanguagesCard = (props) => {
    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)
    const [language, setLanguage] = useState('')
    const token = localStorage.getItem('token')
    const history = useHistory()
    const {id} = props.match.params

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // Busca informações no backend para montar o formulário
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardlanguages`,configAxios)
            .then(resp => {
                const colorFilter = _.filter(resp.data.language, {'id': parseInt(id)})
                setLanguage(colorFilter[0].language)
            })
    },[id])

    // Verifica se existe alguma alteração no formulário para salvar no estado
    const changeLanguage = evt => {
        setLanguage(evt.target.value)
    }

    // Salva as informações no backend
    const saveLanguage = evt => {
        evt.preventDefault()

        const objLanguage ={
            language 
        }

        axios.put(`${BASE_URL_BACK}/cardlanguages/${id}`,objLanguage,configAxios)
            .then(resp => {
                console.log(resp.data);
                toast.success(messages(resp.data.message))
                setTimeout(() => {
                    history.push('/languages')
                }, 5000);
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                console.log({err});
                toast.info(messages(err.response.data.message))
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
            <Redirect to='/cards' />
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
                            <h1>Editar linguagem</h1>
                        </div>
                    </div>

                    <form onSubmit={saveLanguage}>
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Linguagem</label>
                                    <input type="text" className="form-control" value={language} placeholder="Digite a linguagem" onChange={changeLanguage} required />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <button type="submit" className="btn btn-dark mr-2">Alterar</button>
                                <Link className="btn btn-dark mr-2" to='/languages'>Voltar</Link>
                            </div>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </section>
        </>
    )
}

export default EditLanguagesCard