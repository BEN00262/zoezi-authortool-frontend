import React,{useContext} from 'react';
import {Grid, Segment} from "semantic-ui-react";

import SideBar from "./SideBar";
import PaperHOC from './paperhoc';

import {PaperContext} from "../context/paperContext";
import Navbar from './Navbar';

// the creation of paper should be managed from here

const ContentPage = () => {
   const {paperID} = useContext(PaperContext);

    return (
        <>
        <Navbar/>
        <Segment style={{marginTop:"5px"}}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        
                        <SideBar/>
                    
                    </Grid.Column>

                    <Grid.Column width={12}>
                    {paperID ? <PaperHOC/> : null} 
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
        </>
    );
}

export default ContentPage;