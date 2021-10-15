import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Icon, List, Header } from 'semantic-ui-react';
import { PaperContext } from '../context/paperContext';


// this takes in the name of the folder and the contained files
const FolderComp = ({paperType,papers,handlePaperSelect}) => {
    const [isOpen,setIsOpen] = useState(false);

    const {
        paperID
    } = useContext(PaperContext);

    

    const _handlePaperSelectContextMenu = (e,paperID) => {
        e.preventDefault();
    }

    
    return (
        <div style={{
            marginBottom:"6px"
        }}>
            <Header as="h5" onClick={() => setIsOpen(!isOpen)} style={{cursor:'pointer'}}>
                <Icon color="yellow" name={isOpen ? 'folder open' : 'folder'} />
                {paperType}
            </Header>

            <div style={{marginLeft:"10px", marginBottom:"10px"}} hidden={!isOpen }>
                        <List divided verticalAlign='middle'>
                            {papers.map((pp,index) => {
                                const isSelected = paperID === pp.id;
                                return (
                                    <List.Item key={`pp_${index}`} onContextMenu={(e) => _handlePaperSelectContextMenu(e,`${pp.id}`)}  onClick={() => handlePaperSelect(`${pp.id}`)}>
                                        <List.Icon name={isSelected ?'file alternate' : 'file alternate outline'} />
                                        <List.Content>
                                            
                                            <List.Header as='a'>
                                                <div style={{
                                                    textDecoration:isSelected ? "underline" : "inherit",
                                                }}>
                                                    {pp.name.charAt(0).toUpperCase() + pp.name.slice(1)}
                                                </div>
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                );
                            })}
                        </List>
            </div>
        </div>
    )
}

export default FolderComp;