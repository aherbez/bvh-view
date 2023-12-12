import { useEffect, useRef } from "react";
import { BVHData } from "../parser";
import { buildSkeleton, SkeletonResult } from "../skeleton_utils";

export interface SkeletonViewerProps {
    data: BVHData | undefined
}

const SkeletonViewer = (props: SkeletonViewerProps) => {
    const root = useRef<any>();

    useEffect(() => {
        if (props.data) {
            const res: SkeletonResult = buildSkeleton(props.data);

            if (root.current) {
                root.current.add(res.skeleton.bones[0]);
                root.current.add(res.helper);    
            }
        }

    }, [props.data]);
    

    return (
        <group
            ref={root}
        >
        </group>
    );
}

export default SkeletonViewer;