import React, { useEffect, useRef, useState, useContext } from 'react'
import './index.css'
import { Typeahead} from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import {messages} from '../../utils/messages'
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {AuthContext} from '../../utils/auth'
import {useHistory, Link, Redirect} from 'react-router-dom'
import axios from 'axios';
import _ from 'lodash'
import jwt from 'jsonwebtoken'

const AddCardsCollection = () => {

    let {isAuth} = useContext(AuthContext)
    const history = useHistory()
    const [allcards, setAllCards] = useState([])
    const [cardName, setCardName] = useState([]);
    const [cardSelected, setCardSelected] = useState('')
    const [cardQuality, setCardQuality] = useState([])
    const [cardLanguage, setCardLanguage] = useState([])
    const [cadastrar, setCadastrar] = useState(false)
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

    // Buscas as informações do banco de dados para montar a tela para adição de carta
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cards`,configAxios)
            .then(resp => {
                setAllCards(resp.data)
                const data = resp.data.map((cards, index, array) => {                    
                        return `${cards.card_name} | ${cards.edition}`
                })
                setCardName(data)
            })

        axios.get(`${BASE_URL_BACK}/cardqualities`,configAxios)
            .then(resp => {
                setCardQuality(resp.data.quality)
            })

        axios.get(`${BASE_URL_BACK}/cardlanguages`,configAxios)
            .then(resp => {
                setCardLanguage(resp.data.language)
            })
            .catch(err => {
                try{
                    toast.info(messages(err.response.data.message))
                    if(err.response.data.message == 'Token invalid'){
                        setTimeout(() => {
                            window.location.href = `${BASE_URL_LOGIN}`
                        }, 5000);
                    }
                }catch(err){
                    //Caso dê algum erro é enviada uma mensagem para o usuário
                    toast.info(messages('Ops'))
                }
            })
    }, [])

    // Faz alteração no cardSelected caso haja alguma mudança no formulário
    const handleChange = (selected) => {
        setCardSelected(selected)
    }

    // Ativa botão cadastrar quando o usuário clica fora do input
    const handleOnBlur = (selected) => {
        if(selected.target.value.indexOf('|') == -1){
            setCadastrar(false)
        }else{
            setCadastrar(true)
        }
    }

    // Renderiza o select do formulário
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

    // Renderiza o select do formulário
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

    // Verifica se há mudança no formulário
    const cardQuantity = evt => {
        setQuantity(evt.target.value)
    }

    // Salva as informações no backend
    const saveCard = evt => {
        evt.preventDefault()
        
        const nameArr = cardSelected[0].split('|')
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
                    history.push('/cards')
                }, 5000);
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


    return(
        <>
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                <div className="col-12 mt-2 mb-3">
                    <h1>Cadastro de cartas na sua coleção</h1>
                </div>
                </div>

                <form onSubmit={saveCard}>
                    <div className="row">
                    <div className="col-lg-4 mb-5">
                        <div className="form-group">
                        <label>Nome da Carta</label>
                            <Typeahead
                                id="cardsName"
                                onChange={(selected) => {
                                    handleChange(selected)
                                }}

                                onBlur={(selected) => {
                                    handleOnBlur(selected)
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
                        <input type="number" className="form-control" value={quantity} placeholder="Digite a quantidade de cartas" onChange={cardQuantity} required min="1" />
                        </div>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-lg-12">
                        <button type="submit" className={cadastrar ? 'btn btn-dark mr-2' : 'btn btn-dark mr-2 disabled'}>Cadastrar</button>
                        <Link className="btn btn-dark mr-2" to='/cards'>Voltar</Link>
                    </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </section>
        </>
    )
}

export default AddCardsCollection