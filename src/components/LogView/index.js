import React, {useEffect, useRef, useState, useContext} from 'react';
import './index.css'
import Loading from '../Loading'
import axios from 'axios';
import {BASE_URL_BACK, BASE_URL_API_MAGIC, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {Link, Redirect} from 'react-router-dom'
import {AuthContext} from '../../utils/auth'
import BackCard from '../../img/backCard.png'
import Birds from '../../img/aves_do_paraiso.png'
import {messages} from '../../utils/messages'
import { toast, ToastContainer } from 'react-toastify'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

const LogView = (props) => {

    let {isAuth} = useContext(AuthContext)
    const urlId = props.match.params.id
    const token = localStorage.getItem('token')
    const [logUser, setLogUser] = useState([])
    const [lastValue, setLastValues] = useState()
    const refLoading = useRef()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // Busca informações no backend para montar o LogView
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/logs`,configAxios)
        .then(resp => {
            const logsFilter = _.filter(resp.data.logs, {'id': parseInt(urlId)})
            setLogUser(logsFilter)
            const lastValue = logsFilter[0].lastValue
            setLastValues(JSON.parse(lastValue))
            refLoading.current.executeLoading()
        })
        .catch(err => {
            try{
                //Caso dê algum erro é enviada uma mensagem para o usuário
                if(err.response.data.message == 'token invalid'){
                    window.location.href = `${BASE_URL_LOGIN}`
                }
            }catch(err){
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages('Ops'))
            }
           
        })
        
    },[urlId])

    // Verifica se o usuário está autenticado
    if(isAuth == false){
        return (
            window.location.href = `${BASE_URL_LOGIN}`
        )
    }
    
    if(isAuth == false){
        return null
    }

    return(
        <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 mt-2 mb-2">
                            <h1>LogView</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12 mt-2">
                            <code>
                                {<div><pre>{JSON.stringify(logUser[0], null, 2) }</pre></div>}
                            </code>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 mt-2 mb-2">
                            <h1>LastValue</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 mt-2">
                            <code>
                                {<div><pre>{JSON.stringify(lastValue, null, 2) }</pre></div>}
                            </code>
                        </div>
                    </div>
                </div>
                <Loading 
                    ref={refLoading}
                />
                <ToastContainer />
            </section>

    )
}

export default LogView