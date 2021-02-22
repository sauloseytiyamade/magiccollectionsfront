import React, { useEffect, useRef, useState, useContext } from 'react';
import Loading from '../Loading'
import {Link, Redirect} from 'react-router-dom'
import './index.css'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import {colors} from '../../utils/colors'
import SwampImage from '../../img/pantano_branco.svg'
import PlainsImage from '../../img/planicie_branco.svg'
import MountainImage from '../../img/montanha_branco.svg'
import IslandImage from '../../img/ilha_branco.svg'
import FlorestImage from '../../img/floresta_branco.svg'
import MultiColorImage from '../../img/multicolor_branco.svg'
import ArtifactImage from '../../img/artefato_branco.svg'
import {AuthContext} from '../../utils/auth'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios';
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { Chart } from "react-google-charts";

const Dashboard = () => {
    let {isAuth} = useContext(AuthContext)
    const token = localStorage.getItem('token')
    const {id} = jwt.decode(token) || 'error'
    const [cardsBlack, setCardsBlack] = useState(0)
    const [cardsYellow, setCardsYellow] = useState(0)
    const [cardsRed, setCardsRed] = useState(0)
    const [cardsBlue, setCardsBlue] = useState(0)
    const [cardsGreen, setCardsGreen] = useState(0)
    const [cardsMultiColor, setCardsMultiColor] = useState(0)
    const [cardsColorLess, setCardsColorLess] = useState(0)
    
    const [cardsCreature, setCardsCreature] = useState(0)
    const [cardsInstant, setCardsInstant] = useState(0)
    const [cardsSorcery, setCardsSorcery] = useState(0)
    const [cardsEnchantment, setCardsEnchantment] = useState(0)
    const [cardsPlaneswalker, setCardsPlaneswalker] = useState(0)
    const [M, setM] = useState(0)
    const [NM, setNM] = useState(0)
    const [SP, setSP] = useState(0)
    const [HP, setHP] = useState(0)
    const [DM, setDM] = useState(0)
    const [cardRarity, setCardRarity] = useState([])
    const [cardCollection, setCardCollection] = useState([])
    const [cardQuality, setCardQuality] = useState([])
    const [cardColors, setCardColors] = useState([])
    const [cardTypes, setCardTypes] = useState([])
    const [chartPercerntType, setChartPercentType] = useState([])
    const [chartRarityVsQuality, setChartRarityVsQuality] = useState([])
    const [chartQualityVsQuantity, setQualityVsQuantity] = useState([])
    const [chartPercentColor, setChartPercentColor] = useState([])
    const [arrayColor, setArrayColor] = useState([])
    const [comum, setComum] = useState(0)
    const [incomum, setIncomum] = useState(0)
    const [rara, setRara] = useState(0)
    const [lendaria, setLendaria] = useState(0)
    const refLoading = useRef()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardrarities/`,configAxios)
        .then(resp => {
                setCardRarity(resp.data.rarity)
            })

        axios.get(`${BASE_URL_BACK}/cardqualities/`,configAxios)
        .then(resp => {
                setCardQuality(resp.data.quality)
            })

        axios.get(`${BASE_URL_BACK}/cardcolors/`,configAxios)
        .then(resp => {
                setCardColors(resp.data.color)
            })

        axios.get(`${BASE_URL_BACK}/cardtypes/`,configAxios)
        .then(resp => {
                setCardTypes(resp.data.type)
            })
        
        axios.get(`${BASE_URL_BACK}/collections/${id}`,configAxios)
        .then(resp => {
                setCardCollection(resp.data)
            })
    },[])

    useEffect(() => {
        const arrTypes = []
        _.map(cardTypes, data => {
            const count = _.reduce(_.map(_.filter(cardCollection, {'card_type': data.type}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0
            arrTypes.push([data.type, count])
        })

        setChartPercentType(_.sortBy(arrTypes, data => {
            return -data[1]
        }))
    }, [cardCollection, cardTypes])

    useEffect(() => {
        const arrColors = []
        const colorPicker = []
        _.map(cardColors, data => {
            const count = _.reduce(_.map(_.filter(cardCollection, {'card_color': data.color}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0
            arrColors.push([data.color, count])
        })
        setChartPercentColor(_.sortBy(arrColors, data => {
            return -data[1]
        }))
    }, [cardCollection, cardColors])

    useEffect(() => {
        const arrQuality = []
        _.map(cardQuality, data => {
            const count = _.reduce(_.map(_.filter(cardCollection, {'quality': data.quality}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0
            arrQuality.push([data.quality, count])
            
        })
            setQualityVsQuantity(_.sortBy(arrQuality, data => {
                return -data[1]
            }))

    }, [cardCollection, cardQuality])

    useEffect(() => {
        const arrRarity = []
        _.map(cardRarity, data => {
            const count = _.reduce(_.map(_.filter(cardCollection, {'rarity': data.rarity}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0
            arrRarity.push([data.rarity, count])       
        })

        setChartRarityVsQuality(_.sortBy(arrRarity, data => {
            return -data[1]
        }))
    }, [cardCollection, cardRarity])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/collections/${id}`,configAxios)
        .then(resp => {
            setCardsBlack(_.reduce(_.map(_.filter(resp.data, {'card_color':'Preto'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsYellow(_.reduce(_.map(_.filter(resp.data, {'card_color':'Branco'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsRed(_.reduce(_.map(_.filter(resp.data, {'card_color':'Vermelho'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsBlue(_.reduce(_.map(_.filter(resp.data, {'card_color':'Azul'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsGreen(_.reduce(_.map(_.filter(resp.data, {'card_color':'Verde'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsMultiColor(_.reduce(_.map(_.filter(resp.data, {'card_color':'Multicolor'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsColorLess(_.reduce(_.map(_.filter(resp.data, {'card_color':'Incolor'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            refLoading.current.executeLoading()
        })
        .catch(err => {
            toast.info(messages(err.response.data.message))
            if(err.response.data.message == 'Token invalid'){
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

    const modifyColors = (arr) => {
        const arrColorsModify = []
        _.map(arr, data => {
            arrColorsModify.push(colors(data[0]))
        })
        return arrColorsModify
    }

    return(
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                <div className="col-12 mt-2">
                    <h1>Dashboard</h1>
                </div>
                </div>

                <div className="row">
                <div className="col-lg-3 col-12">
                    <div className="info-box mb-3 bg-black">
                    <div className="info-box-content">
                        <span className="info-box-number"><h1 className="text-white text-bold">{cardsBlack}</h1></span>
                        <span className="info-box-text"><h4 className="text-white text-bold">{cardsBlack > 1 ? 'Cartas' : 'Carta'}</h4></span>
                    </div>
                        <span className="info-box-icon"><img src={SwampImage} alt=""/></span>
                    </div>
                </div>
                <div className="col-lg-3 col-12">
                    <div className="info-box mb-3 bg-warning">
                    <div className="info-box-content">
                        <span className="info-box-number"><h1 className="text-white text-bold">{cardsYellow}</h1></span>
                        <span className="info-box-text"><h4 className="text-white text-bold">{cardsYellow > 1 ? 'Cartas' : 'Carta'}</h4></span>
                    </div>
                        <span className="info-box-icon"><img src={PlainsImage} alt=""/></span>
                    </div>
                </div>
                <div className="col-lg-3 col-12">
                    <div className="info-box mb-3 bg-danger">
                    <div className="info-box-content">
                        <span className="info-box-number"><h1 className="text-white text-bold">{cardsRed}</h1></span>
                        <span className="info-box-text"><h4 className="text-white text-bold">{cardsRed > 1 ? 'Cartas' : 'Carta'}</h4></span>
                    </div>
                        <span className="info-box-icon"><img src={MountainImage} alt=""/></span>
                    </div>
                </div>
                <div className="col-lg-3 col-12">
                    <div className="info-box mb-3 bg-primary">
                    <div className="info-box-content">
                        <span className="info-box-number"><h1 className="text-white text-bold">{cardsBlue}</h1></span>
                        <span className="info-box-text"><h4 className="text-white text-bold">{cardsBlue > 1 ? 'Cartas' : 'Carta'}</h4></span>
                    </div>
                        <span className="info-box-icon"><img src={IslandImage} alt=""/></span>
                    </div>
                </div>
                <div className="col-lg-3 col-12">
                    <div className="info-box mb-3 bg-success">
                    <div className="info-box-content">
                        <span className="info-box-number"><h1 className="text-white text-bold">{cardsGreen}</h1></span>
                        <span className="info-box-text"><h4 className="text-white text-bold">{cardsGreen > 1 ? 'Cartas' : 'Carta'}</h4></span>
                    </div>
                        <span className="info-box-icon"><img src={FlorestImage} alt=""/></span>
                    </div>
                </div>
                <div className="col-lg-3 col-12">
                    <div className="info-box mb-3 bgMultiColor">
                    <div className="info-box-content">
                        <span className="info-box-number"><h1 className="text-white text-bold">{cardsMultiColor}</h1></span>
                        <span className="info-box-text"><h4 className="text-white text-bold">{cardsMultiColor > 1 ? 'Cartas' : 'Carta'}</h4></span>
                    </div>
                        <span className="info-box-icon"><img src={MultiColorImage} alt=""/></span>
                    </div>
                </div>
                <div className="col-lg-3 col-12">
                    <div className="info-box mb-3 bg-secondary">
                    <div className="info-box-content">
                        <span className="info-box-number"><h1 className="text-white text-bold">{cardsColorLess}</h1></span>
                        <span className="info-box-text"><h4 className="text-white text-bold">{cardsColorLess > 1 ? 'Cartas' : 'Carta'}</h4></span>
                    </div>
                        <span className="info-box-icon"><img src={ArtifactImage} alt=""/></span>
                    </div>
                </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card card-danger">
                        <div className="card-header">
                            <h3 className="card-title">Porcentagem por tipo de cartas</h3>
                            <div className="card-tools">
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart">
                                <div>
                                    <Chart
                                    chartType="PieChart"
                                    loader={<div>Carregando o gráfico</div>}
                                    data={[
                                        ['Card Type', 'Number'],
                                        ...chartPercerntType
                                    ]}
                                    options={{
                                        chartArea: { left: 0, top: 0, right: 0, bottom: 10 },
                                        legend: {position: 'right', textStyle: {fontSize: 20}}, 
                                        is3D: true,                         
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card card-danger">
                        <div className="card-header">
                            <h3 className="card-title">Porcentagem de cartas por cor</h3>
                            <div className="card-tools">
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart">
                                <div>
                                    <Chart
                                    chartType="PieChart"
                                    loader={<div>Carregando o gráfico</div>}
                                    data={[
                                        ['Card Type', 'Number'],
                                        ...chartPercentColor
                                    ]}
                                    options={{
                                        chartArea: { left: 0, top: 0, right: 0, bottom: 10 },
                                        legend: {
                                            position: 'right', 
                                            textStyle: {fontSize: 20},
                                            scrollArrows: { inactiveColor: "black", activeColor: "black" },
                                            pagingTextStyle: { color: 'black'},
                                        },
                                        is3D: true,
                                        colors: modifyColors(chartPercentColor)
                                    }}
                                    rootProps={{ 'data-testid': '2' }}
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

                <div className="row">
                <div className="col-lg-6">
                    <div className="card card-success">
                    <div className="card-header">
                        <h3 className="card-title">Qualidade vs Quantidade</h3>
                        <div className="card-tools">
                        </div>
                    </div>
                    <div className="card-body">
                        <Chart
                            chartType="ColumnChart"
                            loader={<div>Carregando o gráfico</div>}
                            data={[
                            ['Qualidade', 'Quantidade'],
                            ...chartQualityVsQuantity
                            ]}
                            options={{
                                legend: {
                                    position: 'none',
                                },
                                colors: ['black'],
                            }}
                        />
                    </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card card-success">
                    <div className="card-header">
                        <h3 className="card-title">Raridade vs Quantidade</h3>

                        <div className="card-tools">
                        </div>
                    </div>
                    <div className="card-body">
                        <Chart
                            chartType="ColumnChart"
                            loader={<div>Carregando o gráfico</div>}
                            data={[
                            ['Raridade', 'Quantidade'],
                            ...chartRarityVsQuality
                            // ['Comum', comum]
                            // ['Incomum', incomum],
                            // ['Rara', rara],
                            // ['Lendária', lendaria]
                            ]}
                            options={{
                                legend: {
                                    position: 'none',
                                },
                                colors: ['black'],
                            }}
                        />
                    </div>
                    </div>
                </div>
                </div>
                <Loading
                    ref={refLoading}
                />
                <ToastContainer />
        </section>
    )
}

export default Dashboard