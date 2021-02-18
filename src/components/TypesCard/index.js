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

const TypesCard = () => {
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

    useEffect(() => {
        if(!isAdmin){
            return null
        }
        axios.get(`${BASE_URL_BACK}/cardtypes`, configAxios)
        .then(resp => {
            setData(resp.data.type)
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
                    }
                })

                $('#searchBarTec').on('keyup change', function () {
                    dataTable.search(this.value).draw();
                })

                refLoading.current.executeLoading()
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
    },[isAdmin])

    const renderRow = () => {
        return data.map(line => (
                <tr key={line.id}>
                    <td>{line.type}</td>
                    <td className="text-center"><Link className='link_text_pen' to={`edittypescard/${line.id}`}><i className="fas fa-pencil-alt click"></i></Link></td>
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
        axios.delete(`${BASE_URL_BACK}/cardtypes/${lineId}`,configAxios)
            .then(resp => {
                if(resp.data.message == 'type deleted'){
                    toast.success(messages(resp.data.message))
                    const filtered = data.filter(rarity => {
                        return rarity.id != lineId
                    })            
                    setData(filtered)
                    refModal.current.openModal()
                }
            })
            .catch(err => {
                //Caso dê algum erro é enviada uma mensagem para o usuário
                toast.info(messages(err.response.data.message))
            })
    }

    if (isAuth == false) {
        window.location.href = `${BASE_URL_LOGIN}`
    }

    if (isAuth == false) {
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

    return (
        <div>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 mt-2 mb-2">
                            <h1>Tipo das cartas</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-9">
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" id="searchBarTec" placeholder="Qual tipo você está procurando?" />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <i className="fas fa-search"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 mb-2 mr-0">
                            <button type="button" className="btn btn-dark mr-1"><Link className='link_text' to='/addtypescard'>Adicionar</Link></button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <table id="dataTable" className="table table-bordered table-responsive-sm table-responsive-md">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
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
                body='Deseja realmente excluir este tipo? Se excluir, todo os cards com este tipo serão removidos automaticamente'
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

export default TypesCard