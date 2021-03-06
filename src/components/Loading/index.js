import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.css'

const Loading = forwardRef((props, ref) => {

    const [showLoading, setShowLoading] = useState(true)

    // Verifica se o loading está ativo e desativa
    useImperativeHandle(
        ref,
        () => ({
            executeLoading(){
                {showLoading == false ? setShowLoading(true) : setShowLoading(false)}
                
            }
        })
    )

    if(showLoading == false){
        return null
    }


    return(
        <>
            <div className="d-flex justify-content-center loading">
                <div className="spinner-grow text-dark" role="status">
                </div>
                <div className="spinner-grow text-dark" role="status">
                </div>
                <div className="spinner-grow text-dark" role="status">
                </div>
                <div className="spinner-grow text-dark" role="status">
                </div>
                <div className="spinner-grow text-dark" role="status">
                </div>
                <div className="spinner-grow text-dark" role="status">
                </div>
            </div>
            <div className="d-flex justify-content-center loading-text">
                <h5>{props.title ? props.title : 'Carregando...'}</h5>
            </div>
        </>
    )
})

export default Loading