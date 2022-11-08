import { useRef } from 'react';

export const FileNameSelector = ({ enabled, fileNames, closeModal, className, onFileSelection }) => {
    const ref = useRef(null);

    if (enabled) {
        return <div className={`prompt ${className ? className :''}`}>
            <div>
                <span onClick={closeModal}>X</span>
            </div>
            <div>
                <label htmlFor='programName'>Choose File</label>
                <select
                    name='programName'
                    onChange={(e) => console.log(e)}
                    ref={ref}
                >
                    {fileNames.map(fileName => <option value={fileName} key={fileName}>{fileName}</option>)}
                </select>
            </div>
            <div>
                <button onClick={() => onFileSelection(ref.current.value)}>Load</button>
            </div>
        </div>    
    } else {
        <></>
    }
    
}

export default FileNameSelector;