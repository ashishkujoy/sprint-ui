import { useState } from "react";

const FileNameSelector = ({ fileNames }) => {
    return <div className='program-name-selector'>
        <label htmlFor='programName'>Choose File</label>
        <select name='programName' onChange={(e) => console.log(e)}>
            {fileNames.map(fileName => <option value={fileName} key={fileName}>{fileName}</option>)}
        </select>
    </div>
}

const Load = ({ savedFileNames }) => {
    const [showLoad, setShowLoad] = useState(false);
    return (<>
        <button onClick={() => setShowLoad(true)}>Load</button>
        {showLoad ? <FileNameSelector fileNames={savedFileNames}/> : <></>}
    </>)
}

export default Load