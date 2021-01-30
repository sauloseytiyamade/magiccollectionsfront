import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import { useHistory, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash'

const EditEditionCards = (props) => {

    const [card, setCard] = useState([])
    const [cardName, setCardName] = useState('')
    const [typeId, setTypeId] = useState([])
    const [cardType, setCardType] = useState([])
    const [cardColor, setCardColor] = useState([])
    const [cardEdition, setCardEdition] = useState([])
    const [cardRarity, setCardRarity] = useState([])
    const token = localStorage.getItem('token')
    const history = useHistory()
    const {id} = props.match.params
    const refCardType = useRef()
    const refCardColor = useRef()
    const refCardEdition = useRef()
    const refCardRarity = useRef()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {

        axios.get(`${BASE_URL_BACK}/cards`,configAxios)
            .then(resp => {
                setCardName(_.filter(resp.data, {'id': parseInt(id)})[0].card_name)
                setCard(_.filter(resp.data, {'id': parseInt(id)})[0])

            })
    },[id])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardtypes`,configAxios)
            .then(resp => {
                setCardType(resp.data.type)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    },[card.type_id])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardcolors`,configAxios)
            .then(resp => {
                setCardColor(resp.data.color)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    }, [card.color_id])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardeditions`,configAxios)
            .then(resp => {
                setCardEdition(resp.data.edition)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    }, [card.edition_id])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardrarities`,configAxios)
            .then(resp => {
                setCardRarity(resp.data.rarity)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    },[card.rarity_id])

    const renderCardType = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Tipo da Carta</label>
                <select className="form-control" ref={refCardType} required>
                    {card.type_id > 0 && _.orderBy(cardType,[i => i.id == card.type_id],['desc']).map(type => {
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
                    {card.color_id > 0 && _.orderBy(cardColor,[i => i.id == card.color_id],['desc']).map(color => {
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
                    {card.edition_id > 0 && _.orderBy(cardEdition,[i => i.id == card.edition_id],['desc']).map(edition => {
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
                    {card.rarity_id > 0 && _.orderBy(cardRarity,[i => i.id == card.rarity_id],['desc']).map(rarity => {
                        return(
                            <option key={rarity.id} value={rarity.id}>{rarity.rarity}</option>
                        )
                   })}
                </select>
                </div>
            </div>
        )
    }

    const handleChangeName = (evt) => {
        setCardName(evt.target.value)
    }


    const saveCard = (evt) => {
        evt.preventDefault()

        const objAddCard = {
            cardName: evt.target.cardName.value,
            cardColor_id: refCardColor.current.value,
            cardEdition_id: refCardEdition.current.value,
            cardType_id: refCardType.current.value,
            cardRarity_id: refCardRarity.current.value
        }

        axios.put(`${BASE_URL_BACK}/cards/${id}`,objAddCard,configAxios)
            .then(resp => {
                if(resp.data.message == 'card updated'){
                    toast.success(messages(resp.data.message))
                    setTimeout(() => {
                        history.push('/usercollection/editioncards')
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
                            <input type="text" name='cardName' value={cardName} onChange={handleChangeName} className="form-control" placeholder="Digite a quantidade de cartas" required />
                        </div>
                    </div>
                    {renderCardType()}
                    {renderCardColor()}
                    {renderEdition()}
                    {renderRarity()}
                    </div>
                    <div className="row">
                    <div className="col-lg-12">
                        <button type="submit" className="btn btn-dark mr-2">Atualizar</button>
                        <Link className="btn btn-dark mr-2" to='/usercollection/editioncards'>Voltar</Link>
                    </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </section>
    )
}

export default EditEditionCards