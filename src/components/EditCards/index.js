import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'
import jwt from 'jsonwebtoken'
import {BASE_URL_BACK} from '../../utils/variaveisAmbiente'
import { toast, ToastContainer } from 'react-toastify'
import {messages} from '../../utils/messages'
import _ from 'lodash'
import { useHistory, useParams, Link } from 'react-router-dom';

const EditCards = (props) => {
    const token = localStorage.getItem('token')
    const {id} = useParams()
    const history = useHistory()
    const [cardId, setCardId] = useState()
    const [cardName, setCardName] = useState()
    const [qualityId, setQualityId] = useState('')
    const [cardQuality, setCardQuality] = useState([])
    const [languageId, setLanguageId] = useState([])
    const [cardLanguage, setCardLanguage] = useState([])
    const [quantity, setQuantity] = useState('')
    const [redirectPage, setRedirectPage] = useState(false)
    const refQuality = useRef()
    const refLanguage = useRef()
    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const jwtId = jwt.decode(token)

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/collections/${jwtId.id}`,configAxios)
        .then(resp => {
            setQualityId(resp.data.filter(card => card.id == id )[0].quality_id);
            setLanguageId(resp.data.filter(card => card.id == id )[0].language_id)
            setCardName(resp.data.filter(card => card.id == id )[0].card_name)
            setQuantity(resp.data.filter(card => card.id == id )[0].quantity)
            setCardId(resp.data.filter(card => card.id == id )[0].card_id)
        })
    },[])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardlanguages`,configAxios)
            .then(resp => {
                setCardLanguage(resp.data.language)
            })
    },[languageId])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardqualities`,configAxios)
            .then(resp => {
                    setCardQuality(resp.data.quality)
            })
    },[qualityId])

    const cardQuantity = evt => {
        setQuantity(evt.target.value)
    }

    const saveCard = (evt) => {
        evt.preventDefault()
        const obj = {
            user_id: jwtId.id,
            cardLanguage_id: parseInt(refLanguage.current.value),
            cardQuality_id: parseInt(refQuality.current.value),
            cards_id: cardId,
            quantity: parseInt(quantity)
        }
        
        axios.put(`${BASE_URL_BACK}/collections/${props.match.params.id}`,obj,configAxios)
            .then(resp => {
                if(resp.data.message = "card collection updated"){
                    toast.success(messages('card collection updated'))
                    setTimeout(() => {
                        history.push('/usercollection/cards')
                    }, 5000);
                }
            })
    }

    const renderQuality = () => {
        return(
            <div className="col-lg-4 mb-5">
                <div className="form-group">
                <label>Qualidade da Carta</label>
                <select name={'quality'} className="form-control" ref={refQuality} required>
                   {qualityId > 0 && _.orderBy(cardQuality,[i => i.id == qualityId],['desc']).map(quality => {
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
                <select className="form-control" name={'language'} ref={refLanguage} required>
                    {languageId > 0 && _.orderBy(cardLanguage,[i => i.id == languageId],['desc']).map(language => {
                        return(
                            <option key={language.id} value={language.id}>{language.language}</option>
                        )
                   })}
                </select>
                </div>
            </div>
        )
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
                    <div className="col-lg-4">
                        <div className="form-group">
                        <label>Nome da Carta</label>
                        <input type="number" className="form-control" value={cardName || ''}  placeholder={cardName} disabled={true} />
                        </div>
                    </div>
                    {renderQuality()}
                    {renderLanguage()}
                    <div className="col-lg-4">
                        <div className="form-group">
                        <label>Quantidade de Carta</label>
                        <input type="number" className="form-control" value={quantity} onChange={cardQuantity} placeholder="Digite a quantidade de cartas"  required />
                        </div>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-lg-12">
                        <button type="submit" className="btn btn-dark mr-2">Atualizar</button>
                        <Link className="btn btn-dark mr-2" to='/usercollection/cards'>Voltar</Link>
                    </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </section>
        </>
    )
}

export default EditCards