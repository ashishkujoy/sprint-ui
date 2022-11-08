export const repeat = (times, callback, delay) => {
    return new Promise((res, rej) => {
        let handle;
        let count = 0;
        handle = setInterval(() => {
            if (count < times) {
                try {
                    callback();
                } catch (e) { 
                    rej(e);
                } finally {
                    count++;
                }
            } else {
                clearInterval(handle);
                res();
            }
        }, delay);
    })
}

export const toInts = (code) => {
    return code.trim()
        .split('\n')
        .flatMap(line => line.trim().split(' '))
        .filter(code => code.trim() !== '')
        .map(code => parseInt(code));
}

export const saveProgram = (programName, code) => {
    const existingCode = JSON.parse(localStorage.getItem('sprintPrograms') || '{}');
    existingCode[programName] = code;
    localStorage.setItem('sprintPrograms', JSON.stringify(existingCode));
}
