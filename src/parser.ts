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

type BoneData = {
    name: string,
    offset: number[],
    channels: string[],
    parent: string | null,
    frameData: number[][]
}

type AnimationData = {
    numFrames: number,
    frameTime: number,
    frameData: number[][]
}

const parseSkeleton = (skeletonDataString: string): string => {
    const lines = skeletonDataString.split('\n');

    const bones: BoneData[] = [];
    let rootName: string;
    let currBone: BoneData | null = null;
    let currParent: BoneData | null = null;

    let boneLookup = new Map<string, BoneData>();

    const newBone = (boneName: string, parentBone: BoneData | null): BoneData => {
        return {
            name: boneName,
            offset: [],
            channels: [],
            parent: (parentBone) ? parentBone.name : null,
            frameData: []
        }
    }

    let p;
    lines.forEach(l => {
        p = getParts(l);
        console.log(p[0]);
        switch (p[0]) {
            case 'HEIRARCHY':
                break;
            case 'ROOT':
                rootName = p[1];
                currBone = newBone(rootName, null);
                boneLookup.set(rootName, currBone);
                currParent = currBone;
                console.log(currBone);
                break;
            case 'JOINT':
                if (currBone) {
                    bones.push(currBone);
                }
                currBone = newBone(p[1], currParent);
                boneLookup.set(p[1], currBone);
                currParent = currBone;
                break;
            case 'End':
                if (currBone) {
                    bones.push(currBone);
                }
                const endName = (currParent) ? `${currParent.name}-end` : 'end';
                currBone = newBone(endName, currParent);
                boneLookup.set(endName, currBone);
                break;
            case '{':
                break;
            case '}':
                // go up in the heirarchy
                if (currParent && currParent.parent) {
                    const newParent = boneLookup.get(currParent?.parent);
                    if (newParent) currParent = newParent;
                }
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

    return JSON.stringify(bones, null, 2);

}

const parseAnimation = (animationDataString: string): string => {
    // const lines = animationDataString.split('\n');
    const lines = getLines(animationDataString);
    
    let numFrames: number = 0;
    let frameTime: number = 0;
    let frameData: number[][] = [];
    
    lines.forEach(l => {
        const p = getParts(l);
        console.log(p[0]);
        switch (p[0]) {
            case 'Frames:':
                numFrames = parseInt(p[1]);
                break;
            case 'Frame':
                frameTime = parseFloat(p[2]);
                break;
            default:
                frameData.push(
                    getPartsAsFloats(l)
                );
                break;
        }
    });

    return JSON.stringify({
        numFrames,
        frameTime,
        frameData
    }, null, 2);

}

const parseBVH = (fileContents: string ):string[] => {
    const sections = fileContents.split('MOTION');

    const skeleton = parseSkeleton(sections[0]);    
    const animData = parseAnimation(sections[1]);

    return [skeleton, animData];
}

export {
    parseBVH
}