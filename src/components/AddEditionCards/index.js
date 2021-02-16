import React, { useEffect, useRef, useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import {useHistory, Link, Redirect} from 'react-router-dom'
import {AuthContext} from '../../utils/auth'
import axios from 'axios';

const AddEditionCards = () => {

    let {isAuth} = useContext(AuthContext)
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
                setCardEdition(resp.data.edition)
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

    if(isAuth == false){
        return (
            <Redirect to='/login' />
        )
    }else{
        
    }
    
    if(isAuth == false){
        return null
    }

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

    const renderEdition = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Edição da Carta</label>
                <select className="form-control" ref={refCardEdition} required>
                   {cardEdition.map(edition => {
                        return(
                            <option key={edition.id} value={edition.id}>{edition.edition}</option>
                        )
                   })}
                </select>
                </div>
            </div>
        )
    }

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


    const saveCard = (evt) => {
        evt.preventDefault()

        const objAddCard = {
            cardName: evt.target.cardName.value.trim(),
            cardColor_id: refCardColor.current.value.trim(),
            cardEdition_id: refCardEdition.current.value.trim(),
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
                            <input type="text" name='cardName' className="form-control" placeholder="Digite o nome da carta" required />
                        </div>
                    </div>
                    {renderCardType()}
                    {renderCardColor()}
                    {renderEdition()}
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