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

const ActionBtn = ({ showActionBtn, title, onClick }) => {
    if (showActionBtn) {
        return <button onClick={onClick} className='btn'>{title}</button>
    } else {
        return <></>
    }
}

const Modal = (props) => {
    if (!props.isEnabled) {
        return <></>
    }
    const className = props.className ? `modal ${props.className}` : 'modal';
    const actionBtnOptions = props.actionBtnOptions || {};

    return (<div className={className}>
        <form>
            <CloseBtn nonCloseable={props.nonCloseable} onClose={props.onClose} />
            <div className='modal-body'>
                {props.children}
            </div>
            <ActionBtn
                showActionBtn={actionBtnOptions.isEnabled}
                onClick={actionBtnOptions.onClick}
                title={actionBtnOptions.title}
            />
        </form>
    </div>)
}

export default Modal;
