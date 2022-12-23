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
        .filter(code => code.trim() !== '' && !code.includes(':'))
        .map(code => {
            const parsedValue = parseInt(code);
            return isNaN(parsedValue) ? code : parsedValue;
        });
}

export const saveProgram = (programName, code) => {
    const existingCode = JSON.parse(localStorage.getItem('sprintPrograms') || '{}');
    existingCode[programName] = code;
    localStorage.setItem('sprintPrograms', JSON.stringify(existingCode));
}

export const toGroupOf = (elements, groupSize) => {
    const groups = [];
    for (let i = 0; i < elements.length; i += groupSize) {
        groups.push(elements.slice(i, i + groupSize));
    }
    return groups;
}

export const ignoreComment = (line) => {
    // if (line.includes(';')) {
    //     return line.substring(0, line.indexOf(';')).trim();
    // }
    return line.trim();
}

const addLableIfNotPresent = (lables, lable, position) => {
    if (lables[lable]) {
        throw new Error(`Lable ${lable} already declared for cell number ${lables[lable]}`);
    }
    lables[lable] = position;
}

export const updateLablesWithCellPositions = (rawCode) => {
    const context = rawCode.split('\n')
        .map(ignoreComment)
        .filter(line => line !== '')
        .reduce((acc, line) => {
            const tokens = line.replaceAll(':', ': ').split(/\s+/).filter(token => token !== '');
            tokens.forEach(token => {
                if (token.includes(':')) {
                    const lable = token.replace(':', '').trim();
                    addLableIfNotPresent(acc.lables, lable, acc.cellsCount);
                } else {
                    acc.cellsCount += 1;
                }
            });
            tokens.filter(token => !token.includes(':')).forEach(token => acc.tokensWithOutLableDeclaration.push(token))
            return acc;
        }, { lables: {}, cellsCount: 1, tokensWithOutLableDeclaration: [] });
    Object.keys(context.lables).forEach(lable => {
        const updatedTokens = context.tokensWithOutLableDeclaration
            .map(token => token == lable ? context.lables[lable].toString() : token);

        context.tokensWithOutLableDeclaration = updatedTokens;
    });
    context.tokensWithOutLableDeclaration.forEach((token, index) => {
        if (isNaN(parseInt(token))) {
            throw new Error(`Use of undeclared lable ${token} at cell number ${index + 1}`);
        }
    })
    return context.tokensWithOutLableDeclaration.join(' ');
}