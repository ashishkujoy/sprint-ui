import { toInts, updateLablesWithCellPositions, ignoreComment } from './utils';

const Sprint = require('@ashishkuoy/sprint');

const placeholderCode = '0 45 100\n0 55 101\n1 100 101 102\n9';
const readInputInstCode = 6;

const hideError = (state) => ({ ...state, showError: false, animationInProgress: false, error: undefined });
const animateExecution = (state) => ({ ...state, animationInProgress: true, animationStepNumber: 0 });
const stopExecutionAnimation = (state) => ({ ...state, animationInProgress: false });
const closeHelp = (state) => ({ ...state, showHelp: false });
const showHelp = (state) => ({ ...state, showHelp: true });
const ShowSaveProgramModal = (state) => ({ ...state, showSaveProgramModal: true });
const hideSaveCodeModal = (state) => ({ ...state, showSaveProgramModal: false });

let userInput = -1;

const emptyCells = (maxCellCount) => new Array(maxCellCount).fill(0).map((_, i) => ({ id: i + 1, value: undefined }));


const newCellsWithCode = (code, maxCellCount) => {
    const codeWithoutComments = code.split('\n').map(ignoreComment).join('\n');
    const tokens = toInts(codeWithoutComments);
    const cells = emptyCells(maxCellCount);
    tokens.forEach((value, index) => cells[index] === undefined || cells[index] === null ? "" : cells[index].value = value);

    return cells;
}

const registersWithCode = (state, { code }) => {
    const cells = newCellsWithCode(code, state.maxCellCount);

    return { ...state, registers: cells, sprint: undefined, isHalted: false, code };
}

const markPCAndArgs = (registers, sprint) => {
    if (sprint.isHalted) {
        registers[sprint.pc - 1].isHaltInstruction = true;
    } else {
        registers[sprint.pc - 1].isCurrentInstruction = true;
    }

    const argLength = sprint.nextInstructionLength();

    for (let i = sprint.pc; i < sprint.pc + argLength - 1; i++) {
        registers[i].isArg = true;
    }

    const lastResult = sprint.stepExecutionResult[sprint.stepExecutionResult.length - 1];

    if (lastResult) {
        const changedCell = lastResult.previousCells.cells.find(({ value }, index) => {
            return registers[index].value !== value;
        });
        if (changedCell) {
            registers[changedCell.id].isLatestUpdatedRegister = true;
        }
    }

    return registers;
}

const executeCode = (state, action) => {
    try {
        const codeWithLablesResolved = updateLablesWithCellPositions(action.code);
        const sprint = Sprint.getInstance(
            state.maxInstruction,
            state.maxCellCount,
            codeWithLablesResolved,
            { readNumber: () => userInput }
        );
        const initialReg = newCellsWithCode(codeWithLablesResolved, state.maxCellCount);
        const registers = markPCAndArgs(
            [...initialReg],
            sprint
        )

        return {
            ...state,
            registers,
            sprint,
            isHalted: false,
            inputRequiredFromUser: isInputRequiredFromUser(registers, sprint.pc, state),
            userInput: undefined
        };
    } catch (e) {
        return {
            ...state,
            error: e,
            showError: true,
            animationInProgress: false
        };
    }
}

const loadSavedProgramNames = () => {
    const programs = JSON.parse(localStorage.getItem('sprintPrograms') || '{}');
    return Object.keys(programs);
}

const saveProgram = (state, action) => {
    const programs = JSON.parse(localStorage.getItem('sprintPrograms') || '{}');
    programs[action.programName] = state.code;
    localStorage.setItem('sprintPrograms', JSON.stringify(programs));

    return { ...state, showSaveProgramModal: false, savedProgramNames: Object.keys(programs) };
}

const deleteProgram = (state, { programName }) => {
    const programs = JSON.parse(localStorage.getItem('sprintPrograms') || '{}');
    delete programs[programName];

    localStorage.setItem('sprintPrograms', JSON.stringify(programs));

    return { ...state, showDeleteProgramModal: false, savedProgramNames: Object.keys(programs) };
}

const getCells = (sprint, maxCellCount) => {
    const { cells } = sprint;
    const registers = emptyCells(maxCellCount);
    cells.cells.forEach(({ value }, index) => registers[index].value = value);
    return markPCAndArgs(registers, sprint);
}

const isInputRequiredFromUser = (registers, pc, state) => {
    return registers[pc - 1].value === readInputInstCode && state.userInput === undefined
}

const executeNextStep = (state) => {
    try {
        const sprint = state.sprint.executeNext();

        if (!sprint) {
            return { ...state, isHalted: true };
        }

        const registers = getCells(sprint, state.maxCellCount);

        return {
            ...state,
            registers,
            isHalted: sprint.isHalted,
            sprint: sprint,
            inputRequiredFromUser: isInputRequiredFromUser(registers, sprint.pc, state),
            userInput: undefined
        }
    } catch (error) {
        return { ...state, showError: true, error, animationInProgress: false }
    }

}

const executePreviousStep = (state) => {
    const sprint = state.sprint.executePrevious();
    if (!sprint) {
        return { ...state, isHalted: false };
    }
    const registers = getCells(sprint, state.maxCellCount);

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

const showLoadProgramModal = (state) => ({ ...state, showLoadProgramModal: true });

const showDeleteProgramModal = (state) => ({ ...state, showDeleteProgramModal: true });

const hideLoadProgramModal = (state) => ({ ...state, showLoadProgramModal: false });

const hideDeleteProgramModal = (state) => ({ ...state, showDeleteProgramModal: false });

const setInput = (state, { input }) => {
    userInput = input;
    const newState = executeNextStep(state)
    return ({ ...newState, inputModalOpen: false })
};

const showInputModal = (state) => ({ ...state, inputModalOpen: true, userInput: undefined });

const setAnimationSpeed = (state, { speed }) => ({ ...state, animationDelay: speed })

const loadProgram = (state, { programName }) => {
    const code = JSON.parse(localStorage.getItem('sprintPrograms') || '{}')[programName];

    if (code) {
        return { ...registersWithCode(state, { code }), showLoadProgramModal: false, code }
    } else {
        return { ...state, showLoadProgramModal: false }
    }
}

const setMaxInstructions = (state, { maxInstruction }) => ({ ...state, maxInstruction });

const movePCToOne = (state) => {
    return executeCode(state, { code: state.code });
}

const setCellCount = (state, action) => {
    const newState = { ...state, maxCellCount: action.cellCount }
    return registersWithCode(newState, { code: state.code })
}

const defaultCellCount = 225
export const initialState = {
    registers: registersWithCode({ maxCellCount: defaultCellCount }, { code: placeholderCode }).registers,
    executionResult: [],
    stepNumber: 0,
    codeVerified: false,
    error: undefined,
    showError: false,
    maxInstructionCountReached: false,
    animationDelay: 300,
    animationStepNumber: 0,
    animationInProgress: false,
    showHelp: false,
    code: placeholderCode,
    showSaveProgramModal: false,
    savedProgramNames: loadSavedProgramNames(),
    sprint: undefined,
    isHalted: false,
    showLoadProgramModal: false,
    userInput: undefined,
    inputRequiredFromUser: false,
    inputModalOpen: false,
    maxInstruction: 1000,
    maxCellCount: defaultCellCount,
    showDeleteProgramModal: false
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
        case 'ShowSaveProgramModal': return ShowSaveProgramModal(state)
        case 'HideSaveCodeModal': return hideSaveCodeModal(state)
        case 'SaveProgram': return saveProgram(state, action)
        case 'ShowNextAnimationStep': return showNextAnimationStep(state)
        case 'IncrementAnimatedStepCount': return { ...state, animationStepNumber: state.animationStepNumber + 1 }
        case 'ShowLoadProgramModal': return showLoadProgramModal(state)
        case 'HideLoadProgramModal': return hideLoadProgramModal(state)
        case 'HideDeleteProgramModal': return hideDeleteProgramModal(state)
        case 'SetInput': return setInput(state, action)
        case 'ShowInputModal': return showInputModal(state)
        case 'LoadProgram': return loadProgram(state, action)
        case 'DeleteProgram': return deleteProgram(state, action)
        case 'SetAnimationSpeed': return setAnimationSpeed(state, action)
        case 'SetMaxInstructions': return setMaxInstructions(state, action)
        case 'MovePCToOne': return movePCToOne(state, action)
        case 'SetCellCount': return setCellCount(state, action)
        case 'ShowDeleteProgramModal': return showDeleteProgramModal(state, action)
        default: return state
    }
}

export const Actions = {
    incrementStep: { type: 'IncrementStep' },
    decrementStep: { type: 'DecrementStep' },
    hideError: { type: 'HideError' },
    closeHelp: { type: 'CloseHelp' },
    showHelp: { type: 'ShowHelp' },
    showSaveProgramModal: { type: 'ShowSaveProgramModal' },
    hideSaveCodeModal: { type: 'HideSaveCodeModal' },
    markAnimationStarted: { type: 'AnimateExecution' },
    markAnimationStoped: { type: 'StopExecutionAnimation' },
    nextAnimationStep: { type: 'ShowNextAnimationStep' },
    incrementAnimatedStepCount: { type: 'IncrementAnimatedStepCount' },
    showLoadProgramModal: { type: 'ShowLoadProgramModal' },
    hideLoadProgramModal: { type: 'HideLoadProgramModal' },
    hideDeleteProgramModal: { type: 'HideDeleteProgramModal' },
    showInputModal: { type: 'ShowInputModal' },
    movePCToOne: { type: 'MovePCToOne' },
    showDeleteProgramModal: { type: 'ShowDeleteProgramModal' },
    executeCode: (code) => ({ type: 'ExecuteCode', code }),
    updateCode: (code) => ({ type: 'UpdateCode', code }),
    saveProgram: (programName) => ({ type: 'SaveProgram', programName }),
    setInput: (input) => ({ type: 'SetInput', input }),
    loadProgram: (programName) => ({ type: 'LoadProgram', programName }),
    setAnimationSpeed: (speed) => ({ type: 'SetAnimationSpeed', speed }),
    setMaxInstructions: (maxInstruction) => ({ type: 'SetMaxInstructions', maxInstruction }),
    setCellCount: (cellCount) => ({ type: 'SetCellCount', cellCount }),
    deleteProgram: (programName) => ({ type: 'DeleteProgram', programName }),
}