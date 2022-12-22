import { useReducer } from 'react';
import './App.css';
import AppHeader from './components/AppHeader';
import Editor from './components/Editor';
import ErrorModal from './components/ErrorModal';
import Help from './components/Help';
import RegisterGroup from './components/RegisterGroup';
import ProgramNamePrompt from './components/ProgramNamePrompt';
import { Actions, initialState, reducer } from './state';
import FileNameSelector from './components/FileNameSelector';
import InputModal from './components/InputModal';
import AnimationSpeedSelector from './components/AnimationSpeedSelector';

const nextStepAvailable = (state) => state.sprint && !state.isHalted

const nextEnabled = (state) => {
  return !state.animationInProgress && state.sprint && !state.isHalted
}

const previousEnabled = (state) => {
  return !state.animationInProgress && state.sprint && state.sprint.pc !== 1;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const modalOpen = state.showError || state.showHelp ||
    state.showSaveProgramModal || state.showLoadProgramModal ||
    (state.inputModalOpen && state.inputRequiredFromUser);

  if (state.animationInProgress && nextStepAvailable(state) && !state.error) {
    setTimeout(() => {
      if (state.inputRequiredFromUser) {
        dispatch(Actions.showInputModal)
      } else {
        dispatch(Actions.nextAnimationStep)
      }
    }, state.animationDelay)
  }

  return (
    <>
      <div className={modalOpen ? "main-container disabled-screen" : "main-container"}>
        <AppHeader modalOpen={modalOpen} onHelpClick={() => dispatch(Actions.showHelp)} />
        <div className={modalOpen ? 'disabled-screen' : ''}>
          <div className='load-save'>
            <AnimationSpeedSelector
              title='Max Instructions'
              value={state.maxInstruction}
              min={0}
              onChange={(maxInstruction) => dispatch(Actions.setMaxInstructions(maxInstruction))}
            />
            <AnimationSpeedSelector
              title='Animation Speed'
              value={state.animationDelay}
              min={0}
              onChange={(speed) => dispatch(Actions.setAnimationSpeed(speed))}
            />

            <AnimationSpeedSelector
              title='Max Cells'
              value={state.maxCellCount}
              min={225}
              onChange={(cellCounts) => dispatch(Actions.setCellCount(cellCounts))}
            />
            <button className='btn' onClick={() => dispatch(Actions.showSaveProgramModal)}>Save</button>
            <button className='btn' onClick={() => dispatch(Actions.showLoadProgramModal)}>Load</button>
          </div>
          <div className='editor-and-register'>
            <Editor
              onVerifyCode={(code) => dispatch(Actions.executeCode(code))}
              onCodeChange={(code) => dispatch(Actions.updateCode(code))}
              codeVerified={state.codeVerified}
              code={state.code}
            />
            <RegisterGroup
              registers={state.registers}
              onRunClick={() => dispatch(Actions.markAnimationStarted)}
              onNextStepClick={() => state.inputRequiredFromUser ? dispatch(Actions.showInputModal) : dispatch(Actions.incrementStep)}
              onPreviousStepClick={() => dispatch(Actions.decrementStep)}
              nextStepEnabled={nextEnabled(state)}
              previousStepEnabled={previousEnabled(state)}
              runEnabled={nextStepAvailable(state)}
              resetEnabled={state.sprint && state.isHalted}
              onResetClick={() => dispatch(Actions.movePCToOne)}
            />
          </div>
        </div>
      </div>
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
      />
      <InputModal
        enabled={state.inputModalOpen && state.inputRequiredFromUser}
        onSubmit={(number) => dispatch(Actions.setInput(number))}
      />
    </>
  );
}

export default App;
