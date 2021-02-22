import React, { useEffect, useRef, useState, useContext } from 'react'
import './index.css'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios';
import {messages} from '../../utils/messages'
import {AuthContext} from '../../utils/auth'
import {toast, ToastContainer } from 'react-toastify'
import Modals from '../Modals'
import _ from 'lodash'
import $ from 'jquery'


const EditionCards = () => {
    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)
    const [cardEditions, setCardEditions] = useState([])
    const [cardFilterEdition, setCardFilterEdition] = useState([])
    const [idEdition, setIdEdition] = useState()
    const [lineId, setLineId] = useState()
    const [hiddenCards, setHiddensCard] = useState(true)
    const token = localStorage.getItem('token')
    const refEdition = useRef()
    const refModal = useRef()
    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/cardeditions`,configAxios)
            .then(resp => {
                setCardEditions(resp.data.edition)
                let dataTable = $('#dataTableEditionCards').DataTable({
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
                    },
                    buttons: [
                        { 
                            extend: 'pdfHtml5',
                            customize: function(doc) {
                                doc.styles.tableBodyEven.alignment = 'center';
                                doc.styles.tableBodyOdd.alignment = 'center'; 
                            },
                            exportOptions:{
                                columns: [0,1,2,3,4,5,6,7]
                            }
                        },
                        { 
                            extend: 'excel',
                            exportOptions:{
                                columns: [0,1,2,3,4,5,6,7]
                            }
                        }
                    ]
                })

                $('#searchBarTec').on('keyup change', function () {
                    dataTable.search(this.value).draw()
                })

                $('#exportExcel').on('click', function() {
                    dataTable.button('.buttons-excel').trigger()
                })

                $('#exportPdf').on('click', function() {
                    dataTable.button('.buttons-pdf').trigger()
                })
            })
            .catch(err => {
                toast.info(messages(err.response.data.message))
                if(err.response.data.message == 'Token invalid'){
                    setTimeout(() => {
                        window.location.href = `${BASE_URL_LOGIN}`
                    }, 5000);
                }
            })
    
    }, [])

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
    }

    if(isAdmin == false){
        return null
    }

    const handleChangeOptions = (e) => {
        if(e.target.value == 'Selecione uma edição'){
            setIdEdition(null)
            setHiddensCard(true)
        }else{
            setHiddensCard(false)
            const idEdition = refEdition.current.value
            setIdEdition(idEdition)
            axios.get(`${BASE_URL_BACK}/cards`,configAxios)
            .then(resp => {
                $('#dataTableEditionCards').DataTable().destroy()
                setCardFilterEdition(_.filter(resp.data, {'edition_id': parseInt(idEdition)}))
                let dataTable = $('#dataTableEditionCards').DataTable({
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
                    },
                    buttons: [
                        { 
                            extend: 'pdfHtml5',
                            customize: function(doc) {
                                doc.styles.tableBodyEven.alignment = 'center';
                                doc.styles.tableBodyOdd.alignment = 'center'; 
                            },
                            exportOptions:{
                                columns: [0,1,2,3,4,5,6,7]
                            }
                        },
                        { 
                            extend: 'excel',
                            exportOptions:{
                                columns: [0,1,2,3,4,5,6,7]
                            }
                        }
                    ]
                })

                $('#searchBarTec').on('keyup change', function () {
                    dataTable.search(this.value).draw()
                })

                $('#exportExcel').on('click', function() {
                    dataTable.button('.buttons-excel').trigger()
                })

                $('#exportPdf').on('click', function() {
                    dataTable.button('.buttons-pdf').trigger()
                })
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
        }
    }

    const renderEditions = () => {
        return(
            <div className="col-lg-4 mt-3">
                <div className="form-group">
                <label>Selecione a edição</label>
                <select className="form-control" ref={refEdition} onChange={e => handleChangeOptions(e)} required>
                    <option>Selecione uma edição</option>
                    {cardEditions.map(edition => {
                        return(
                            <option key={edition.id} value={edition.id}>{edition.edition}</option>
                        )
                    })}
                </select>
                </div>
            </div>
        )
    }

    const renderRow = () => {
        return cardFilterEdition.map(line => (
                <tr key={line.id}>
                    <td>{line.card_name}</td>
                    <td className="text-center">{line.card_type}</td>
                    <td className="text-center">{line.card_color}</td>
                    <td className="text-center">{line.edition}</td>
                    <td className="text-center">{line.rarity}</td>
                    <td className="text-center"><Link className='link_text_pen' to={`/editioncards/${line.id}`}><i className="fas fa-pencil-alt click"></i></Link></td>
                    <td className="text-center"><i className="fas fa-trash-alt click" onClick={() => openModal(line.id)}></i></td>
                </tr>
            )
        )
    }

    const openModal = (id) => {
        setLineId(id)
        refModal.current.openModal()
    }

    const deleteItem = () => {
        axios.delete(`${BASE_URL_BACK}/cards/${lineId}`,configAxios)
            .then(resp => {
                if(resp.data.message == 'card deleted'){
                    toast.success(messages(resp.data.message))
                    const filtered = cardFilterEdition.filter(cards => {
                        return cards.id != lineId
                    })            
                    setCardFilterEdition(filtered)
                    refModal.current.openModal()
                }
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    }

    const saveNewEdition = (evt) => {
        evt.preventDefault()
        const objAddEdtion = {
            'edition': evt.target.newEdition.value.trim(),
            'code': evt.target.codeNewEdition.value.trim()
        }

        axios.post(`${BASE_URL_BACK}/cardeditions`,objAddEdtion,configAxios)
            .then(resp => {
                toast.success(messages(resp.data.message))
                axios.get(`${BASE_URL_BACK}/cardeditions`,configAxios)
                    .then(resp => {
                        setCardEditions(resp.data.edition)
                    })

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
                    <h1>Edições e Cards</h1>
                    </div>
                </div>
                <div className="row">
                    {renderEditions()}
                    <div className="col-lg-4 mt-5">                
                        <button type="button" data-toggle="collapse" href="#addNewEdition" className="btn btn-dark mb-3">Nova Edição</button>
                    </div>
                </div>

                <form onSubmit={saveNewEdition}>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="collapse multi-collapse" id="addNewEdition">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <input type="text" name='newEdition' className="form-control mb-3" placeholder="Qual o nome da edição?" required />
                                    </div>
                                    <div className="col-lg-6">
                                        <input type="text" name='codeNewEdition' className="form-control mb-3" placeholder="Qual o código da edição?" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="collapse multi-collapse" id="addNewEdition">
                                <button type="submit" className="btn btn-dark mr-2">Salvar</button>
                                <a href="https://pt.wikipedia.org/wiki/Expans%C3%B5es_de_Magic:_The_Gathering" target='_blank'><i className="fas fa-question-circle text-primary helpme" title='Código da edição'></i></a>
                            </div>
                        </div>
                    </div>
                </form>

                <hr className="mb-4"></hr>

                <div hidden={hiddenCards}>
                    <div className="row">
                        <div className="col-12 mt-2 mb-3">
                        <h1>Cards</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-11">
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" id="searchBarTec" placeholder="Qual carta você está procurando?" />
                                <div className="input-group-append">
                                <div className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-1 mb-2">
                            <Link className={idEdition ? 'btn btn-dark' : 'btn btn-dark disabled'} to={`/addeditioncards/${idEdition}`}>Adicionar</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                        <div className="col-lg-12">
                            <table id="dataTableEditionCards" className="table table-bordered table-responsive-sm table-responsive-md">
                            <thead>
                            <tr>
                                <th>Nome</th>
                                <th className="text-center">Tipo</th>
                                <th className="text-center">Cor</th>
                                <th className="text-center">Edição</th>
                                <th className="text-center">Raridade</th>
                                <th className="text-center">Editar</th>
                                <th className="text-center">Remover</th>
                            </tr>
                            </thead>
                            <tbody>
                                {renderRow()}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
           </div>
           <ToastContainer />
           <Modals 
                title='Exclusão de card'
                body='Deseja realmente excluir este card? Se você fizer isso, este card será removido de todos os usuários'
                nameButton='Excluir'
                deleteItem={deleteItem}
                ref={refModal}
            />
        </section>
    )
}

export default EditionCards
