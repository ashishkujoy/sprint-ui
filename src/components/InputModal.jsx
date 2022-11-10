import { useState } from 'react';
import Modal from './Modal';

export const InputModal = ({ enabled, onSubmit, className }) => {
    const [number, setNumber] = useState(0)
    return <Modal
        isEnabled={enabled}
        nonCloseable={false}
        className={className}>
        <p>Enter a number</p>
        <input type='number' value={number} onChange={(e) => setNumber(e.target.value)}></input>
        <button onClick={() => onSubmit(parseInt(number.trim()))}>Submit</button>
    </Modal>
    // if (enabled) {

    //     return <div className={`prompt ${className ? className : ''}`}>
    //         <p>Enter a number</p>
    //         <input type='number' value={number} onChange={(e) => setNumber(e.target.value)}></input>
    //         <button onClick={() => onSubmit(parseInt(number.trim()))}>Submit</button>
    //     </div>
    // } else {
    //     <></>
    // }

}

export default InputModal;