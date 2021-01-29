import React, { useEffect, useRef, useState } from 'react';
import Loading from '../Loading'
import './index.css'
import {BASE_URL_BACK} from '../../utils/variaveisAmbiente'
import SwampImage from '../../img/pantano_branco.svg'
import PlainsImage from '../../img/planicie_branco.svg'
import MountainImage from '../../img/montanha_branco.svg'
import IslandImage from '../../img/ilha_branco.svg'
import FlorestImage from '../../img/floresta_branco.svg'
import MultiColorImage from '../../img/multicolor_branco.svg'
import ArtifactImage from '../../img/artefato_branco.svg'
import axios from 'axios';
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { Chart } from "react-google-charts";

const Dashboard = () => {
    const token = localStorage.getItem('token')
    const {id} = jwt.decode(token)
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

            setCardsCreature(_.reduce(_.map(_.filter(resp.data, {'card_type':'Criatura'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsInstant(_.reduce(_.map(_.filter(resp.data, {'card_type':'Mágica Instântanea'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsSorcery(_.reduce(_.map(_.filter(resp.data, {'card_type':'Feitiço'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsEnchantment(_.reduce(_.map(_.filter(resp.data, {'card_type':'Encantamento'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setCardsPlaneswalker(_.reduce(_.map(_.filter(resp.data, {'card_type':'Planeswalker'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setM(_.reduce(_.map(_.filter(resp.data, {'quality':'M'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setNM(_.reduce(_.map(_.filter(resp.data, {'quality':'NM'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setSP(_.reduce(_.map(_.filter(resp.data, {'quality':'SP'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setHP( _.reduce(_.map(_.filter(resp.data, {'quality':'HP'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setDM(_.reduce(_.map(_.filter(resp.data, {'quality':'DM'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setComum(_.reduce(_.map(_.filter(resp.data, {'rarity':'Comum'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setIncomum(_.reduce(_.map(_.filter(resp.data, {'rarity':'Incomum'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setRara(_.reduce(_.map(_.filter(resp.data, {'rarity':'Rara'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            setLendaria(_.reduce(_.map(_.filter(resp.data, {'rarity':'Lendaria'}), 'quantity'), (sum,n) => {
                return sum + n
            }) || 0)

            refLoading.current.executeLoading()
        })
    },[id])

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
                                        ['Criatura', cardsCreature],
                                        ['Mágica Instântanea', cardsInstant],
                                        ['Feitiço', cardsSorcery],
                                        ['Encanamento', cardsEnchantment],
                                        ['Planeswalker', cardsPlaneswalker],
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
                                        ['Preto', cardsBlack],
                                        ['Branco', cardsYellow],
                                        ['Vermelho', cardsRed],
                                        ['Azul', cardsBlue],
                                        ['Verde', cardsGreen],
                                        ['Multicolorida', cardsMultiColor],
                                        ['Artefato', cardsColorLess],
                                    ]}
                                    options={{
                                        chartArea: { left: 0, top: 0, right: 0, bottom: 10 },
                                        legend: {
                                            position: 'right', 
                                            textStyle: {fontSize: 20},
                                            scrollArrows: { inactiveColor: "black", activeColor: "black" },
                                            pagingTextStyle: { color: 'black'},
                                        },
                                        colors: ['black','#ffc107', '#dc3545', '#007bff', '#28a745', '#a69b00', '#6c757d'],
                                        is3D: true,
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
                            ['M', M],
                            ['NM', NM],
                            ['SP', SP],
                            ['HP', HP],
                            ['DM', DM],
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
                            ['Comum', comum],
                            ['Incomum', incomum],
                            ['Rara', rara],
                            ['Lendária', lendaria]
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
        </section>
    )
}

export default Dashboard