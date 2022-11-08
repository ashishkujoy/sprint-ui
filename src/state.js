import { toInts } from './utils';

const Sprint = require('@ashishkuoy/sprint');

const placeholderCode = '0 45 100\n0 55 101\n1 100 101 102\n9';
const readInputInstCode = 6;

const hideError = (state) => ({ ...state, showError: false });
const animateExecution = (state) => ({ ...state, animationInProgress: true, animationStepNumber: 0 });
const stopExecutionAnimation = (state) => ({ ...state, animationInProgress: false });
const closeHelp = (state) => ({ ...state, showHelp: false });
const showHelp = (state) => ({ ...state, showHelp: true });
const showSaveCodeModal = (state) => ({ ...state, showSaveCodeModal: true });
const hideSaveCodeModal = (state) => ({ ...state, showSaveCodeModal: false });

let userInput = -1;

const emptyCells = () => new Array(144).fill(0).map((_, i) => ({ id: i, value: undefined }));

const registersWithCode = (state, { code }) => {
    const tokens = toInts(code)
    const cells = emptyCells();
    tokens.forEach((value, index) => cells[index].value = value)

    return { ...state, registers: cells, sprint: undefined, isHalted: false };
}

const markPCAndArgs = (registers, programCounter, argLength, isHalted) => {
    if (isHalted) {
        registers[programCounter - 1].isHaltInstruction = true;
    } else {
        registers[programCounter - 1].isCurrentInstruction = true;
    }

    for (let i = programCounter; i < programCounter + argLength; i++) {
        registers[i].isArg = true;
    }

    return registers;
}

const executeCode = (state, action) => {
    const sprint = Sprint.getInstance(100, 144, action.code, {readNumber: () => userInput});
    const registers = markPCAndArgs(
        [...state.registers],
        sprint.pc,
        sprint.nextInstructionLength() - 1,
        sprint.isHalted
    )

    return { ...state, registers, sprint, isHalted: false, userInput: undefined };
}

const loadSavedProgramNames = () => {
    const programs = JSON.parse(localStorage.getItem('sprintPrograms') || '{}');
    return Object.keys(programs);
}

const saveProgram = (state, action) => {
    const programs = JSON.parse(localStorage.getItem('sprintPrograms') || '{}');
    programs[action.programName] = state.code;
    localStorage.setItem('sprintPrograms', JSON.stringify(programs));

    return { ...state, showSaveCodeModal: false, savedProgramNames: Object.keys(programs) };
}

const getCells = (sprint) => {
    const { cells, pc } = sprint;
    const registers = emptyCells();
    cells.cells.forEach(({ value }, index) => registers[index].value = value);
    return markPCAndArgs(registers, pc, sprint.nextInstructionLength() - 1, sprint.isHalted);
}

const isInputRequiredFromUser = (registers, pc, state) => {
    return registers[pc - 1].value === readInputInstCode && state.userInput === undefined
}

const executeNextStep = (state) => {
    const sprint = state.sprint.executeNext();

    if (!sprint) {
        return { ...state, isHalted: true };
    }

    const registers = getCells(sprint);

    return {
        ...state,
        registers,
        isHalted: sprint.isHalted,
        sprint: sprint,
        inputRequiredFromUser: isInputRequiredFromUser(registers, sprint.pc, state),
        userInput: undefined
    }
}

const executePreviousStep = (state) => {
    const sprint = state.sprint.executePrevious();
    if (!sprint) {
        return { ...state, isHalted: false };
    }
    const registers = getCells(sprint);

    return {
        ...state,
        registers,
        isHalted: sprint.isHalted,
        sprint: sprint,
        inputRequiredFromUser: isInputRequiredFromUser(registers, sprint.pc, state),
        userInput: undefined
    }
}

const showNextAnimationStep = (state) => {
    const newState = executeNextStep(state);

    return { ...newState, animationInProgress: !newState.isHalted }
}

const showLoadProgramModal = (state) => ({ ...state, showLoadProgramModal: true })

const hideLoadProgramModal = (state) => ({ ...state, showLoadProgramModal: false })

const setInput = (state, { input }) => {
    userInput = input;
    const newState = executeNextStep(state)
    return ({ ...newState, userInput: input, inputRequiredFromUser: false, inputModalOpen: false })
};

const showInputModal = (state) => ({ ...state, inputModalOpen: true });

export const initialState = {
    registers: registersWithCode({}, { code: placeholderCode }).registers,
    executionResult: [],
    stepNumber: 0,
    codeVerified: false,
    error: undefined,
    showError: false,
    maxInstructionCountReached: false,
    animationDelay: 500,
    animationStepNumber: 0,
    animationInProgress: false,
    showHelp: false,
    code: placeholderCode,
    showSaveCodeModal: false,
    savedProgramNames: loadSavedProgramNames(),
    sprint: undefined,
    isHalted: false,
    showLoadProgramModal: false,
    userInput: undefined,
    inputRequiredFromUser: false,
    inputModalOpen: false
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'IncrementStep': return executeNextStep(state)
        case 'DecrementStep': return executePreviousStep(state)
        case 'UpdateCode': return registersWithCode(state, action)
        case 'ExecuteCode': return executeCode(state, action)
        case 'HideError': return hideError(state)
        case 'AnimateExecution': return animateExecution(state)
        case 'StopExecutionAnimation': return stopExecutionAnimation(state)
        case 'CloseHelp': return closeHelp(state)
        case 'ShowHelp': return showHelp(state)
        case 'ShowSaveCodeModal': return showSaveCodeModal(state)
        case 'HideSaveCodeModal': return hideSaveCodeModal(state)
        case 'SaveProgram': return saveProgram(state, action)
        case 'ShowNextAnimationStep': return showNextAnimationStep(state)
        case 'IncrementAnimatedStepCount': return { ...state, animationStepNumber: state.animationStepNumber + 1 }
        case 'ShowLoadProgramModal': return showLoadProgramModal(state)
        case 'HideLoadProgramModal': return hideLoadProgramModal(state)
        case 'SetInput': return setInput(state, action)
        case 'ShowInputModal': return showInputModal(state)
        default: return state
    }
}

export const Actions = {
    incrementStep: { type: 'IncrementStep' },
    decrementStep: { type: 'DecrementStep' },
    hideError: { type: 'HideError' },
    closeHelp: { type: 'CloseHelp' },
    showHelp: { type: 'ShowHelp' },
    showSaveCodeModal: { type: 'ShowSaveCodeModal' },
    hideSaveCodeModal: { type: 'HideSaveCodeModal' },
    markAnimationStarted: { type: 'AnimateExecution' },
    markAnimationStoped: { type: 'StopExecutionAnimation' },
    nextAnimationStep: { type: 'ShowNextAnimationStep' },
    incrementAnimatedStepCount: { type: 'IncrementAnimatedStepCount' },
    showLoadProgramModal: { type: 'ShowLoadProgramModal' },
    hideLoadProgramModal: { type: 'HideLoadProgramModal' },
    showInputModal: {type: 'ShowInputModal'},
    executeCode: (code) => ({ type: 'ExecuteCode', code }),
    updateCode: (code) => ({ type: 'UpdateCode', code }),
    saveProgram: (programName) => ({ type: 'SaveProgram', programName }),
    setInput: (input) => ({ type: 'SetInput', input })
}