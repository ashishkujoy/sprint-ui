import { useState } from "react"
import Modal from "./Modal";

const ProgramNamePrompt = ({ enabled, onSave, onCancel }) => {
    const [programName, setProgramName] = useState('');

    return <Modal
        isEnabled={enabled}
        nonCloseable={false}
        onClose={onCancel}>
        <div>
            <p>Enter the name of program</p>
            <input value={programName} onChange={(e) => setProgramName(e.target.value.trim())}></input>
        </div>
        <div>
            <button onClick={() => onSave(programName)} className='btn'>Save</button>
        </div>
    </Modal>
}

export default ProgramNamePrompt;
