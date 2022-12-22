import { useState } from "react"
import Modal from "./Modal";

const ProgramNamePrompt = ({ enabled, onSave, onCancel }) => {
    const [programName, setProgramName] = useState('');

    return <Modal
        isEnabled={enabled}
        nonCloseable={false}
        onClose={onCancel}
        actionBtnOptions={{
            isEnabled: true,
            onClick: () => onSave(programName),
            title: 'Save'
        }}
    >
        <div>
            <p>Enter the name of program</p>
            <input
                autoFocus={true}
                value={programName}
                onChange={(e) => setProgramName(e.target.value.trim())}
                style={{textAlign: 'center'}}
            ></input>
        </div>
    </Modal>
}

export default ProgramNamePrompt;
