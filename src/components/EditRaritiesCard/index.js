import React, { useState, useContext, useEffect } from 'react';
import {Link, useHistory, Redirect} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {AuthContext} from '../../utils/auth'
import axios from 'axios'
import {messages} from '../../utils/messages'
import _ from 'lodash'

const EditRaritiesCard = (props) => {
    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)
    const [rarity, setRarity] = useState('')
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
        axios.get(`${BASE_URL_BACK}/cardrarities`,configAxios)
            .then(resp => {
                const colorFilter = _.filter(resp.data.rarity, {'id': parseInt(id)})
                setRarity(colorFilter[0].rarity)
            })
    },[id])

    // Verifica se existe alguma alteração no formulário para salvar no estado
    const changeRarity = evt => {
        setRarity(evt.target.value)
    }

    // Salva os dados cadastrado pelo usuário
    const saveRarity = evt => {
        evt.preventDefault()

        const objRarity ={
            rarity 
        }

        axios.put(`${BASE_URL_BACK}/cardrarities/${id}`,objRarity,configAxios)
            .then(resp => {
                toast.success(messages(resp.data.message))
                setTimeout(() => {
                    history.push('/usercollection/rarities')
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
                            <h1>Editar raridade</h1>
                        </div>
                    </div>

                    <form onSubmit={saveRarity}>
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Raridade</label>
                                    <input type="text" className="form-control" value={rarity} placeholder="Digite a raridade" onChange={changeRarity} required />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <button type="submit" className="btn btn-dark mr-2">Alterar</button>
                                <Link className="btn btn-dark mr-2" to='/usercollection/rarities'>Voltar</Link>
                            </div>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </section>
        </>
    )
}

export default EditRaritiesCard