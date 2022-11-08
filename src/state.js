import registers from '@ashishkuoy/sprint/registers';
import Sprinter from './sprint';
import { toInts } from './utils';

const Sprint = require('@ashishkuoy/sprint');

const placeholderCode = '0 45 100\n0 55 101\n1 100 101 102\n9';


const hideError = (state) => ({ ...state, showError: false });
const animateExecution = (state) => ({ ...state, animationInProgress: true });
const stopExecutionAnimation = (state) => ({ ...state, animationInProgress: false });
const closeHelp = (state) => ({ ...state, showHelp: false });
const showHelp = (state) => ({ ...state, showHelp: true });
const showSaveCodeModal = (state) => ({ ...state, showSaveCodeModal: true });
const hideSaveCodeModal = (state) => ({ ...state, showSaveCodeModal: false });

const emptyCells = () => new Array(144).fill(0).map((_, i) => ({ id: i, value: undefined }));

const registersWithCode = (state, { code }) => {
    const tokens = toInts(code)
    const cells = emptyCells();
    tokens.forEach((value, index) => cells[index].value = value)

    return { ...state, registers: cells, sprint: undefined };
};

const markPCAndArgs = (registers, programCounter, argLength) => {
    registers[programCounter - 1].isCurrentInstruction = true;

    for (let i = programCounter; i < programCounter + argLength; i++) {
        registers[i].isArg = true;
    }

    return registers;
}

const executeCode = (state, action) => {
    const sprint = Sprint.getInstance(100, 144, action.code);
    const registers = markPCAndArgs([...state.registers], sprint.pc, sprint.nextInstructionLength() - 1)

    return { ...state, registers, sprint };
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
    cells.cells.forEach(({value}, index) => registers[index].value = value);
    return markPCAndArgs(registers, pc, sprint.nextInstructionLength() - 1);
}

const executeNextStep = (state) => {
    const sprint = state.sprint.executeNext();

    if (!sprint) {
        return { ...state, isHalted: true };
    }

    return {
        ...state,
        registers: getCells(sprint),
        isHalted: sprint.isHalted,
        sprint: sprint
    }
}

export const initialState = {
    registers: registersWithCode({}, { code: placeholderCode }).registers,
    executionResult: [],
    stepNumber: 0,
    codeVerified: false,
    error: undefined,
    showError: false,
    maxInstructionCountReached: false,
    animationDelay: 500,
    animationInProgress: false,
    showHelp: false,
    code: placeholderCode,
    showSaveCodeModal: false,
    savedProgramNames: loadSavedProgramNames(),
    sprint: undefined,
    isHalted: false
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'IncrementStep': return executeNextStep(state)
        case 'DecrementStep': return new Sprinter(state).previousStep()
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

    executeCode: (code) => ({ type: 'ExecuteCode', code }),
    updateCode: (code) => ({ type: 'UpdateCode', code }),
    saveProgram: (programName) => ({ type: 'SaveProgram', programName }),
}