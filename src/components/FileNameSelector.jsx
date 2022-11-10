import { useRef } from 'react';
import Modal from './Modal';

export const FileNameSelector = ({ enabled, fileNames, closeModal, className, onFileSelection }) => {
    const ref = useRef(null);

    return <Modal
        isEnabled={enabled}
        nonCloseable={false}
        onClose={closeModal}>
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
            <button className='btn' onClick={() => onFileSelection(ref.current.value)}>Load</button>
        </div>
    </Modal>
}

export default FileNameSelector;