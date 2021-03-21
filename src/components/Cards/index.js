import React, { useContext, useEffect, useRef, useState } from 'react';
import {Link, useHistory} from 'react-router-dom'
import './index.css'
import axios from 'axios'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import { toast, ToastContainer } from 'react-toastify'
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
    
    // Busca informações no backend para montar a tela
    useEffect(() => {
            // Faz a configuração a autorização
            const configAxios = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            // Pega o id do usuário
            const {id} = jwt.decode(token) || 'error'

            // Busca todas as cartas do usuário    
            axios.get(`${BASE_URL_BACK}/collections/${id}`,configAxios)
                .then(resp => {
                    setData(resp.data)
                    $(document).ready(function(){
                        let dataTable = $('#dataTable').DataTable({
                            "retrieve": true,
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

                        $(".dataTable").on('click','.deleteMe', function (evt) { 
                            const hasClass = $('.dataTable').hasClass('collapsed')                            
                            if(hasClass){
                                const tr_odd = evt.target.offsetParent.parentElement.previousElementSibling
                                tr_odd.classList.remove('parent')
                                tr_odd.classList.add('odd')
                                const line = evt.target.offsetParent
                                line.style.display = 'none'
                            }
                            
                            openModal(evt.target.dataset.id)
                        });

                        // Desativa o carregamento
                        refLoading.current.executeLoading()
                    })
                })
                .catch(err => {
                    try{
                        // Caso dê erro é gerada uma mensagem e o usuário é enviado para a página de login
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

    // Verifica se o usuário está autenticado
    if(isAuth == false){
        return null
    }
    
    if(isAuth == false){
        window.location.href = `${BASE_URL_LOGIN}`
    }

    // Deleta a carta do usuário
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
                try{
                    //Caso dê algum erro é enviada uma mensagem para o usuário
                    toast.info(messages(err.response.data.message))
                }catch(err){
                    //Caso dê algum erro é enviada uma mensagem para o usuário
                    toast.info(messages('Ops'))
                }
            })
    }

    // Renderiza as linhas da tabela
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
                    <td className="text-center"><Link className='link_text_pen' to={`cardview/${line.id}`}><i className="fas fa-eye click"></i></Link></td>
                    <td className="text-center"><Link className='link_text_pen' to={`editcard/${line.id}`}><i className="fas fa-pencil-alt click"></i></Link></td>
                    <td className="text-center"><i className="fas fa-trash-alt click deleteMe" data-id={line.id}></i></td>
                </tr>
            )
        )
    }

    // Abre uma modal quando o usuário vai deletar uma cartas
    // A modal verifica se o usuário tem certeza que deseja executar a ação
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
                        <div className="table-responsive">
                            <table id="dataTable" className="table table-bordered ">
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