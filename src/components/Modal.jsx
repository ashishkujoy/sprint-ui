import '../styles/modal.css';

const CloseBtn = ({ nonCloseable, onClose }) => {
    if (nonCloseable) {
        return <></>
    } else {
        return <div className='close-btn'>
            <span onClick={onClose} style={{ cursor: "pointer" }}>X</span>
        </div>
    }
}

const Modal = (props) => {
    if (!props.isEnabled) {
        return <></>
    }
    const className = props.className ? `modal ${props.className}` : 'modal';

    return (<div className={className}>
        <CloseBtn nonCloseable={props.nonCloseable} onClose={props.onClose} />
        <div className='modal-body'>
            {props.children}
        </div>
    </div>)
}

export default Modal;
