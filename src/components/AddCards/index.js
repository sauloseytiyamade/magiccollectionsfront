import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import { Typeahead} from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import {messages} from '../../utils/messages'
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK} from '../../utils/variaveisAmbiente'
import {useHistory} from 'react-router-dom'
import axios from 'axios';
import _ from 'lodash'
import jwt from 'jsonwebtoken'

const AddCards = () => {

    const history = useHistory()
    const [allcards, setAllCards] = useState([])
    const [cardName, setCardName] = useState([]);
    const [cardSelected, setCardSelected] = useState('')
    const [cardQuality, setCardQuality] = useState([])
    const [cardLanguage, setCardLanguage] = useState([])
    const refQuality = useRef()
    const refLanguage = useRef()
    const [quantity, setQuantity] = useState('')
    const token = localStorage.getItem('token')
    const user = jwt.decode(token)
    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cards`,configAxios)
            .then(resp => {
                setAllCards(resp.data)
                const data = resp.data.map((cards, index, array) => {                    
                        return `${cards.card_name} - ${cards.edition}`
                })
                setCardName(data)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })

        axios.get(`${BASE_URL_BACK}/cardqualities`,configAxios)
            .then(resp => {
                setCardQuality(resp.data.quality)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })

        axios.get(`${BASE_URL_BACK}/cardlanguages`,configAxios)
            .then(resp => {
                setCardLanguage(resp.data.language)
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    }, [])

    const handleChange = (selected) => {
        setCardSelected(selected)
    }

    const renderQuality = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Qualidade da Carta</label>
                <select className="form-control" ref={refQuality} required>
                   {cardQuality.map(quality => {
                        return(
                            <option key={quality.id} value={quality.id}>{quality.quality}</option>
                        )
                   })}
                </select>
                </div>
            </div>
        )
    }

    const renderLanguage = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Idioma da Carta</label>
                <select className="form-control" ref={refLanguage} required>
                    {cardLanguage.map(language => {
                        return(
                            <option key={language.id} value={language.id}>{language.language}</option>
                        )
                   })}
                </select>
                </div>
            </div>
        )
    }

    const cardQuantity = evt => {
        setQuantity(evt.target.value)
    }

    const saveCard = evt => {
        evt.preventDefault()

        const nameArr = cardSelected[0].split('-')
        const nameArrTrim = nameArr.map(name => {
            return name.trim()
        })
        const userCardsSelected = (_.find(allcards, {card_name: nameArrTrim[0], edition: nameArrTrim[1]}));
        const qualityId = refQuality.current.value
        const languageId = refLanguage.current.value
        const userCardsSelectedId = userCardsSelected.id
        const userId = user.id
        const objAddCard = {
            user_id: userId,
            cardLanguage_id: languageId,
            cardQuality_id: qualityId,
            cards_id: userCardsSelectedId,
            quantity
        }

        axios.post(`${BASE_URL_BACK}/collections`,objAddCard,configAxios)
            .then(resp => {
                toast.success(messages(resp.data.message))
                setTimeout(() => {
                    history.push('/usercollection/cards')
                }, 5000);
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    }


    return(
        <>
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
                            <label>Tipo da Carta</label>
                            <Typeahead
                                id="cardsName"
                                onChange={(selected) => {
                                    handleChange(selected)
                                }}
                                options={cardName}
                                minLength={2}
                                inputProps={{ required: true }}
                                >
                            </Typeahead>
                        </div>
                    </div>
                    {renderQuality()}
                    {renderLanguage()}
                    <div className="col-lg-4">
                        <div className="form-group">
                        <label>Quantidade de Carta</label>
                        <input type="number" className="form-control" value={quantity} placeholder="Digite a quantidade de cartas" onChange={cardQuantity} required />
                        </div>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-lg-12">
                        <button type="submit" className="btn btn-dark">Cadastrar</button>
                    </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </section>
        </>
    )
}

export default AddCards