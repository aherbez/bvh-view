import {
    getLines,
    getParts,
    getPartsAsFloats,
    getVector
} from './utils'

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

export type BoneData = {
    id: number,
    name: string,
    offset: number[],
    channels: string[],
    parent: number,
    frameData: number[][]
}

type AnimationData = {
    numFrames: number,
    frameTime: number,
    frameData: number[][]
}


class BVHData {
    bones: Map<number, BoneData>;
    channelLookup: Map<number, number>;
    animationData: AnimationData;

    constructor(fileContents: string) {

        this.bones = new Map();
        this.channelLookup = new Map();

        this.animationData = {
            numFrames: 0,
            frameTime: 0,
            frameData: []
        }
    
        this.bones.clear();
        this.channelLookup.clear();

        const sections = fileContents.split('MOTION');

        this.parseSkeleton(sections[0]);    
        this.parseAnimation(sections[1]);
    }


    parseSkeleton (skeletonDataString: string) {
        const lines = skeletonDataString.split('\n');

        // const bones: BoneData[] = [];
        
        let currBone: BoneData | null = null;
        let currParent: BoneData | null = null;

        let currBoneID = 1;
        let boneLookup = new Map<string, BoneData>();
    
        let channelCount = 0;
    
        const newBone = (boneName: string, parentBone: BoneData | null): BoneData => {
            const b = {
                id: currBoneID,
                name: boneName,
                offset: [],
                channels: [],
                parent: (parentBone) ? parentBone.id : -1,
                frameData: []
            }
            currBoneID++;
            return b;
        }
    
        let p;
        lines.forEach(l => {
            p = getParts(l);
            switch (p[0]) {
                case 'HEIRARCHY':
                    break;
                case 'ROOT':
                    currBone = newBone(p[1], null);
                    boneLookup.set(p[1], currBone);
                    this.bones.set(currBone.id, currBone);
                    currParent = currBone;
                    
                    break;
                case 'JOINT':
                    /*
                    if (currBone) {
                        bones.push(currBone);
                    }
                    */
                    currBone = newBone(p[1], currParent);
                    boneLookup.set(p[1], currBone);
                    this.bones.set(currBone.id, currBone);
                    currParent = currBone;
                    break;
                case 'End':
                    /*
                    if (currBone) {
                        bones.push(currBone);
                    }
                    */
                    const endName = (currParent) ? `${currParent.name}-end` : 'end';
                    currBone = newBone(endName, currParent);
                    this.bones.set(currBone.id, currBone);
                    boneLookup.set(endName, currBone);
                    break;
                case '{':
                    break;
                case '}':
                    // go up in the heirarchy
                    if (currParent && currParent.parent) {
                        const newParent = this.bones.get(currParent?.parent);
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
                    for (let i=0; i < currBone.channels.length; i++) {
                        this.channelLookup.set(channelCount + i, currBone.id);
                    }
                    channelCount += currBone.channels.length;
                    break;
                default:
                    break;
            }
        });
    }

    parseAnimation (animationDataString: string) {
        // const lines = animationDataString.split('\n');
        const lines = getLines(animationDataString);
        
        let currFrame = 0;
        let currBoneID = -1;
        let currBone: BoneData | undefined;

        lines.forEach(l => {
            const p = getParts(l);
            switch (p[0]) {
                case 'Frames:':
                    this.animationData.numFrames = parseInt(p[1]);
                    break;
                case 'Frame':
                    this.animationData.frameTime = parseFloat(p[2]);
                    break;
                default:
                    const vals = getPartsAsFloats(l);
                    this.animationData.frameData.push(vals);

                    vals.forEach((v, i) => {
                        
                        let boneID = this.channelLookup.get(i);
                        
                        // only grab the next bone if we actually need to
                        if (boneID && boneID !== currBoneID) {
                            currBone = this.bones.get(boneID);
                            if (currBone) {
                                currBone.frameData[currFrame] = [];
                            }
                            currBoneID = boneID;
                        }
                        if (currBone) {
                            currBone.frameData[currFrame].push(v);
                        }
                    });

                    currFrame++;

                    break;
            }
        });    
    }
    
    get skeletonData (): string {
        const boneData = Array.from(this.bones.entries());
        return JSON.stringify(boneData, null, 2);
    }

    get frameData ():string {
        return JSON.stringify(this.animationData, null, 2);
    }
}

export {
    BVHData
}