import React, { useEffect, useRef, useState, useContext } from 'react';
import Loading from '../Loading'
import './index.css'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {Link, Redirect} from 'react-router-dom'
import {AuthContext} from '../../utils/auth'
import {messages} from '../../utils/messages'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios';
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { Chart } from "react-google-charts";

const DashboardAdmin = () => {
    const token = localStorage.getItem('token')
    const [users, setUsers] = useState(0)
    const [cardEdition, setCardEdition] = useState([])
    const [cardEditionLen, setCardEdtionLen] = useState(0)
    const [card, setCard] = useState(0)
    const [dataChart, setDataChart] = useState([])
    const [threeCollection, setThreeCollection] = useState([])
    const refLoading = useRef()
    let {isAdmin} = useContext(AuthContext)
    let {isAuth} = useContext(AuthContext)

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardeditions`,configAxios)
            .then(resp => {
                setCardEdtionLen(resp.data.edition.length)
                setCardEdition(_.map(resp.data.edition, i => _.pick(i, 'id', 'edition')))
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

    useEffect(() => {
        const arrDataChart = []
        axios.get(`${BASE_URL_BACK}/cards`,configAxios)
        .then(resp => {
            _.map(_.groupBy(resp.data, 'edition_id'), (card, index) => {
                if(_.find(cardEdition, {'id': parseInt(index)}) != undefined){
                    _.find(cardEdition, {'id': parseInt(index)})['qtd'] = card.length
                }
            })
            _.map(cardEdition, (card) => {
                if(_.has(card, 'qtd') == false){
                    card['qtd'] = 0
                }
            })

            cardEdition.map(card => {
                arrDataChart.push([card.edition, card.qtd])
            })

            setDataChart(arrDataChart)
        })
    },[cardEdition])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/users`,configAxios)
            .then(resp => {
                setUsers(resp.data.length)
            })
    },[])

    useEffect(() => {
        if(!isAdmin){
            return null
        }else{
            axios.get(`${BASE_URL_BACK}/cards`,configAxios)
            .then(resp => {
                setCard(resp.data.length)
                refLoading.current.executeLoading()
            })
        }
    },[])

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/collections`,configAxios)
            .then(resp => {
                const arrObj = _.map(_.groupBy(resp.data, 'user_name'), (n) => {
                    const obj = _.pick(n[0], 'user_name')
                    const sum = _.sumBy(n, (a) => {return a.quantity})
                    obj['qtd'] = sum
                    return obj
                })

                const arrOrderBy = _.orderBy(arrObj, ['qtd'], ['desc'])

                const arrModify = []

                for (let index = 0; index < 3; index++) {
                    arrModify.push(_.valuesIn(arrOrderBy[index]))
                }

                setThreeCollection(arrModify)

            })
    },[])
    
    if(isAuth == false){
        return (
            window.location.href = `${BASE_URL_LOGIN}`
        )
    }else{
        
    }

    if(isAuth == false){
        return null
    }
    
    if(isAdmin == false){
        return (
            <Redirect to='/cards' />
        )
    }else{
        
    }

    if(isAdmin == false){
        return null
    }

    return(
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                <div className="col-12 mt-2">
                    <h1>Dashboard Admin</h1>
                </div>
                </div>

                <div className="d-flex justify-content-center">
                    <div className="col-lg-3 col-12">
                        <div className="info-box mb-3 bg-primary">
                        <div className="info-box-content">
                            <span className="info-box-number"><h1 className="text-white text-bold">{users}</h1></span>
                            <span className="info-box-text"><h4 className="text-white text-bold">{users > 1 ? 'Usuários' : 'Usuário'}</h4></span>
                        </div>
                            <span className="info-box-icon"><i className="fas fa-users iconDashboardAdmin mr-3"></i></span>
                        </div>
                    </div>
                    <div className="col-lg-3 col-12">
                        <div className="info-box mb-3 bg-success">
                        <div className="info-box-content">
                            <span className="info-box-number"><h1 className="text-white text-bold">{cardEditionLen}</h1></span>
                            <span className="info-box-text"><h4 className="text-white text-bold">{cardEditionLen > 1 ? 'Edições' : 'Edição'}</h4></span>
                        </div>
                            <span className="info-box-icon"><i className="fas fa-wallet iconDashboardAdmin mr-3"></i></span>
                        </div>
                    </div>
                    <div className="col-lg-3 col-12">
                        <div className="info-box mb-3 bg-warning">
                        <div className="info-box-content">
                            <span className="info-box-number"><h1 className="text-white text-bold">{card}</h1></span>
                            <span className="info-box-text"><h4 className="text-white text-bold">{card > 1 ? 'Cartas' : 'Carta'}</h4></span>
                        </div>
                            <span className="info-box-icon"><i className="fab fa-wizards-of-the-coast text-white iconDashboardAdmin mr-3"></i></span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card card-danger">
                        <div className="card-header">
                            <h3 className="card-title">Cartas por edição</h3>
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
                                        ...dataChart
                                    ]}
                                    options={{
                                        chartArea: { left: 0, top: 0, right: 0, bottom: 10 },
                                        legend: {position: 'right', textStyle: {fontSize: 20}}, 
                                        is3D: true,  
                                        legend: {
                                            textStyle: {fontSize: 20},
                                            scrollArrows: { inactiveColor: "black", activeColor: "black" },
                                            pagingTextStyle: { color: 'black'},
                                        }                                     
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                    <div className="card card-success">
                    <div className="card-header">
                        <h3 className="card-title">Top 3 maiores coleções</h3>
                        <div className="card-tools">
                        </div>
                    </div>
                    <div className="card-body">
                        <Chart
                            chartType="ColumnChart"
                            loader={<div>Carregando o gráfico</div>}
                            data={[
                                ['Pessoa', 'Cards'],
                                ...threeCollection                            
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
            </div>
                <Loading
                ref={refLoading}
                />   
            <ToastContainer />         
        </section>
    )
}

export default DashboardAdmin