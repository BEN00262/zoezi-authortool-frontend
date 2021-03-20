import React,{useState,useContext} from "react";
import { Button, Form, Card, Header } from 'semantic-ui-react';
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
        loginDispatch(loginData);
    }

    if(authToken){
        return <Redirect to="/dashboard"/>
    }


    return (
        <>
        <Header size='huge'>Zoezi Data Entry Tool</Header>
        <Card>
            <Card.Content>
                <Form onSubmit={handleSubmit}>
                    <Form.Field>
                        <label>Email</label>
                        <input onChange={handleInputChange} value={loginData.email} type="email" name="email" placeholder='Email Address' />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input onChange={handleInputChange} value={loginData.password} placeholder='Password' type="password" name="password"/>
                    </Form.Field>
                    <Button primary style={{width:"100%"}} type='submit'>Login</Button>
                </Form>
            </Card.Content>
        </Card>
        </>
    )
}

export default FormComp
