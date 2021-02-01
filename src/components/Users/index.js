import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom'
import {BASE_URL_BACK} from '../../utils/variaveisAmbiente'
import _ from 'lodash'
import $ from 'jquery'
import axios from 'axios';

const Users = () => {
    const token = localStorage.getItem('token')
    const [data, setData] = useState([])
    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

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
    },[])

    const renderRow = () => {
        return data.map(line => (
                <tr key={line.id}>
                    <td>{line.name}</td>
                    <td className="text-center">{line.email}</td>
                    <td className="text-center">{line.permission == 0 ? 'Admin' : 'User'}</td>
                    <td className="text-center"><Link className='link_text_pen' to={`/usercollection/editcard/${line.id}`}><i className="fas fa-pencil-alt click"></i></Link></td>
                    <td className="text-center"><i className="fas fa-trash-alt click"></i></td>
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

      </section>
    )
}

export default Users