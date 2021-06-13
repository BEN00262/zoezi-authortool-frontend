import { useContext,useEffect } from "react";
import { PaperContext } from "../context/paperContext";

const SocketWatcher = () => {
    const { authToken, socketIO, createNotification, fetchPapers } = useContext(PaperContext);

    useEffect(() => {
        if (authToken){
            socketIO.emit('author regestration',{ authToken })
        }
    },[authToken])

    socketIO.on("review paper",(msg) => {
        createNotification("success", "info",String(msg))
        fetchPapers(authToken)
    });

    return (
        <>
        </>
    )
}

export default SocketWatcher;