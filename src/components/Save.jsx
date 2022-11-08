import { useState } from "react"

const ProgramNamePrompt = ({ enabled, onSave, onCancel }) => {
    const [programName, setProgramName] = useState('');

    if (enabled) {
        return <div className='prompt'>
            <div>
                <p>Enter the name of program</p>
                <input value={programName} onChange={(e) => setProgramName(e.target.value.trim())} />
            </div>
            <div>
                <button onClick={() => onSave(programName)}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>    
    } else {
        return <></>
    }
}

export default ProgramNamePrompt;
