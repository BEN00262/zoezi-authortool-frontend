import React,{useEffect,useContext} from 'react';
import { Button, Divider } from 'semantic-ui-react';

import {PaperContext} from "../context/paperContext";
import SModal from './SModal';
import FolderComp from './FolderComp';
import PaperImport from './paperimport';
import KcpePaper from './KcpePapers';
import RecursiveFolderComp from './RecursiveFolderComp';

const SideBar = () => {
    const {changePaperID,createPaperDispatch,papers,authToken,fetchPapers} = useContext(PaperContext);
    
    useEffect(() => {
        fetchPapers(authToken);
    },[]);

    const createPaper = (paper) => {
        createPaperDispatch(paper,authToken);
    }

    const handlePaperSelect = (paper_id) => {
        changePaperID(paper_id);
    }

    // create a folder view for these files and groupings
    // check for the active paper then highlight it for visibility's sake
    return (
        <>
            <div style={{padding:"5px", borderRadius:"5px", border:"1px solid grey"}}>
                <SModal createPaper={createPaper}/>
                <KcpePaper/>
                <PaperImport/>
            </div>

            <div  style={{height:"85vh", overflowY:"scroll", marginTop:"10px", padding:"10px"}}>
                <Divider horizontal>my papers</Divider>

                {Object.keys(papers).map((paperType,p_index) => {
                    return (
                        <FolderComp key={`pt_${p_index}`} handlePaperSelect={handlePaperSelect}
                            paperType={paperType}
                            papers = {papers[paperType].papers}
                        />
                    );
                })}
                <RecursiveFolderComp/>
            </div>
        </>
    );
}

export default SideBar;