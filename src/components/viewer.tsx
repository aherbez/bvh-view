import { Canvas } from "@react-three/fiber";
import { FC, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { BVHData } from "../parser";
import SkeletonViewer from "./skeletonViewer";
import '../App.css';

const Viewer: FC = () => {

    const [output, setOutput] = useState('');
    const [bvhData, setBVHData] = useState<BVHData>();

    const loadFile = async (e:any) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target && e.target.result) {
                const text = e.target.result.toString();
                
                const bvhData = new BVHData(text);

                setOutput(bvhData.skeletonData);

                setBVHData(bvhData);
            }
        }
        reader.readAsText(e.target.files[0]);   
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

                <SkeletonViewer 
                    data={bvhData}
                />
            </Canvas>

        </div>

                
        <div id="panel-controls">
            <input type="file" onChange={(e) => loadFile(e)} />
            <br />
            <textarea
                rows={40}
                cols={80}
                defaultValue={output}
            />
        </div>
    </div>
    );
}

export default Viewer;