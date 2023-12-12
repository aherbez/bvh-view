import { Canvas } from "@react-three/fiber";
import { FC, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { parseBVH } from "../parser";
import '../App.css';

const Viewer: FC = () => {

    const [output, setOutput] = useState('');
    const [output2, setOutput2] = useState('');


    const loadFile = async (e:any) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target && e.target.result) {
                const text = e.target.result.toString();
                
                // setOutput(text);
                
                const res = parseBVH(text);
                setOutput(res[0]);
                setOutput2(res[1]);
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
            </Canvas>

        </div>

                
        <div id="panel-controls">
            <input type="file" onChange={(e) => loadFile(e)} />
            <br />
            <textarea
                rows={20}
                cols={80}
                defaultValue={output}
            />
            <textarea 
                rows={20}
                cols={80}
                defaultValue={output2}
            />
        </div>
    </div>
    );
}

export default Viewer;