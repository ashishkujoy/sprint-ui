const registersCount = 144;
export default class Sprinter {
    constructor(state) {
        this.state = state;
    }

    nextStep() {
        const {
            stepNumber,
            maxInstructionCountReached,
            maxInstructionCount
        } = this.state;

        const nextStep = stepNumber + 1;
        const registers = this.registersForStep(nextStep);
        let showError = false;

        if (maxInstructionCountReached && nextStep === maxInstructionCount - 1) {
            showError = true;
        }

        return { ...this.state, registers, stepNumber: nextStep, showError };
    }

    previousStep() {
        const currentStep = this.state.stepNumber;
        const registers = this.registersForStep(currentStep - 1);

        return { ...this.state, registers, stepNumber: currentStep - 1 };
    }

    registersForStep(stepNumber) {
        const executionResult = this.state.executionResult[stepNumber];

        const newRegisters = Sprinter.createNewRegisterState(
            executionResult.previousStateRegisters.registers,
            executionResult.programCounter.counter,
            executionResult.instructionLength,
        );

        this.updateChangedRegister(newRegisters, stepNumber);
        
        if (stepNumber === this.state.executionResult.length - 1) {
            newRegisters[executionResult.programCounter.counter].isHaltInstruction = true
        }
        return newRegisters
    }

    findChangedRegisterId(previousRegister, currentRegister) {
        for (let i = 0; i < currentRegister.length; i++) {
            if (currentRegister[i].value !== previousRegister[i]) {
                return i;
            }
        }
    }

    updateChangedRegister(newRegisters, stepNumber) {
        if (stepNumber !== 0) {
            const previousResgister = this.state.executionResult[stepNumber - 1].previousStateRegisters.registers;
            const registerId = this.findChangedRegisterId(previousResgister, newRegisters);
            if (registerId !== undefined) {
                newRegisters[registerId].isLatestUpdatedRegister = true;
            }
        }
    }

    static createNewRegisterState(registerValues, programCounter, argLength = 1) {
        const registers = new Array(registersCount).fill(1).map((_, i) => ({ id: i + 1, value: undefined }));
        (registerValues || []).forEach((value, i) => {
            registers[i].value = value;
        });
        if (programCounter !== undefined) {
            Sprinter.markProgramCounterAndArgs(registers, programCounter, argLength);
        }
        return registers;
    }

    static markProgramCounterAndArgs(registers, programCounter, argLength) {
        registers[programCounter].isCurrentInstruction = true;
        for (let i = programCounter + 1; i < programCounter + argLength; i++) {
            registers[i].isArg = true;
        }
    }

}