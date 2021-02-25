import React, { useEffect, useRef, useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import {useHistory, Link, Redirect} from 'react-router-dom'
import {AuthContext} from '../../utils/auth'
import axios from 'axios';
import _ from 'lodash'

const AddEditionCards = (props) => {

    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)
    const [cardType, setCardType] = useState([])
    const [cardColor, setCardColor] = useState([])
    const [cardEdition, setCardEdition] = useState([])
    const [cardRarity, setCardRarity] = useState([])
    const token = localStorage.getItem('token')
    const refCardType = useRef()
    const refCardColor = useRef()
    const refCardEdition = useRef()
    const refCardRarity = useRef()
    const history = useHistory()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // Buscas as informações do banco de dados para montar o formulário
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardtypes`,configAxios)
            .then(resp => {
                setCardType(resp.data.type)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })

        axios.get(`${BASE_URL_BACK}/cardcolors`,configAxios)
            .then(resp => {
                setCardColor(resp.data.color)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })

        axios.get(`${BASE_URL_BACK}/cardeditions`,configAxios)
            .then(resp => {
                const filterEdition = _.filter(resp.data.edition, {'id': parseInt(props.match.params.id)})
                setCardEdition(filterEdition[0].edition)
            })
            .catch(err => {
                toast.info(messages(err.response.data.message))
                if(err.response.data.message == 'Token invalid'){
                    setTimeout(() => {
                        window.location.href = `${BASE_URL_LOGIN}`
                    }, 5000);
                }
            })

        axios.get(`${BASE_URL_BACK}/cardrarities`,configAxios)
            .then(resp => {
                setCardRarity(resp.data.rarity)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    },[])

    // Verifica se o usuário está autenticado
    if(isAuth == false){
        return (
            <Redirect to='/login' />
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

    // Renderiza o select do formulário
    const renderCardType = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Tipo da Carta</label>
                <select className="form-control" ref={refCardType} required>
                   {cardType.map(type => {
                        return(
                            <option key={type.id} value={type.id}>{type.type}</option>
                        )
                   })}
                </select>
                </div>
            </div>
        )
    }

    // Renderiza o select do formulário
    const renderCardColor = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Cor da Carta</label>
                <select className="form-control" ref={refCardColor} required>
                   {cardColor.map(color => {
                        return(
                            <option key={color.id} value={color.id}>{color.color}</option>
                        )
                   })}
                </select>
                </div>
            </div>
        )
    }

    // Renderiza o select do formulário
    const renderRarity = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Raridade da Carta</label>
                <select className="form-control" ref={refCardRarity} required>
                   {cardRarity.map(rarity => {
                        return(
                            <option key={rarity.id} value={rarity.id}>{rarity.rarity}</option>
                        )
                   })}
                </select>
                </div>
            </div>
        )
    }

    // Salva os dados que o usuário cadastrou
    const saveCard = (evt) => {
        evt.preventDefault()

        const objAddCard = {
            cardName: evt.target.cardName.value.trim(),
            cardColor_id: refCardColor.current.value.trim(),
            cardEdition_id: parseInt(props.match.params.id),
            cardType_id: refCardType.current.value.trim(),
            cardRarity_id: refCardRarity.current.value.trim()
        }

        axios.post(`${BASE_URL_BACK}/cards`,objAddCard,configAxios)
            .then(resp => {
                if(resp.data.message == 'card created'){
                    toast.success(messages(resp.data.message))
                    setTimeout(() => {
                        history.push('/editioncards')
                    }, 5000);
                }
            })
            .catch(err => {
                console.log({err});
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    }

    return(
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                <div className="col-12 mt-2 mb-3">
                    <h1>Cadastro de Cards</h1>
                </div>
                </div>

                <form onSubmit={saveCard}>
                    <div className="row">
                    <div className="col-lg-4 mb-5">
                        <div className="form-group">
                        <label>Nome da Carta</label>
                            <input type="text" name='cardName' className="form-control" placeholder="Digite o nome da carta" maxlength="200" required />
                        </div>
                    </div>
                    {renderCardType()}
                    {renderCardColor()}
                    <div className="col-lg-4 mb-5">
                        <div className="form-group">
                        <label>Edição da Carta</label>
                            <input type="text" name='cardEdition' value={cardEdition} className="form-control" disabled />
                        </div>
                    </div>
                    {renderRarity()}
                    </div>
                    <div className="row">
                    <div className="col-lg-12">
                        <button type="submit" className="btn btn-dark mr-2">Cadastrar</button>
                        <Link className="btn btn-dark mr-2" to='/editioncards'>Voltar</Link>
                    </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </section>
    )
}

export default AddEditionCards