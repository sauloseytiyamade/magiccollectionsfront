import React, { useContext, useEffect, useRef, useState } from 'react';
import {Link} from 'react-router-dom'
import './index.css'
import axios from 'axios'
import {BASE_URL_BACK} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import { toast, ToastContainer } from 'react-toastify'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../../utils/auth'
import jwt from 'jsonwebtoken'
import $ from 'jquery'
import Modals from '../Modals'
import Loading from '../Loading'

const Cards = () => {
    let {isAuth} = useContext(AuthContext)
    const history = useHistory()
    const [data, setData] = useState([])
    const token = localStorage.getItem('token')
    const [lineId, setLineId] = useState()
    const refModal = useRef()
    const refLoading = useRef()
    
    useEffect(() => {
        try{
            const configAxios = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
    
            const {id} = jwt.decode(token)
    
            axios.get(`${BASE_URL_BACK}/collections/${id}`,configAxios)
                .then(resp => {
                    setData(resp.data)
                    $(document).ready(function(){
                        let dataTable = $('#dataTable').DataTable({
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
                            dataTable.search(this.value).draw();
                        })

                        $('#exportExcel').on('click', function() {
                            dataTable.button('.buttons-excel').trigger();
                        });

                        $('#exportPdf').on('click', function() {
                            dataTable.button('.buttons-pdf').trigger();
                        });

                        refLoading.current.executeLoading()
                    })
                })
                .catch(err => {
                    if(err.response.data.error == 'token invalid'){
                        history.push('/login')
                    }
                })
                    

        }catch(err){
            history.push('/login')
        }

    },[])

    if(isAuth == false){
        history.push('/login')
    }

    const deleteItem = () => {
        const configAxios = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.delete(`${BASE_URL_BACK}/collections/${lineId}`,configAxios)
            .then(resp => {
                if(resp.data.message == 'card collection deleted'){
                    toast.success(messages(resp.data.message))
                    const filtered = data.filter(cards => {
                        return cards.id != lineId
                    })            
                    setData(filtered)
                    refModal.current.openModal()
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const renderRow = () => {
        return data.map(line => (
                <tr key={line.id}>
                    <td>{line.card_name}</td>
                    <td className="text-center">{line.card_type}</td>
                    <td className="text-center">{line.card_color}</td>
                    <td className="text-center">{line.edition}</td>
                    <td className="text-center">{line.rarity}</td>
                    <td className="text-center">{line.quality}</td>
                    <td className="text-center">{line.language}</td>
                    <td className="text-center">{line.quantity}</td>
                    <td className="text-center"><Link className='link_text_pen' to={`/usercollection/cardview/${line.id}`}><i className="fas fa-eye click"></i></Link></td>
                    <td className="text-center"><Link className='link_text_pen' to={`/usercollection/editcard/${line.id}`}><i className="fas fa-pencil-alt click"></i></Link></td>
                    <td className="text-center"><i className="fas fa-trash-alt click" onClick={() => openModal(line.id)}></i></td>
                </tr>
            )
        )
    }

    const openModal = (id) => {
        setLineId(id)
        refModal.current.openModal()
    }

    return(
        <div>
            
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                    <div className="col-12 mt-2 mb-2">
                        <h1>Minha Coleção</h1>
                    </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-lg-9">
                            <div className="input-group mb-3">
                            <input type="email" className="form-control" id="searchBarTec" placeholder="Qual carta você está procurando?" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                <i className="fas fa-search"></i>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-lg-3 mb-2 mr-0">
                            <button type="button" className="btn btn-dark mr-1"><Link className='link_text' to='/usercollection/addcard'>Adicionar</Link></button>
                            <button type="button" className="btn btn-dark mr-1" id='exportPdf'>PDF</button>
                            <button type="button" className="btn btn-dark mr-1" id='exportExcel'>Excel</button>
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-lg-12">
                        <table id="dataTable" className="table table-bordered table-responsive-sm table-responsive-md">
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th className="text-center">Tipo</th>
                            <th className="text-center">Cor</th>
                            <th className="text-center">Edição</th>
                            <th className="text-center">Raridade</th>
                            <th className="text-center">Qualidade</th>
                            <th className="text-center">Idioma</th>
                            <th className="text-center">Quantidade</th>
                            <th className="text-center">Visualizar</th>
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
            </section>
            <ToastContainer />
            <Modals 
                title='Exclusão de card'
                body='Deseja realmente excluir este card?'
                nameButton='Excluir'
                deleteItem={deleteItem}
                ref={refModal}
            />
            <Loading 
                ref={refLoading}
            />
        </div>
    )
}

export default Cards