import CodeMirror from '@uiw/react-codemirror';

const CodeVerficationButton = ({ codeVerified, onLoadCodeClick }) => {
    if (codeVerified) {
        return (<button className='execute-btn code-verified' disabled={true}>
            Code Verified
        </button>)
    } else {
        return (<button className='execute-btn' onClick={onLoadCodeClick}>
            Verify Code
        </button>)
    }
}

const Editor = ({ onVerifyCode, onCodeChange, codeVerified, code }) => {

    const onLoadCodeClick = () => {
        onVerifyCode(code.trim());
    }

    return (<div className='editor-container'>
        <CodeMirror
            value={code}
            placeholder={code}
            height="720px"
            width='320px'
            onChange={onCodeChange}
            autoFocus={true}
            basicSetup={{
                highlightActiveLine: true,
                indentOnInput: true,
                highlightActiveLineGutter: true
            }}
            className='editor light-border'
        />
        <CodeVerficationButton codeVerified={codeVerified} onLoadCodeClick={onLoadCodeClick} />
    </div>)
}

export default Editor;
