# bvh-view

## Progress log

### 2023/12/11
8:21    Created repo

8:25    Project setup: vite, react, three, react-three/fiber

8:32    Setup automatic deploys via netlify 

9:00    Setup basic scene w/ 3d view and button to load file (screen_001.png)

9:15    Loading BVH file and dumping text to textarea as sanity check (screen_002.png)
        Starting in on actual parsing, starting with skeleton

9:45    Parsing bone positions and channels, storing as array of BoneData and dumping to
        output textarea as stringified JSON. Next: ensuring proper parent info (screen_003.png)

10:00   Realized I missed adding the endpoints, fixed that and added proper handling of 
        closing parens to go back up the chain for proper hierarchy (screen_004.png - note that
        "LeftCollar" was parsed after "Head", but is parented to "Hips")
        Starting to think about keeping the channel data straight for frame parsing

10 - 10:30  Break (dad stuff)

