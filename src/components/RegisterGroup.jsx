const toGroupOf = (elements, groupSize) => {
    const groups = [];
    for (let i = 0; i < elements.length; i += groupSize) {
        groups.push(elements.slice(i, i + groupSize));
    }
    return groups;
}

const getRegisterClassName = (register) => {
    if (register.isHaltInstruction) {
        return 'halt-statement';
    }
    if (register.isCurrentInstruction) {
        return 'pc-head';
    }
    if (register.isArg) {
        return 'arg';
    }
    if (register.isLatestUpdatedRegister) {
        return 'last-updated-register';
    }
    return '';
}

const Register = ({ details }) => {
    const { id, value } = details;
    const className = `register ${getRegisterClassName(details)}`;

    return (<td>
        {value !== undefined ? <div className={className}>{value}</div> : <div className={className}></div>}
        <div className='register-id'>{id}</div>
    </td>)
}

const RegisterRow = ({ registers }) => {
    return (<tr className='register-row'>
        {registers.map((register) => <Register details={register} key={register.id} />)}
    </tr>)
}

const ResetOrRunButton = ({ runEnabled, resetEnabled, onRunClick, onResetClick }) => {
    if (resetEnabled) {
        return <button
            className='action-btn'
            onClick={onResetClick}>
            Jump to start
        </button>
    } else {
        return <button
            className={`action-btn ${runEnabled ? '' : 'disabled'}`}
            onClick={runEnabled ? onRunClick : () => { }}>
            Run
        </button>
    }           
}

const RegisterGroup = (props) => {
    const groupedRegisters = toGroupOf(props.registers, 16);

    return (<div>
        <div className='register-container light-border'>
            <table>
                <tbody>
                    {groupedRegisters.map((registers, i) => <RegisterRow registers={registers} key={i} />)}
                </tbody>
            </table>
        </div>
        <div>
            <ResetOrRunButton
                runEnabled={props.runEnabled}
                onRunClick={props.onRunClick}
                resetEnabled={props.resetEnabled}
                onResetClick={props.onResetClick}
            />
            <button
                className={`action-btn ${props.previousStepEnabled ? '' : 'disabled'}`}
                onClick={props.previousStepEnabled ? props.onPreviousStepClick : () => { }}>
                Previous Step
            </button>
            <button
                className={`action-btn ${props.nextStepEnabled ? '' : 'disabled'}`}
                onClick={props.nextStepEnabled ? props.onNextStepClick : () => { }}>
                Next Step
            </button>
        </div>
    </div>)
}

export default RegisterGroup;
