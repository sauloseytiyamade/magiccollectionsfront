import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {Modal, Button} from 'react-bootstrap'

const Modals = forwardRef((props, ref) => {

    const [showModal, setShow] = useState(false)
    const handleClose = () => setShow(false)
    

    // Verifica se a modal está aberta e fecha a modal
    useImperativeHandle(
        ref,
        () => ({
            openModal () {
                {showModal == true ? setShow(false) : setShow(true)}
            }
        })
    )

    return(
        <>
            
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.body}</Modal.Body>
                <Modal.Footer>
                <Button variant="btn btn-dark" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="btn btn-dark" onClick={props.deleteItem}>
                    {props.nameButton}
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
})

export default Modals