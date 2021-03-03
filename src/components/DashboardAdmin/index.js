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
import $ from 'jquery'
import moment from 'moment'

const DashboardAdmin = () => {
    const token = localStorage.getItem('token')
    const [users, setUsers] = useState(0)
    const [cardEdition, setCardEdition] = useState([])
    const [cardEditionLen, setCardEdtionLen] = useState(0)
    const [card, setCard] = useState(0)
    const [dataChart, setDataChart] = useState([])
    const [threeCollection, setThreeCollection] = useState([])
    const [logs, setLogs] = useState([])
    const refLoading = useRef()
    let {isAdmin} = useContext(AuthContext)
    let {isAuth} = useContext(AuthContext)

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // Busca no backend os dados de logs para montar a tabela de logs
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/logs`,configAxios)
            .then(resp => {
                setLogs(resp.data.logs)
            })
    }, [])

    // Busca informações no backend para montar os cards de edição
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardeditions`,configAxios)
            .then(resp => {
                setCardEdtionLen(resp.data.edition.length)
                setCardEdition(_.map(resp.data.edition, i => _.pick(i, 'id', 'edition')))
                $(document).ready(function(){
                    let dataTable = $('#dataTable').DataTable({
                        "order": [[ 5, "desc" ]],
                        "responsive": true,
                        "autoWidth": false,
                        "lengthChange": false,
                        "pageLength": 10,
                        "bInfo" : false,
                        "language": {
                            "paginate": {
                              "previous": "Anterior",
                              "next": "Próxima"
                            },
                            "emptyTable": "Não existe dados para serem carregados"
                        }
                    })
    
                    $('#searchBarTec').on('keyup change', function () {
                        dataTable.search(this.value).draw();
                    })

                    refLoading.current.executeLoading()
                })
            })
            .catch(err => {
                try{
                    //Caso dê algum erro é enviada uma mensagem para o usuário
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
    },[])

    // Busca informação no backend para montar o gráfico de Cartas por edição
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


    // Busca informações no backend para montar o card de usuário
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/users`,configAxios)
            .then(resp => {
                setUsers(resp.data.length)
            })
    },[])

    // Busca informações no backend para montar o card do número total de cartas
    useEffect(() => {
        if(!isAdmin){
            return null
        }else{
            axios.get(`${BASE_URL_BACK}/cards`,configAxios)
            .then(resp => {
                setCard(resp.data.length)
            })
        }
    },[])

    // Busca informações no backend para montar o gráfico de Top 3 maiores coleções
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

    // Renderiza as linhas da tabela de logs
    const renderRow = () => {
        return logs.map(line => (
                <tr key={line.id}>
                    <td>{line.user}</td>
                    <td className="text-center">{line.logType}</td>
                    <td className="text-center">{line.lineTableId}</td>
                    <td className="text-center">{line.tableName}</td>
                    <td className="text-center"><Link className='link_text_pen' to={`logview/${line.id}`}><i className="fas fa-eye click"></i></Link></td>
                    <td className="text-center">{moment(line.dateTime).format('DD-MM-YYYY HH:mm:ss')}</td>
                </tr>
            )
        )
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
    
    // Verifica se o usuário é administrador
    if(isAdmin == false){
        return (
            <Redirect to='/usercollection/cards' />
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

                <div className="row d-flex justify-content-center">
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
                <div className="row">
                    <div className="col-lg-12">
                        <div className="input-group mb-3">
                            <input type="email" className="form-control" id="searchBarTec" placeholder="Qual log você está procurando?" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                        <div className="col-lg-12">
                            <table id="dataTable" className="table table-bordered table-responsive-sm table-responsive-md">
                                <thead className="text-center">
                                    <tr>
                                        <th>Usuário</th>                                        
                                        <th>Ação</th>                                        
                                        <th>Linha da tabela</th>                                        
                                        <th>Nome da tabela</th>
                                        <th>Último valor</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderRow()}
                                </tbody>
                            </table>
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