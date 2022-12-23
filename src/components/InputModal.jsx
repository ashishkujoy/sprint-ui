import { useState } from 'react';
import Modal from './Modal';

export const InputModal = ({ enabled, onSubmit, className }) => {
    const [number, setNumber] = useState()
    return <Modal
        isEnabled={enabled}
        nonCloseable={true}
        className={className}>
        <p>Enter a number</p>
        <form onSubmit={() => alert(number)}>
            <input
                type='number'
                autoFocus={true}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                style={{ textAlign: 'center' }}
            ></input>
            <button onClick={() => {
                onSubmit(parseInt(number));
                setNumber();

            }}>Submit</button>
        </form>
    </Modal>
}

export default InputModal;