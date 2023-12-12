# bvh-view

## Progress log

### 2023/12/11
8:21    Created repo

8:25    Project setup: vite, react, three, react-three/fiber

8:32    Setup automatic deploys via netlify 

9:00    Setup basic scene w/ 3d view and button to load file ![screenshot 1]('https://github.com/aherbez/bvh-view/blob/main/screenshots/screen_001.png')

9:15    Loading BVH file and dumping text to textarea as sanity check (screen_002.png)
        Starting in on actual parsing, starting with skeleton

9:45    Parsing bone positions and channels, storing as array of BoneData and dumping to
        output textarea as stringified JSON. Next: ensuring proper parent info (screen_003.png)

10:00   Realized I missed adding the endpoints, fixed that and added proper handling of 
        closing parens to go back up the chain for proper hierarchy (screen_004.png - note that
        "LeftCollar" was parsed after "Head", but is parented to "Hips")
        Starting to think about keeping the channel data straight for frame parsing

10 - 10:40  Break (dad stuff), plus restarting machine

11:00   Parsing animation frame data (screen_005.png)

11:48   Refactored all the parsing and folded in the frame data onto the bone data
        (screen_006.png). Now, each bone entry contains an array with its per-frame data. 
        Re the refactor: I started out with something close to a pure functional approach for the parsing, which was great up to the point of applying
        the frame data to the bones. At that point, it made sense to switch to a
        class, rather than passing around the channelIndex->boneID map.

        Calling it a night- will setup a proper ThreeJS skeleton and animation channel tomorrow

12:48   Couldn't help it- went ahead and set up a proper ThreeJS Skeleton from the data
        and a SkeletonHelper to visualize it (screen_007.png)