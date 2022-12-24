import { useReducer } from 'react';
import './App.css';
import AppHeader from './components/AppHeader';
import Editor from './components/Editor';
import ModalGroup from './components/ModalGroup';
import RegisterGroup from './components/RegisterGroup';
import Settings from './components/Settings';
import { Actions, initialState, reducer } from './state';

const isNextStepAvailable = (state) => state.sprint && !state.isHalted

const isNextStepEnabled = (state) => {
  return !state.animationInProgress && state.sprint && !state.isHalted
}

const isPreviousStepEnabled = (state) => {
  return !state.animationInProgress && state.sprint && state.sprint.pc !== 1;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const modalOpen = state.showError || state.showHelp ||
    state.showSaveProgramModal || state.showLoadProgramModal || state.showDeleteProgramModal ||
    (state.inputModalOpen && state.inputRequiredFromUser);

  if (state.animationInProgress && isNextStepAvailable(state) && !state.error && !modalOpen) {
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
          <Settings state={state} dispatch={dispatch} />
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
              nextStepEnabled={isNextStepEnabled(state)}
              previousStepEnabled={isPreviousStepEnabled(state)}
              runEnabled={isNextStepAvailable(state)}
              resetEnabled={state.sprint && state.isHalted}
              onResetClick={() => dispatch(Actions.movePCToOne)}
              onPauseClick={() => dispatch(Actions.pauseAnimation)}
              animationInProgress={state.animationInProgress}
            />
          </div>
        </div>
      </div>
      <ModalGroup state={state} dispatch={dispatch} />
    </>
  );
}

export default App;
