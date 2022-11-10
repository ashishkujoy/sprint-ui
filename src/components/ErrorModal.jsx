import Modal from "./Modal"

const ErrorModal = ({ enabled, error, onClose }) => {
    return <Modal
        isEnabled={enabled}
        nonCloseable={false}
        onClose={onClose}
    >
        <div className='error-message'>{(error || {}).message}</div>
    </Modal>
}

export default ErrorModal;
