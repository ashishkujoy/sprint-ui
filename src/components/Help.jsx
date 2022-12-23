import CodeMirror from '@uiw/react-codemirror';

const helpDetails = require('../help.json');

const CodeBlock = ({ code }) => {
    return <CodeMirror
        value={code}
        editable={false}
        basicSetup={{
            lineNumbers: true,
            indentOnInput: true,
        }}
    />
}

const ExampleBlock = ({ example }) => {
    if (example.trim().startsWith('CODE-BLOCK')) {
        return <CodeBlock code={example.replace('CODE-BLOCK ', '')} />
    } else {
        return <p>{ example }</p>
    }
}

const InstructionDetails = ({ name, shortDescription, syntax ,example }) => {
    return (<div className='instruction-detail'>
        <h3>{name}</h3>
        <h4>{shortDescription}</h4>
        <h5> Syntax : { syntax }</h5>
        {example.map((ex, i) => <ExampleBlock key={i} example={ex} />)}
    </div>)
}

const Help = ({ enabled, closeHelp }) => {
    if (enabled) {
        return <div className='help-modal'>
            <div className='close-help-btn'>
                <span onClick={closeHelp}>X</span>
            </div>
            <div className='help-message'>
                <h1>Sprint Simulator</h1>
                <h2>Supported Instruction</h2>
                {helpDetails.instructionDetails.map((detail, i) => <InstructionDetails {...detail} key={`${i}-inst`} />)}
                <h2>Other features</h2>
                {helpDetails.otherFeatures.map((detail, i) => <InstructionDetails {...detail} key={`${i}-feature`} />)}
            </div>
        </div>
    } else {
        return <></>
    }
}

export default Help;