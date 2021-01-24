import React from 'react';
import Birds from '../../img/aves_do_paraiso.png'

const CardView = () => {
    return(
        <section className="content">
                <div className="container-fluid">
                    <div className="row">
                    <div className="col-12 mt-2 mb-2">
                        <h1>Aves do Paraíso</h1>
                    </div>
                    </div>

                    <div className="row">
                    <div className="col-lg-2">
                        <img src={Birds} alt="" srcset="" width='90%'/>
                    </div>
                    <div className="col-lg-10 mt-2">
                        <p><b>Nome da Carta:</b> Aves do Paraíso</p>
                        <p><b>Tipo da carta:</b> Criatura</p>
                        <p><b>Cor da carta:</b> Verde</p>
                        <p><b>Edição da carta:</b> 10ª Edição</p>
                        <p><b>Raridade da carta:</b> Rara</p>
                    </div>
                    </div>
                </div>
            </section>

    )
}

export default CardView