import React,{useContext} from "react";
import {Route,Redirect} from "react-router-dom";
import {PaperContext} from "../context/paperContext";

const ProtectedRoute = ({component:Component,...rest}) => {
    const {authToken} = useContext(PaperContext);
    return (
        <Route>
            {authToken ? <Component/> : <Redirect to="/"/>}
        </Route>
    );
}

export default ProtectedRoute;