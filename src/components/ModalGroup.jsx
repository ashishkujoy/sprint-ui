import ErrorModal from "./ErrorModal";
import Help from "./Help";
import ProgramNamePrompt from "./ProgramNamePrompt";
import FileNameSelector from "./FileNameSelector";
import InputModal from "./InputModal";
import { Actions } from "../state";

const ModalGroup = ({ state, dispatch }) => {
    return <>
        <ErrorModal
            enabled={state.showError}
            error={state.error}
            onClose={() => dispatch(Actions.hideError)}
        />
        <Help enabled={state.showHelp} closeHelp={() => dispatch(Actions.closeHelp)} />
        <ProgramNamePrompt
            enabled={state.showSaveProgramModal}
            onSave={(programName) => dispatch(Actions.saveProgram(programName))}
            onCancel={() => dispatch(Actions.hideSaveCodeModal)}
        />
        <FileNameSelector
            enabled={state.showLoadProgramModal}
            fileNames={state.savedProgramNames}
            closeModal={() => dispatch(Actions.hideLoadProgramModal)}
            onFileSelection={(programName) => dispatch(Actions.loadProgram(programName))}
            className='file-name-modal'
            title='Load'
        />
        <FileNameSelector
            enabled={state.showDeleteProgramModal}
            fileNames={state.savedProgramNames}
            closeModal={() => dispatch(Actions.hideDeleteProgramModal)}
            onFileSelection={(programName) => dispatch(Actions.deleteProgram(programName))}
            className='file-name-modal'
            title='Delete'
        />
        <InputModal
            enabled={state.inputModalOpen && state.inputRequiredFromUser}
            onSubmit={(number) => dispatch(Actions.setInput(number))}
        />
    </>
}

export default ModalGroup;