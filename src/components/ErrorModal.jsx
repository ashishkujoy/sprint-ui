
const ErrorModal = ({ error, onClose }) => {
    console.log(error);
    return (<div className='error-modal'>
        <div className='error-message'>{error.message.replace('address', 'cell number')}</div>
        <button onClick={onClose}>Close</button>
    </div>)
}

export default ErrorModal;
