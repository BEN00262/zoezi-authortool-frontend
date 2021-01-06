import React,{useContext} from 'react';
import {Grid,Divider} from "semantic-ui-react";

import SideBar from "./SideBar";
import Paper from './paper';
import {PaperContext} from "../context/paperContext";

// the creation of paper should be managed from here

const ContentPage = () => {
   const {paperID} = useContext(PaperContext);

    return (
        <Grid celled style={{marginTop:"20px"}}>
            <Grid.Row>
                <Grid.Column width={4}>
                    
                    <SideBar/>
                   
                </Grid.Column>


                <Grid.Column width={12}>
                   {paperID ? <Paper/> : null} 
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default ContentPage;