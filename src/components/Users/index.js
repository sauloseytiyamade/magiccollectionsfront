import React, {useEffect, useState, useRef, useContext} from 'react';
import {Link, useHistory, Redirect} from 'react-router-dom'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import Modals from '../Modals'
import {messages} from '../../utils/messages'
import { toast, ToastContainer } from 'react-toastify'
import {AuthContext} from '../../utils/auth'
import _ from 'lodash'
import $ from 'jquery'
import axios from 'axios';

const Users = () => {
    const token = localStorage.getItem('token')
    const [data, setData] = useState([])
    const [lineId, setLineId] = useState()
    const refModal = useRef()
    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    let {isAuth} = useContext(AuthContext)
    let {isAdmin} = useContext(AuthContext)

    // Busca informações no backend para montar a tela
    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/users`,configAxios)
            .then(resp => {
                setData(resp.data)
                $(document).ready(function(){
                    let dataTable = $('#dataTableUser').DataTable({
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

                    $('#searchBarTecUser').on('keyup change', function () {
                        dataTable.search(this.value).draw();
                    })
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

    // Abre uma modal quando o usuário vai deletar uma carta
    // A modal verifica se o usuário tem certeza que deseja executar a ação
    const openModal = (id) => {
      setLineId(id)
      refModal.current.openModal()
    }

    // Deleta a carta do usuário
    const deleteItem = () => {
      const configAxios = {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }

      axios.get(`${BASE_URL_BACK}/users/`,configAxios)
        .then(resp => {
            const users = resp.data
            const user = _.filter(resp.data, {'id': lineId})
            const email = user[0].email
            axios.delete(`${BASE_URL_BACK}/users/${email}`,configAxios)
                .then(resp => {
                    if(resp.data.message == 'user deleted'){
                        toast.success(messages(resp.data.message))
                        const filtered = _.filter(users, (o) => {
                          return o.email != email
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
            <Redirect to='/cards' />
        )
    }

    if(isAdmin == false){
        return null
    }

    // Renderiza as linhas da tabela
    const renderRow = () => {
        return data.map(line => (
                <tr key={line.id}>
                    <td>{line.name}</td>
                    <td className="text-center">{line.email}</td>
                    <td className="text-center">{line.permission == 0 ? 'Admin' : 'User'}</td>
                    <td className="text-center"><Link className='link_text_pen' to={`/edituser/${line.id}`}><i className="fas fa-pencil-alt click"></i></Link></td>
                    <td className="text-center"><i className="fas fa-trash-alt click" onClick={() => openModal(line.id)}></i></td>
                </tr>
            )
        )
    }

    return (
        <section className="content">
        <div className="container-fluid">
        <div className="row">
            <div className="col-12 mt-2 mb-3">
              <h1>Usuários</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="input-group mb-3">
                <input type="email" id="searchBarTecUser" className="form-control" placeholder="Qual usuário você está procurando?" />
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
              <table id="dataTableUser" className="table table-bordered table-responsive-sm table-responsive-md">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th className="text-center">E-mail</th>
                    <th className="text-center">Tipo</th>
                    <th className="text-center">Editar</th>
                    <th className="text-center">Excluir</th>
                  </tr>
                </thead>
                <tbody>
                    {renderRow()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modals 
            title='Exclusão de card'
            body='Tem certeza que deseja excluir este usuário? Se excluir, a coleção do usuário também será excluída'
            nameButton='Excluir'
            deleteItem={deleteItem}
            ref={refModal}
        />
      <ToastContainer />
      </section>
    )
}

export default Users