import { FC, useState } from "react";
import { BVHData } from "../parser";

export interface SkeletonViewerProps {
    data: BVHData | undefined
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