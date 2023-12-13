import * as THREE from 'three';
import { BVHData, BoneData } from "./parser";
import { degToRad } from 'three/src/math/MathUtils.js';

export type SkeletonResult = {
    skeleton: THREE.Skeleton,
    helper: THREE.SkeletonHelper,
    mixer: THREE.AnimationMixer
}

const posChannels = ['pX', 'pY', 'pZ'];
const rotChannels = ['rX', 'rY', 'rZ'];

const findOffsets = (channels: string[], channelNames: string[]): number[] | null => {
    const indices = [];
    for (let i=0; i < channelNames.length; i++) {
        indices[i] = channels.indexOf(channelNames[i]);
        if (indices[i] === -1) return null;
    }
    return indices;
}

const quatFromFrame = (rotX: number, rotY: number, rotZ: number): THREE.Quaternion => {
    const q = new THREE.Quaternion();

    const e = new THREE.Euler(
        degToRad(rotX),
        degToRad(rotY),
        degToRad(rotZ), 
        'ZXY'
    );
    q.setFromEuler(e);

    return q;
}


const buildSkeleton = (data: BVHData): SkeletonResult => {
    const bones: THREE.Bone[] = [];

    const boneLookup = new Map<number, THREE.Bone>();
    const boneData: BoneData[] = Array.from(data.bones.values());

    let times = Array(data.animationData.numFrames).fill(0);
    times = times.map((_,i) => {
        return (data.animationData.frameTime * (i+1));   
    });

    // make the bones
    boneData.forEach(bData => {
        let b = new THREE.Bone();
        b.position.set(bData.offset[0], bData.offset[1], bData.offset[2]);
        b.name = bData.name;
        boneLookup.set(bData.id, b);
        bones.push(b);
    });


    const tracks: THREE.KeyframeTrack[] = [];

    // setup the parenting
    boneData.forEach(bData => {
        let child = boneLookup.get(bData.id);
        let parent = boneLookup.get(bData.parent);

        if (!!parent && !!child) {
            // console.log(child.name, '->', parent.name);
            parent.add(child);
        }
   
        // make an animation track
        console.log('channels', bData.channels, bData.frameData);
        
        // maybe make rotation track
        const rotOffsets = findOffsets(bData.channels, rotChannels);
        if (rotOffsets) {
            const values = [];
            // make a Quaternion for each frame
            for (let i=0; i < bData.frameData.length; i++) {
                let q = quatFromFrame(
                    bData.frameData[i][rotOffsets[0]],
                    bData.frameData[i][rotOffsets[1]],
                    bData.frameData[i][rotOffsets[2]]
                );
                values.push(...q.toArray());
            }

            const track = new THREE.QuaternionKeyframeTrack(
                `${child?.uuid}.quaternion`,
                times, 
                values, 
                THREE.InterpolateSmooth
            );

            tracks.push(track);
        }

        const posOffsets = findOffsets(bData.channels, posChannels);
        if (posOffsets) {
            const values = [];
            for (let i=0; i < bData.frameData.length; i++) {
                values.push(
                    bData.frameData[i][posOffsets[0]],
                    bData.frameData[i][posOffsets[1]],
                    bData.frameData[i][posOffsets[2]]
                );
            }

            const track = new THREE.VectorKeyframeTrack(
                `${child?.uuid}.position`,
                times,
                values
            );

            tracks.push(track);
        }

    });

    const skeleton = new THREE.Skeleton(bones);
    const helper = new THREE.SkeletonHelper(bones[0]);

    const mixer = new THREE.AnimationMixer(bones[0]);
    const animClip = new THREE.AnimationClip(
        'animation',
        data.animationData.frameTime * data.animationData.numFrames,
        tracks
    );
    mixer.clipAction(animClip).play();

    return {
        skeleton,
        helper,
        mixer
    };
}

export {
    buildSkeleton
}