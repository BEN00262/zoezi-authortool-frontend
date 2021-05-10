import React, { useState, useContext } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import { PaperContext } from '../context/paperContext';


const StatusComp = ({ isActive, setIsActive, setIsSubmitted }) => {
    const {authToken
        ,isSubmittedDispatch
        ,fetchPapers
        ,socketIO
    } = useContext(PaperContext);

    // we are updating the context too much
    const [processingMessages, setProcessingMessages] = useState("");

    const setStatusSteps = (msg) => {
        console.log(msg);
        setProcessingMessages(before => before + msg + '\n');
    }

    socketIO.on('submission_status',(msg) => {
        setStatusSteps(msg);
    })

    socketIO.on('submission_error',(msg) => {
        setStatusSteps(msg);
        setTimeout(() => {
            setIsActive(false);
        },3000);
    })

    socketIO.on('submission_end',(msg) => {
        setStatusSteps(msg);
        
        setIsSubmitted(true);
        isSubmittedDispatch(true);
        fetchPapers(authToken);

        setTimeout(() => {
            setIsActive(false);
        },3000);
    })

    return (
        <Dimmer active={isActive}>
            <Loader content={"submitting paper ... please wait ..."}/>
        </Dimmer>
    )
}

export default StatusComp;