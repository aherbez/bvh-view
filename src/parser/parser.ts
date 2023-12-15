import {
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
    
        // const sections = fileContents.split('MOTION');

        this.parseData(fileContents);

        // this.parseSkeleton(sections[0]);    
        // this.parseAnimation(sections[1]);
    
    }

    createBone (boneName: string, parentBone: BoneData | null, currBoneID: number): BoneData {
        const b = {
            id: currBoneID,
            name: boneName,
            offset: [],
            channels: [],
            parent: (parentBone) ? parentBone.id : -1,
            frameData: []
        }
        this.bones.set(currBoneID, b);
        return b;
    }

    parseData (skeletonDataString: string) {
        const lines = skeletonDataString.split('\n').filter(l => l !== '');

        let currBone: BoneData | undefined;
        let currParent: BoneData | null = null;

        let currBoneID = 1;    
        let channelCount = 0;
        let currFrame = 0;

        let p;
        lines.forEach(l => {
            p = getParts(l);
            switch (p[0]) {
                case '{':       // handled by the JOINT/ROOT/End Site lines 
                case 'HEIRARCHY':
                    break;
                case 'MOTION':
                    currBoneID = -1; 
                    currFrame = 0;
                    break;
                case 'ROOT':
                case 'JOINT':
                    currBone = this.createBone(p[1], currParent, currBoneID);
                    currBoneID++;
                    currParent = currBone;                    
                    
                    break;
                case 'End':
                    const endName = (currParent) ? `${currParent.name}-end` : 'end';
                    
                    currBone = this.createBone(endName, currParent, currBoneID);
                    currBoneID++;
                    currParent = currBone;
                    
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