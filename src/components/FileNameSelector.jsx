import { useRef } from 'react';
import Modal from './Modal';

export const FileNameSelector = ({ enabled, fileNames, closeModal, className, onFileSelection }) => {
    const ref = useRef(null);

    return <Modal
        isEnabled={enabled}
        nonCloseable={false}
        onClose={closeModal}
        actionBtnOptions={{
            isEnabled: true,
            onClick: () => onFileSelection(ref.current.value),
            title: 'Load'
        }}
        className={className}
    >
        <div>
            <label htmlFor='programName'>Choose File</label>
            <select
                name='programName'
                ref={ref}
                autoFocus={true}
            >
                {fileNames.map(fileName => <option value={fileName} key={fileName}>{fileName}</option>)}
            </select>
        </div>
    </Modal>
}

export default FileNameSelector;