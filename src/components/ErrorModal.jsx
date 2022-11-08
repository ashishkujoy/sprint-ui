
const ErrorModal = ({ enabled, error, onClose }) => {
    if (enabled) {
        return (<div className='error-modal'>
            <div className='error-message'>{error.message.replace('address', 'cell number')}</div>
            <button onClick={onClose}>Close</button>
        </div>)
    } else {
        return <></>
    }
    
}

export default ErrorModal;
