import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { Icon, List, Header, Divider } from 'semantic-ui-react';
import { PaperContext } from '../context/paperContext';


// this takes in the name of the folder and the contained files
// rootfolder --> 
const RFolderComp = ({ parentName, spaper, rootPath, isRootFolder = false }) => {
    const { changeRootPaperID, authToken, paperID, changeSpecialPaperID, changeSpecialPaperModalVisibility } = useContext(PaperContext);
    const [isOpen,setIsOpen] = useState(false);
    const [isFileDisplay, setIsFileDisplay] = useState(false)
    const [files, setFiles] = useState([])

    const openFolder = () => {
        setIsOpen(old => !old)

        if (isRootFolder) {
            changeRootPaperID(spaper._id, spaper.name)
        }
    }

    useEffect(() => {
        if (isOpen) {
            axios.get(`/special-paper/${rootPath}`, {
                headers: { AuthToken: authToken }
            }).then(({data}) => {
                if (!data.status) {
                    throw new Error(data.error || "Unable to fetch folders")
                }
                
                setIsFileDisplay(data.files.areFiles)
                setFiles(data.files.folders)

                console.log(data.files.folders)

            }).catch(error => {
                console.log(error)
            })
        }
    }, [isOpen])

    const _handleFolderSelectContextMenu = (e, data) => {
        e.preventDefault()
        changeRootPaperID(spaper._id, spaper.name)

        changeSpecialPaperModalVisibility(true)
    }
    
    return (
        <div style={{
            marginLeft: isRootFolder ? "inherit" : "18px",
            marginBottom:"6px"
        }}>
            <Header 
                as="h5" onClick={openFolder} 
                onContextMenu={(e) => {
                    return isRootFolder ? _handleFolderSelectContextMenu(e,'nothing') : null
                }} 
                style={{cursor:'pointer'}}
            >
                <Icon color="yellow" name={isOpen ? 'folder open' : 'folder'} />
                {parentName}
            </Header>

            {isOpen ? !isFileDisplay ? 
                <>
                    {files.map(({name, _id}) => {
                        return <RFolderComp  parentName={name} spaper={{}} rootPath={`${rootPath}/${_id}`}/>
                    })}
                </> 
            :
                <div style={{marginLeft:"18px", marginBottom:"10px"}} hidden={!isOpen }>
                    <List divided verticalAlign='middle'>
                        {files.map(({subject, _id},index) => {
                            const isSelected = paperID === _id;
                            return (
                                <List.Item key={`pp_${index}`} onClick={() => changeSpecialPaperID(`${_id}`)}>
                                    <List.Icon name={isSelected ?'file alternate' : 'file alternate outline'} />
                                    <List.Content>
                                        
                                        <List.Header as='a'>
                                            <div style={{
                                                textDecoration:isSelected ? "underline" : "inherit",
                                            }}>
                                                {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                            </div>
                                        </List.Header>
                                    </List.Content>
                                </List.Item>
                            );
                        })}
                    </List>
                </div>
            : null}
        </div>
    )
}

const RecursiveFolderComp = () => {
    const { spapers, changeRootPaperID } = useContext(PaperContext);

    // for now we set only the top level elements as root its

    return (
        <div>
            {Object.keys(spapers).length ? <Divider horizontal>special papers</Divider> : null }

            {Object.entries(spapers).map(([name, spaper]) => {
                return <RFolderComp 
                    parentName={name} spaper={spaper} 
                    rootPath={spaper._id} isRootFolder={true}
                />
            })}
        </div>
    )
}

export default RecursiveFolderComp;