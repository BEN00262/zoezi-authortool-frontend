import React,{useContext} from 'react';
import {Grid} from "semantic-ui-react";

import SideBar from "./SideBar";
import PaperHOC from './paperhoc';

import {PaperContext} from "../context/paperContext";

// the creation of paper should be managed from here

const ContentPage = () => {
   const {paperID} = useContext(PaperContext);

    return (
        <Grid style={{marginTop:"20px"}}>
            <Grid.Row>
                <Grid.Column width={4}>
                    
                    <SideBar/>
                   
                </Grid.Column>

                <Grid.Column width={12}>
                   {paperID ? <PaperHOC/> : null} 
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default ContentPage;