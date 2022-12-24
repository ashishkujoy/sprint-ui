import NumberSelector from "./NumberSelector";
import { Actions } from "../state";

const Settings = ({ state, dispatch }) => {
    return <div className='load-save'>
        <NumberSelector
            title='Max Instructions'
            value={state.maxInstruction}
            min={0}
            onChange={(maxInstruction) => dispatch(Actions.setMaxInstructions(maxInstruction))}
        />
        <NumberSelector
            title='Animation Delay'
            value={state.animationDelay}
            min={0}
            onChange={(speed) => dispatch(Actions.setAnimationSpeed(speed))}
        />

        <NumberSelector
            title='Max Cells'
            value={state.maxCellCount}
            min={225}
            onChange={(cellCounts) => dispatch(Actions.setCellCount(cellCounts))}
        />
        <button className='btn' onClick={() => dispatch(Actions.showSaveProgramModal)}>Save</button>
        <button className='btn' onClick={() => dispatch(Actions.showLoadProgramModal)}>Open</button>
        <button className='btn' onClick={() => dispatch(Actions.showDeleteProgramModal)}>Delete</button>
    </div>
}

export default Settings;