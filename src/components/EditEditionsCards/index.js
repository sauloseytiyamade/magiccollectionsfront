import React, { useState, useContext, useEffect } from 'react';
import {Link, useHistory, Redirect} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {AuthContext} from '../../utils/auth'
import axios from 'axios'
import {messages} from '../../utils/messages'
import _ from 'lodash'

const EditEditionsCards = (props) => {
    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)
    const [edition, setEdition] = useState('')
    const [code, setCode] = useState('')
    const token = localStorage.getItem('token')
    const history = useHistory()
    const {id} = props.match.params

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardeditions`,configAxios)
            .then(resp => {
                const colorFilter = _.filter(resp.data.edition, {'id': parseInt(id)})
                const code = _.filter(resp.data.edition, {'id': parseInt(id)})
                setEdition(colorFilter[0].edition)
                setCode(colorFilter[0].code)
            })
    },[id])

    const changeEdition = evt => {
        setEdition(evt.target.value)
    }

    const changeCode = evt => {
        setCode(evt.target.value)
    }

    const saveColor = evt => {
        evt.preventDefault()

        const objLanguage ={
            edition,
            code
        }

        axios.put(`${BASE_URL_BACK}/cardeditions/${id}`,objLanguage,configAxios)
            .then(resp => {
                toast.success(messages(resp.data.message))
                setTimeout(() => {
                    history.push('/editions')
                }, 5000);
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                console.log({err});
                toast.info(messages(err.response.data.message))
            })
        
    }

    if(isAuth == false){
        return (
            window.location.href = `${BASE_URL_LOGIN}`
        )
    }else{
        
    }
    
    if(isAuth == false){
        return null
    }

    if(isAdmin == false){
        return (
            <Redirect to='/cards' />
        )
    }else{
        
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
                            <h1>Editar edição</h1>
                        </div>
                    </div>

                    <form onSubmit={saveColor}>
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Edição</label>
                                    <input type="text" className="form-control" value={edition} placeholder="Digite a linguagem" onChange={changeEdition} required />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Código</label>
                                    <input type="text" className="form-control" value={code} placeholder="Digite a linguagem" onChange={changeCode} required />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <button type="submit" className="btn btn-dark mr-2">Alterar</button>
                                <Link className="btn btn-dark mr-2" to='/editions'>Voltar</Link>
                            </div>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </section>
        </>
    )
}

export default EditEditionsCards