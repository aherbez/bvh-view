const getParts = (s: string): string[] => {
    return s.split(/[\s]/).filter(s => s !== '');
}

const getVector = (parts: string[]): number[] => {
    return parts.map(p => parseFloat(p));
}

// TODO better return type than string
const normalizeChannelName = (name: string): string => {
    switch (name) {
        case 'Xposition':
            return 'pX';
        case 'Yposition':
            return 'pY';
        case 'Zposition':
            return 'pZ';
        case 'Zrotation':
            return 'rZ';
        case 'Xrotation':
            return 'rX';
        case 'Yrotation':
            return 'rY';
        default:
            return 'unknown';
    }
}

const getChannels = (parts: string[]): string[] => {
    return parts.slice(2).map(p => normalizeChannelName(p));
}

type BoneInfo = {
    name: string,
    offset: number[],
    channels: string[]
}

const parseBVH = (fileContents: string ):string => {
    const sections = fileContents.split('MOTION');
    
    
    const lines = sections[0].split('\n');

    const boneNames = [];
    const boneOffsets = [];
    
    const bones: BoneInfo[] = [];
    let rootName: string;
    let currBone: BoneInfo | null = null;

    let p;
    lines.forEach(l => {
        p = getParts(l);
        console.log(p[0]);
        switch (p[0]) {
            case 'HEIRARCHY':
                break;
            case 'ROOT':
                rootName = p[1];
                currBone = {
                    name: rootName,
                    offset: [],
                    channels: []
                }
                console.log(currBone);
                break;
            case 'JOINT':
                if (currBone) {
                    bones.push(currBone);
                }
                currBone = {
                    name: p[1],
                    offset: [],
                    channels: []
                }
                break;
            case '{':
                break;
            case '}':
                break;
            case 'OFFSET':
                if (!currBone) {
                    console.error('parse error');
                    return;
                }
                currBone.offset = getVector(p.slice(1));
                break;
            case 'CHANNELS':
                if (!currBone) {
                    console.error('parse error');
                    return;
                }
                currBone.channels = getChannels(p);
                break;
            default:
                break;
        }
    });
    console.log(bones);

    return JSON.stringify(bones);
}

export {
    parseBVH
}