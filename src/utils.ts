const getLines = (s: string): string[] => {
    return s.split(/[\n\r]/).filter(s => s !== '');
}

const getParts = (s: string): string[] => {
    return s.split(/[\s]/).map(s => s.trim()).filter(s => s !== '');
}

const getPartsAsFloats = (s: string): number[] => {
    return getParts(s).map(s => parseFloat(s));
}

const getVector = (parts: string[]): number[] => {
    return parts.map(p => parseFloat(p));
}

export {
    getLines,
    getParts,
    getPartsAsFloats,
    getVector
}