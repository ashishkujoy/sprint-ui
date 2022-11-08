import { useState } from "react";
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

const Editor = ({ onVerifyCode, onCodeChange, codeVerified }) => {
    const [code, setCode] = useState('0 45 100\n0 55 101\n1 100 101 102\n9');

    const onLoadCodeClick = () => {
        onVerifyCode(code.trim());
    }

    const onChange = (value) => {
        setCode(value);
        onCodeChange(value);
    }

    return (<div className='editor-container'>
        <CodeMirror
            value={code}
            placeholder={code}
            height="720px"
            width='400px'
            onChange={onChange}
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
