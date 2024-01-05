import { Canvas } from "@react-three/fiber";
import { FC, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { BVHData } from "../parser/parser";
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
                <gridHelper args={[100, 10]}/>

                <SkeletonViewer 
                    data={bvhData}
                />
            </Canvas>

        </div>

                
        <div id="panel-controls">
            <div>
                This is a simple viewer / parser for BVH files. If you want to try it, you'll need a BVH file. Once you have one, use the button below to load it. <br />
                The data is parsed and loaded into an intermediate format. That intermediate data is displayed below as text, and used to create a skeleton and animation tracks. The skeleton loads into the scene at left with the animation playing, though you might need to move the camera around a big to see it.
            </div>

            <input type="file" onChange={(e) => loadFile(e)} />
            <br />
            <textarea
                rows={35}
                cols={80}
                defaultValue={output}
            />
        </div>
    </div>
    );
}

export default Viewer;