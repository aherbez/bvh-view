import * as THREE from 'three';
import { BVHData, BoneData } from "./parser";

export type SkeletonResult = {
    skeleton: THREE.Skeleton,
    helper: THREE.SkeletonHelper
}

const buildSkeleton = (data: BVHData): SkeletonResult => {
    const bones: THREE.Bone[] = [];

    const boneLookup = new Map<number, THREE.Bone>();

    const boneData: BoneData[] = Array.from(data.bones.values());

    // make the bones
    boneData.forEach(bData => {
        let b = new THREE.Bone();
        b.position.set(bData.offset[0], bData.offset[1], bData.offset[2]);
        boneLookup.set(bData.id, b);
        bones.push(b);
    });

    // setup the parenting
    boneData.forEach(bData => {
        let child = boneLookup.get(bData.id);
        let parent = boneLookup.get(bData.parent);

        if (!!parent && !!child) {
            parent.add(child);
        }
    });

    const skeleton = new THREE.Skeleton(bones);
    const helper = new THREE.SkeletonHelper(bones[0]);


    console.log(skeleton);

    return {
        skeleton,
        helper
    };
}

export {
    buildSkeleton
}