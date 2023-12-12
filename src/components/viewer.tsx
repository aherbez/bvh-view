import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import { OrbitControls } from "@react-three/drei";

import { GridHelper } from "three";
import '../App.css';

const Viewer: FC = () => {
    const loadBVH = () => {

    }

    return (
    <div>
        <div id="main-stage">
            <Canvas>
                <OrbitControls />
                <gridHelper />
                <mesh>
                    <meshBasicMaterial color={"tomato"} />
                    <boxGeometry args={[1,1,1]} />
                </mesh>
            </Canvas>

        </div>

                
        <div id="panel-controls">
            <button onClick={loadBVH}>LOAD</button>
        </div>
    </div>
    );
}

export default Viewer;