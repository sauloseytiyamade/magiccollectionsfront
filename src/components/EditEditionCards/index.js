import React, { useEffect, useRef, useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import { useHistory, useParams, Link, Redirect } from 'react-router-dom';
import {AuthContext} from '../../utils/auth'
import axios from 'axios';
import _ from 'lodash'

const EditEditionCards = (props) => {
    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)
    const [card, setCard] = useState([])
    const [cardName, setCardName] = useState('')
    const [typeId, setTypeId] = useState([])
    const [cardType, setCardType] = useState([])
    const [cardColor, setCardColor] = useState([])
    const [cardEdition, setCardEdition] = useState([])
    const [idCardEdtion, setIdCardEdition] = useState()
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

    // Busca informações no backend para montar o formulário
    useEffect(() => {

        axios.get(`${BASE_URL_BACK}/cards`,configAxios)
            .then(resp => {
                setCardName(_.filter(resp.data, {'id': parseInt(id)})[0].card_name)
                setCard(_.filter(resp.data, {'id': parseInt(id)})[0])
                setCardEdition(_.filter(resp.data, {'id': parseInt(id)})[0].edition)
                setIdCardEdition(_.filter(resp.data, {'id': parseInt(id)})[0].edition_id)

            })
    },[id])

    // Busca informações no backend para montar o formulário
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardtypes`,configAxios)
            .then(resp => {
                setCardType(resp.data.type)
            })
    },[card.type_id])

    // Busca informações no backend para montar o formulário
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardcolors`,configAxios)
            .then(resp => {
                setCardColor(resp.data.color)
            })
    }, [card.color_id])

    // Busca informações no backend para montar o formulário
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardrarities`,configAxios)
            .then(resp => {
                setCardRarity(resp.data.rarity)
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
    },[card.rarity_id])

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

    

    // Renderiza o select do formulário
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

    // Renderiza o select do formulário
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

    // Renderiza o select do formulário
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

    // Verifica se existe alguma alteração no formulário para salvar no estado
    const handleChangeName = (evt) => {
        setCardName(evt.target.value)
    }


    // Salva os dados cadastrado pelo usuário
    const saveCard = (evt) => {
        evt.preventDefault()

        const objAddCard = {
            cardName: evt.target.cardName.value.trim(),
            cardColor_id: refCardColor.current.value.trim(),
            cardEdition_id: String(idCardEdtion),
            cardType_id: refCardType.current.value.trim(),
            cardRarity_id: refCardRarity.current.value.trim()
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
                    <h1>Edição de Cards</h1>
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