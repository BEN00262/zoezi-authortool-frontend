import React,{useEffect,useContext} from 'react';
import {Card,List,Header} from "semantic-ui-react";

import {PaperContext} from "../context/paperContext";
import SModal from './SModal';

// this will be initialized from the server
const SideBar = () => {
    const {changePaperID,createPaperDispatch,papers,authToken,fetchPapers} = useContext(PaperContext);

    useEffect(() => {
        fetchPapers(authToken);
    },[authToken]);

    const createPaper = (paper) => {
        createPaperDispatch(paper,authToken);
    }

    const handlePaperSelect = (paper_id) => {
        changePaperID(paper_id);
    }

    return (
        <>
            <SModal createPaper={createPaper}/>
            <div  style={{height:"85vh", overflowY:"scroll", marginTop:"10px", padding:"10px"}}>
                {Object.keys(papers).map((paperType,p_index) => {
                    return (
                        <React.Fragment key={`pt_${p_index}`}>
                            <Header as="h5">{paperType}</Header>
                            <Card>
                                <Card.Content>
                                    <List divided verticalAlign='middle'>
                                            {papers[paperType].papers.map((pp,index) => {
                                                return (
                                                    <List.Item key={`pp_${index}`} onClick={() => handlePaperSelect(`${pp.id}`)}>
                                                        <List.Icon name='file alternate' />
                                                        <List.Content>
                                                            <List.Header as='a'>{pp.name}</List.Header>
                                                        </List.Content>
                                                    </List.Item>
                                                );
                                            })}
                                    </List>
                                </Card.Content>
                            </Card>
                        </React.Fragment>
                    );
                })}
            </div>
        </>
    );
}

export default SideBar;