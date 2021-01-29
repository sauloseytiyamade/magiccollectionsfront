import React from 'react';


const EditionCards = () => {
    return(
        <section class="content">
           <div class="container-fluid">
                <div class="row">
                    <div class="col-12 mt-2 mb-3">
                    <h1>Edições e Cards</h1>
                    </div>
                </div>
                <div class="row">
                <div class="col-lg-4 mt-3">
                    <div class="form-group">
                        <label for="exampleFormControlSelect1">Selecione a edição</label>
                        <select class="form-control">
                        <option>Mirrodin</option>
                        <option>8ª Edição</option>
                        <option>Darksteel</option>
                        <option>Odisséia</option>
                        <option>7ª Edição</option>
                        </select>
                    </div>
                    </div>
                    <div class="col-lg-4 mt-5">                
                        <button type="button" class="btn btn-dark">Nova Edição</button>
                    </div>
                </div>

                <hr class="mb-4"></hr>

                <div class="row">
                    <div class="col-12 mt-2 mb-3">
                    <h1>Cards</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-11">
                        <div class="input-group mb-3">
                            <input type="email" class="form-control" placeholder="Qual carta você está procurando?" />
                            <div class="input-group-append">
                            <div class="input-group-text">
                                <i class="fas fa-search"></i>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-1 mb-2">
                        <button type="button" class="btn btn-dark">Adicionar</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                    <div class="col-lg-12">
                        <table id="example2" class="table table-bordered table-responsive-sm table-responsive-md">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th class="text-center">Tipo</th>
                            <th class="text-center">Cor</th>
                            <th class="text-center">Edição</th>
                            <th class="text-center">Raridade</th>
                            <th class="text-center">Editar</th>
                            <th class="text-center">Remover</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>Aves do Paraíso</td>
                            <td class="text-center">Criatura</td>
                            <td class="text-center">Verde</td>
                            <td class="text-center">8ª Edição</td>
                            <td class="text-center">Rara</td>
                            <td class="text-center"><i class="fas fa-pencil-alt"></i></td>
                            <td class="text-center"><i class="fas fa-trash-alt"></i></td>
                        </tr>
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-2 offset-lg-10">
                    <nav aria-label="Page navigation">
                        <ul class="pagination">
                        <li class="page-item"><a class="page-link text-dark" href="#">Previous</a></li>
                        <li class="page-item"><a class="page-link text-dark" href="#">1</a></li>
                        <li class="page-item"><a class="page-link text-dark" href="#">2</a></li>
                        <li class="page-item"><a class="page-link text-dark" href="#">3</a></li>
                        <li class="page-item"><a class="page-link text-dark" href="#">Next</a></li>
                        </ul>
                    </nav>
                    </div>
                </div>
           </div>
        </section>
    )
}

export default EditionCards
