import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.css'

const Loading = forwardRef((props, ref) => {

    const [showLoading, setShowLoading] = useState(true)
    
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
            <div class="d-flex justify-content-center loading">
                <div class="spinner-grow text-dark" role="status">
                </div>
                <div class="spinner-grow text-dark" role="status">
                </div>
                <div class="spinner-grow text-dark" role="status">
                </div>
                <div class="spinner-grow text-dark" role="status">
                </div>
                <div class="spinner-grow text-dark" role="status">
                </div>
                <div class="spinner-grow text-dark" role="status">
                </div>
            </div>
            <div class="d-flex justify-content-center loading-text">
                <h5>Carregando...</h5>
            </div>
        </>
    )
})

export default Loading