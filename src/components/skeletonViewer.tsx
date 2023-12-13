import { useEffect, useRef, useState } from "react";
import { BVHData } from "../parser/parser";
import { buildSkeleton, SkeletonResult } from "../parser/skeleton_utils";
import { useFrame } from "@react-three/fiber";

export interface SkeletonViewerProps {
    data: BVHData | undefined
}

const SkeletonViewer = (props: SkeletonViewerProps) => {
    const root = useRef<any>();
    const [mixer, setMixer] = useState<THREE.AnimationMixer>();

    useEffect(() => {
        if (props.data) {
            const res: SkeletonResult = buildSkeleton(props.data);

            if (root.current) {
                root.current.add(res.skeleton.bones[0]);
                root.current.add(res.helper);    
            }

            setMixer(res.mixer);
        }

    }, [props.data]);
    
    useFrame((_, delta) => {
        if (mixer) {
            mixer.update(delta);
        }
    });


    return (
        <group
            ref={root}
        >
        </group>
    );
}

export default SkeletonViewer;