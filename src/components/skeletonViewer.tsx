import { FC, useState } from "react";
import { BVHParser } from "../parser";

export interface SkeletonViewerProps {
    data: BVHParser | undefined
}

const SkeletonViewer = (props: SkeletonViewerProps) => {
    return (
        <group>
            {props.data && 
                <mesh
                    position={[0, 2, 0]}
                >
                    <sphereGeometry />
                    <meshBasicMaterial color={"slateblue"} />
                </mesh>
            }
        </group>
    );
}

export default SkeletonViewer;