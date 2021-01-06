import React,{useState,useContext} from "react";
import { Button, Form } from 'semantic-ui-react';
import axios from "axios";
import {Redirect} from "react-router-dom";

import {PaperContext} from "../context/paperContext";

const FormComp = () => {
    const {loginDispatch,authToken} = useContext(PaperContext);
    const [loginData,setLoginData] = useState({
        email:"",
        password:""
    })

    const handleInputChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
       
        axios.post("/user/login",loginData)
            .then(({data}) => {
                if(data.success){
                    loginDispatch(data.token,data.isAdmin);
                }else{
                    console.log("There was an error");
                }
            })
            .catch(console.log)
    }

    if(authToken){
        return <Redirect to="/dashboard"/>
    }


    return (
        <Form onSubmit={handleSubmit}>
            <Form.Field>
            <label>Email</label>
            <input onChange={handleInputChange} value={loginData.email} type="email" name="email" placeholder='Email Address' />
            </Form.Field>
            <Form.Field>
            <label>Password</label>
            <input onChange={handleInputChange} value={loginData.password} placeholder='Password' type="password" name="password"/>
            </Form.Field>
            <Button type='submit'>Login</Button>
        </Form>
    )
}

export default FormComp
