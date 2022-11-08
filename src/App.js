import { useReducer } from 'react';
import './App.css';
import AppHeader from './components/AppHeader';
import Editor from './components/Editor';
import ErrorModal from './components/ErrorModal';
import RegisterGroup from './components/RegisterGroup';
import Help from './components/Help';
import { Actions, initialState, reducer } from './state';
import { repeat, saveProgram } from './utils';
import Button from './components/Save';
import Load from './components/Load';
import ProgramNamePrompt from './components/Save';

const nextStepAvailable = (state) => {
  return !state.animationInProgress && state.sprint && !state.isHalted
}

const previousEnabled = (state) => {
  return !state.animationInProgress && state.sprint && state.sprint.programCounter !== 1;
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const modalOpen = state.showError || state.showHelp || state.showSaveCodeModal;

  const animate = () => {
    dispatch(Actions.markAnimationStarted);
    repeat(
      state.executionResult.length - state.stepNumber - 1,
      () => dispatch(Actions.incrementStep),
      state.animationDelay
    ).then(() => dispatch(Actions.markAnimationStoped));
  }

  return (
    <>
      <div className={modalOpen ? "main-container disabled-screen" : "main-container"}>
        <AppHeader modalOpen={modalOpen} onHelpClick={() => dispatch(Actions.showHelp)} />
        <div className={modalOpen ? 'disabled-screen' : ''}>
          <div className='load-save'>
            <Load savedFileNames={[]}></Load>
            <button onClick={() => dispatch(Actions.showSaveCodeModal)}>Save</button>
          </div>
          <div className='editor-and-register'>
            <Editor
              onVerifyCode={(code) => dispatch(Actions.executeCode(code))}
              onCodeChange={(code) => dispatch(Actions.updateCode(code))}
              codeVerified={state.codeVerified}
            />
            <RegisterGroup
              registers={state.registers}
              onRunClick={animate}
              onNextStepClick={() => dispatch(Actions.incrementStep)}
              onPreviousStepClick={() => dispatch(Actions.decrementStep)}
              nextStepEnabled={nextStepAvailable(state)}
              previousStepEnabled={previousEnabled(state)}
              runEnabled={nextStepAvailable(state)}
            />
          </div>
        </div>
      </div>
      {
        state.showError ? <ErrorModal
          error={state.error}
          onClose={() => dispatch(Actions.hideError)}
        /> : <></>
      }
      {
        state.showHelp ? <Help closeHelp={() => dispatch(Actions.closeHelp)} /> : <></>
      }
      <ProgramNamePrompt
        enabled={state.showSaveCodeModal}
        onSave={(programName) => dispatch(Actions.saveProgram(programName))}
        onCancel={() => dispatch(Actions.hideSaveCodeModal)}
      />
    </>
  );
}

export default App;
