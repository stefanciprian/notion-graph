import SpriteText from 'three-spritetext';
import styles from './graph3d.module.scss';
import { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

type Coords = {
    x: number;
    y: number;
    z: number;
};

function Graph3D({ graphData, selectedNodeToZoom }: any) {
    const fgRef = useRef<any>();// Ref to access the ForceGraph3D instance
    const [selectedNode, setSelectedNode] = useState("");

    const zoomToNode = useCallback((node: any) => {
        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        if (fgRef.current.camera) {
            fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt ({ x, y, z })
                3000  // ms transition duration
            );
        }
    }, [fgRef]);

    const handleZoomIn = () => {
        const distanceFactor = 0.8;
        const currentPos = fgRef.current.camera().position;
        fgRef.current.cameraPosition(
            { x: currentPos.x * distanceFactor, y: currentPos.y * distanceFactor, z: currentPos.z * distanceFactor }, // zoom in
            currentPos, // current looking at
            1000  // ms transition duration
        );
    };

    const handleZoomOut = () => {
        const distanceFactor = 1.2;
        const currentPos = fgRef.current.camera().position;
        fgRef.current.cameraPosition(
            { x: currentPos.x * distanceFactor, y: currentPos.y * distanceFactor, z: currentPos.z * distanceFactor }, // zoom out
            currentPos, // current looking at
            1000  // ms transition duration
        );
    };

    const handleReset = () => {
        fgRef.current.cameraPosition(
            { x: 0, y: 0, z: 1000 }, // reset position
            { x: 0, y: 0, z: 0 }, // looking at the center
            1000  // ms transition duration
        );
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            // Enter full screen
            const elem = fgRef.current; // Adjust if necessary to select the right element
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        } else {
            // Exit full screen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).mozCancelFullScreen) { /* Firefox */
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) { /* Chrome, Safari & Opera */
                document.exitFullscreen();
            } else if ((document as any).msExitFullscreen) { /* IE/Edge */
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        if (selectedNodeToZoom) {
            setSelectedNode(selectedNodeToZoom);
            const node = graphData.nodes.find((node: any) => node.id === selectedNodeToZoom);
            if (node) {
                console.log("useEffect -> zoomToNode");
                zoomToNode(node);
            }
        }
    }, [graphData, selectedNodeToZoom, zoomToNode]);

    return (
        <div className={styles.webView} id="graph3d">
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="name"
                nodeAutoColorBy="group"
                linkThreeObjectExtend={true}
                linkThreeObject={(link: any) => {
                    const sprite = new SpriteText(`${link.rel.label ? link.rel.label : link.rel.name ? link.rel.name : link.rel.id}`);
                    sprite.color = 'lightgrey';
                    sprite.textHeight = 1.5;
                    return sprite;
                }}
                linkPositionUpdate={(sprite, { start, end }) => {
                    const middlePos: Coords = {
                        x: start.x + (end.x - start.x) / 2,
                        y: start.y + (end.y - start.y) / 2,
                        z: start.z + (end.z - start.z) / 2,
                    };

                    Object.assign(sprite.position, middlePos);
                }}
            />
            <div className={styles.controls}>
                <button onClick={handleZoomIn}>Zoom In</button>
                <button onClick={handleZoomOut}>Zoom Out</button>
                <button onClick={handleReset}>Reset</button>
                {/* <button onClick={toggleFullScreen}>Full Screen</Button> */}
            </div>
        </div>
    );
}

export default Graph3D;