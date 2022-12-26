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

const removeLableDeclaration = (token) => token.substr(token.indexOf(':') + 1, token.length);

export const toInts = (code) => {
    return code.trim()
        .split('\n')
        .flatMap(line => line.trim().split(' ').map(removeLableDeclaration))
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
    if (line.includes(';')) {
        return line.substring(0, line.indexOf(';')).trim();
    }
    return line.trim();
}

const addLableIfNotPresent = (labels, label, position, failOnDuplicate) => {
    if (labels[label] && failOnDuplicate) {
        throw new Error(`Lable ${label} already declared for cell number ${labels[label]}`);
    }
    labels[label] = position;
}

export const getLabelsAndTokens = (rawCode, failOnDuplicate = true) => {
    return rawCode.split('\n')
        .map(ignoreComment)
        .filter(line => line !== '')
        .reduce((acc, line) => {
            const tokens = line.replaceAll(':', ': ').split(/\s+/).filter(token => token !== '');
            tokens.forEach(token => {
                if (token.includes(':')) {
                    const label = token.replace(':', '').trim();
                    addLableIfNotPresent(acc.labels, label, acc.cellsCount, failOnDuplicate);
                } else {
                    acc.cellsCount += 1;
                }
            });
            tokens.filter(token => !token.includes(':')).forEach(token => acc.tokensWithOutLableDeclaration.push(token))
            return acc;
        }, { labels: {}, cellsCount: 1, tokensWithOutLableDeclaration: [] });
}

const updateLabelsWithCellPositions = (context) => {
    Object.keys(context.labels).forEach(label => {
        const updatedTokens = context.tokensWithOutLableDeclaration
            .map(token => token === label ? context.labels[label].toString() : token);

        context.tokensWithOutLableDeclaration = updatedTokens;
    });
    return context;
}

const validateNoUndeclaredVariableIsUsed = (context) => {
    context.tokensWithOutLableDeclaration.forEach((token, index) => {
        if (isNaN(parseInt(token))) {
            throw new Error(`Use of undeclared label ${token} at cell number ${index + 1}`);
        }
    });
    return context;
}

export const updateLablesWithCellPositions = (rawCode) => {
    const context = getLabelsAndTokens(rawCode);
    
    updateLabelsWithCellPositions(context);
    validateNoUndeclaredVariableIsUsed(context);
    
    return context.tokensWithOutLableDeclaration.join(' ');
}