import React, { useEffect, useContext, useState, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../utils/auth'
import { BASE_URL_BACK, BASE_URL_LOGIN } from '../../utils/variaveisAmbiente'
import { toast, ToastContainer } from 'react-toastify'
import {Link, useHistory, Redirect} from 'react-router-dom'
import {messages} from '../../utils/messages'
import Loading from '../Loading'
import Modals from '../Modals'
import $ from 'jquery'

const LanguageCard = () => {
    const [data, setData] = useState([])
    const [lineId, setLineId] = useState()
    const token = localStorage.getItem('token')
    const refLoading = useRef()
    const refModal = useRef()
    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)
    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // Busca informações no backend para montar a tela
    useEffect(() => {
        if(!isAdmin){
            return null
        }
        axios.get(`${BASE_URL_BACK}/cardlanguages`, configAxios)
        .then(resp => {
            setData(resp.data.language)
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
                    }
                })

                $('#searchBarTec').on('keyup change', function () {
                    dataTable.search(this.value).draw();
                })

                $(".dataTable").on('click','.deleteMe', function (evt) { 
                    const line = evt.target.offsetParent
                    line.style.display = 'none'
                    openModal(evt.target.dataset.id)
                });

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
    },[isAdmin])

    // Renderiza as linhas da tabela
    const renderRow = () => {
        return data.map(line => (
                <tr key={line.id}>
                    <td>{line.language}</td>
                    <td className="text-center"><Link className='link_text_pen' to={`editlanguagescard/${line.id}`}><i className="fas fa-pencil-alt click"></i></Link></td>
                    <td className="text-center"><i className="fas fa-trash-alt click deleteMe" data-id={line.id}></i></td>
                </tr>
            )
        )
    }

    // Abre uma modal quando o usuário vai deletar uma carta
    // A modal verifica se o usuário tem certeza que deseja executar a ação
    const openModal = (id) => {
        setLineId(id)
        refModal.current.openModal()
    }

    // Deleta a carta do usuário
    const deleteItem = () => {
        axios.delete(`${BASE_URL_BACK}/cardlanguages/${lineId}`,configAxios)
            .then(resp => {
                if(resp.data.message == 'language deleted'){
                    toast.success(messages(resp.data.message))
                    const filtered = data.filter(language => {
                        return language.id != lineId
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

    // Verifica se o usuário está autenticado
    if (isAuth == false) {
        window.location.href = `${BASE_URL_LOGIN}`
    }

    if (isAuth == false) {
        return null
    }

    // Verifica se o usuário é administrador
    if(isAdmin == false){
        return (
            <Redirect to='/usercollection/cards' />
        )
    }

    if(isAdmin == false){
        return null
    }

    return (
        <div>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 mt-2 mb-2">
                            <h1>Idiomas das cartas</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-9">
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" id="searchBarTec" placeholder="Qual idioma você está procurando?" />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <i className="fas fa-search"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 mb-2 mr-0">
                            <button type="button" className="btn btn-dark mr-1"><Link className='link_text' to='/usercollection/addlanguagescard'>Adicionar</Link></button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <table id="dataTable" className="table table-bordered table-responsive-sm table-responsive-md">
                                <thead>
                                    <tr>
                                        <th>Linguagem</th>
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
                body='Deseja realmente excluir este idioma? Se excluir, todo os cards com este idioma serão removidos automaticamente'
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

export default LanguageCard