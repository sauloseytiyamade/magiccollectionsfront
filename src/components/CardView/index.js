import React, {useEffect, useRef, useState, useContext} from 'react';
import Loading from '../Loading'
import axios from 'axios';
import {BASE_URL_BACK, BASE_URL_API_MAGIC, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {Link, Redirect} from 'react-router-dom'
import {AuthContext} from '../../utils/auth'
import BackCard from '../../img/backCard.png'
import Birds from '../../img/aves_do_paraiso.png'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

const CardView = (props) => {

    let {isAuth} = useContext(AuthContext)
    const urlId = props.match.params.id
    const token = localStorage.getItem('token')
    const {id} = jwt.decode(token)
    const [card, setCard] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const refLoading = useRef()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // Busca informações no backend e também na API do Magic The gathering para montar a tela
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/collections/${id}`,configAxios)
        .then(resp => {
            const data = _.filter(resp.data, {'id': parseInt(urlId)})
            setCard(data)

            axios.get(`${BASE_URL_API_MAGIC}?name=${data[0].card_name}&language=Portuguese (Brazil)`)
            .then(resp => {
                const data = []

                _.map(resp.data.cards, img => {
                    if(_.has(img, 'imageUrl')){
                        data.push(img)
                    }
                })

                setImageUrl(data[0].imageUrl)
                setTimeout(() => {
                    refLoading.current.executeLoading()
                }, 1000);

            })
        })
        .catch(err => {
            if(err.response.data.message == 'token invalid'){
                window.location.href = `${BASE_URL_LOGIN}`
            }
        })
        
    },[urlId])

    // Verifica se o usuário está autenticado
    if(isAuth == false){
        return (
            window.location.href = `${BASE_URL_LOGIN}`
        )
    }else{
        
    }
    
    if(isAuth == false){
        return null
    }

    return(
        <section className="content">
                <div className="container-fluid">
                    <div className="row">
                    <div className="col-12 mt-2 mb-2">
                        <h1>{card[0]?.card_name}</h1>
                    </div>
                    </div>

                    <div className="row">
                    <div className="col-lg-2">
                        <img src={imageUrl || BackCard} alt="" width='90%'/>
                    </div>
                    <div className="col-lg-10 mt-2">
                        <p><b>Nome da Carta:</b> {card[0]?.card_name}</p>
                        <p><b>Tipo da carta:</b> {card[0]?.card_type}</p>
                        <p><b>Cor da carta:</b> {card[0]?.card_color}</p>
                        <p><b>Edição da carta:</b> {card[0]?.edition}</p>
                        <p><b>Raridade da carta:</b> {card[0]?.rarity}</p>
                    </div>
                    </div>
                </div>
                <Loading 
                    ref={refLoading}
                />
            </section>

    )
}

export default CardView