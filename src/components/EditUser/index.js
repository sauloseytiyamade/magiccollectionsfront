import React, { useEffect, useRef, useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import { useHistory, useParams, Link, Redirect } from 'react-router-dom'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import {AuthContext} from '../../utils/auth'
import axios from 'axios';
import _ from 'lodash'

const EditUser = (props) => {
    let {isAuth} = useContext(AuthContext)
    const {id} = props.match.params
    const token = localStorage.getItem('token')
    const [nameUser, setNameUser] = useState('')
    const [emailUser, setEmailUser] = useState('')
    const [permissionId, setPermissionId] = useState()
    const history = useHistory()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {

        axios.get(`${BASE_URL_BACK}/users`,configAxios)
            .then(resp => {
               const user = _.filter(resp.data, {'id': parseInt(id)})
               setNameUser(user[0].name)
               setEmailUser(user[0].email)
               setPermissionId(user[0].permission)
            })
            .catch(err => {
                toast.info(messages(err.response.data.error))
                if(err.response.data.error == 'Token invalid'){
                    setTimeout(() => {
                        window.location.href = `${BASE_URL_LOGIN}`
                    }, 5000);
                }
            })
    },[id])

    if(isAuth == false){
        return (
            window.location.href = `${BASE_URL_LOGIN}`
        )
    }else{
        
    }
    
    if(isAuth == false){
        return null
    }


    const saveCard = (evt) => {
        evt.preventDefault()

        const objUser = {
            name: nameUser,
            email: emailUser,
            permission: parseInt(permissionId)
            
        }

        axios.put(`${BASE_URL_BACK}/users/${emailUser}`,objUser,configAxios)
            .then(resp => {
                if(resp.data.message == 'user updated'){
                    toast.success(messages(resp.data.message))
                    setTimeout(() => {
                        history.push('/users')
                    }, 5000);
                }
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    }

    const handlePermissionId = (evt) => {
        setPermissionId(evt.target.value)
    }

    const renderPermission = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Edição da Carta</label>
                <select className="form-control" onChange={handlePermissionId}  required>
                    {permissionId == 0 &&
                        <>
                            <option value='0'>Admin</option>
                            <option value='1'>User</option>
                        </>
                    }

                    {permissionId == 1 &&
                        <>
                            <option value='1'>User</option>
                            <option value='0'>Admin</option>
                        </>
                    }
                </select>
                </div>
            </div>
        )
    }

    const handleNameUser = (evt) =>{
        setNameUser(evt.target.value)
    }

    const handleEmailUser = (evt) =>{
        setEmailUser(evt.target.value)
    }

    return(
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                <div className="col-12 mt-2 mb-3">
                    <h1>Edição de cartas</h1>
                </div>
                </div>

                <form onSubmit={saveCard}>
                    <div className="row">
                    <div className="col-lg-4 mb-5">
                        <div className="form-group">
                        <label>Usuário</label>
                            <input type="text" name='nameUser' value={nameUser} className="form-control" onChange={handleNameUser} placeholder="Digite o seu usuário" maxLength="200" required />
                        </div>
                    </div>
                    <div className="col-lg-4 mb-5">
                        <div className="form-group">
                        <label>E-mail</label>
                            <input type="text" name='emailUser' value={emailUser} className="form-control" onChange={handleEmailUser} placeholder="Digite seu e-mail" maxLength="200" required />
                        </div>
                    </div>

                    {renderPermission()}
                    
                    </div>
                    <div className="row">
                    <div className="col-lg-12">
                        <button type="submit" className="btn btn-dark mr-2">Atualizar</button>
                        <Link className="btn btn-dark mr-2" to='/users'>Voltar</Link>
                    </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </section>
    )
}

export default EditUser