import React, {useEffect, useRef, useState} from 'react';
import Loading from '../Loading'
import axios from 'axios';
import {BASE_URL_BACK, BASE_URL_API_MAGIC} from '../../utils/variaveisAmbiente'
import Birds from '../../img/aves_do_paraiso.png'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

const CardView = (props) => {

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
        
    },[urlId])

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
                        <img src={imageUrl} alt="" width='90%'/>
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