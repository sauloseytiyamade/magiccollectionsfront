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
import GenereciImage from '../../img/generic_image.svg'
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
    const [cardRarity, setCardRarity] = useState([])
    const [cardCollection, setCardCollection] = useState([])
    const [cardQuality, setCardQuality] = useState([])
    const [cardColors, setCardColors] = useState([])
    const [cardTypes, setCardTypes] = useState([])
    const [chartPercerntType, setChartPercentType] = useState([])
    const [chartRarityVsQuality, setChartRarityVsQuality] = useState([])
    const [chartQualityVsQuantity, setQualityVsQuantity] = useState([])
    const [chartPercentColor, setChartPercentColor] = useState([])
    const refLoading = useRef()

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    
    // Carrega as informações do backend para montar a dashaboard
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
        .catch(err => {
            toast.info(messages(err.response.data.message))
            if(err.response.data.message == 'Token invalid'){
                setTimeout(() => {
                    window.location.href = `${BASE_URL_LOGIN}`
                }, 5000);
            }
        })
    },[])

    // Organiza as informações para montar o gráfico de Porcentagem por tipo de carta
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

    // Organiza as informações para montar o gráfico de Porcentagem por cor
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

    // Organiza as informações para montar o gráfico de Qualidade vs Quantidade
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

    // Organiza as informações para montar o gráfico de Raridade vs Qualidade
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

        refLoading.current.executeLoading()
    }, [cardCollection, cardRarity])

    // Verifica se o usuário está autenticado
    if(isAuth == false){
        return (
            window.location.href = `${BASE_URL_LOGIN}`
        )
    }
    
    if(isAuth == false){
        return null
    }

    // Modifica as cores dos gráficos
    const modifyColors = (arr) => {
        const arrColorsModify = []
        _.map(arr, data => {
            arrColorsModify.push(colors(data[0]))
        })
        return arrColorsModify
    }

    // Monta os cards com as suas respectivas cores
    const renderColors = () => {
        return chartPercentColor.map((cardColor, index) => (
            <div className="col-lg-3 col-12" key={index}>
                    <div className="info-box mb-3" style={{background: colors(cardColor[0])}}>
                    <div className="info-box-content">
                        <span className="info-box-number"><h1 className="text-white text-bold">{cardColor[1]}</h1></span>
                        <span className="info-box-text"><h4 className="text-white text-bold">{cardColor[1] > 1 ? 'Cartas' : 'Carta'}</h4></span>
                    </div>
                        {(cardColor[0] == 'Vermelho') || (cardColor[0] == 'Vermelha') || (cardColor[0] == 'Red') 
                            ?
                            <span className="info-box-icon"><img src={MountainImage} alt=""/></span>
                            :
                            ''
                        }
                        {(cardColor[0] == 'Preto') || (cardColor[0] == 'Preta') || (cardColor[0] == 'Black') 
                            ?
                            <span className="info-box-icon"><img src={SwampImage} alt=""/></span>
                            :
                            ''
                        }
                        {(cardColor[0] == 'Branco') || (cardColor[0] == 'Branca') || (cardColor[0] == 'Amarelo') || (cardColor[0] == 'Amarela') || (cardColor[0] == 'Yellow')
                            ?
                            <span className="info-box-icon"><img src={PlainsImage} alt=""/></span>
                            :
                            ''
                        }
                        {(cardColor[0] == 'Verde') || (cardColor[0] == 'Green')
                            ?
                            <span className="info-box-icon"><img src={FlorestImage} alt=""/></span>
                            :
                            ''
                        }
                        {(cardColor[0] == 'Blue') || (cardColor[0] == 'Azul')
                            ?
                            <span className="info-box-icon"><img src={IslandImage} alt=""/></span>
                            :
                            ''
                        }
                        {(cardColor[0] == 'Incolor') || (cardColor[0] == 'Incolores') || (cardColor[0] == 'Artefato')
                            ?
                            <span className="info-box-icon"><img src={ArtifactImage} alt=""/></span>
                            :
                            ''
                        }
                        {(cardColor[0] == 'Multicolor') || (cardColor[0] == 'Muticolores') || (cardColor[0] == 'Muticoloridas')
                            ?
                            <span className="info-box-icon"><img src={MultiColorImage} alt=""/></span>
                            :
                            ''
                        }
                        {
                            (cardColor[0] != 'Vermelho')    && 
                            (cardColor[0] != 'Vermelha')    && 
                            (cardColor[0] != 'Red')         &&
                            (cardColor[0] != 'Preto')       && 
                            (cardColor[0] != 'Preta')       && 
                            (cardColor[0] != 'Black')       &&
                            (cardColor[0] != 'Branco')      && 
                            (cardColor[0] != 'Branca')      && 
                            (cardColor[0] != 'Amarelo')     && 
                            (cardColor[0] != 'Amarela')     && 
                            (cardColor[0] != 'Yellow')      &&
                            (cardColor[0] != 'Verde')       && 
                            (cardColor[0] != 'Green')       &&
                            (cardColor[0] != 'Blue')        && 
                            (cardColor[0] != 'Azul')        &&
                            (cardColor[0] != 'Incolor')     && 
                            (cardColor[0] != 'Incolores')   && 
                            (cardColor[0] != 'Artefato')    &&
                            (cardColor[0] != 'Multicolor')  && 
                            (cardColor[0] != 'Muticolores') && 
                            (cardColor[0] != 'Muticoloridas')
                            ?
                            <span className="info-box-icon"><img src={GenereciImage} alt=""/></span>
                            :
                            ''
                        }

                    </div>
            </div>
        ))
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
                {renderColors()}
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
                                        colors: modifyColors(chartPercentColor)                       
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