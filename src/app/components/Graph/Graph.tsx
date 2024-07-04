import styles from './graph.module.scss';
import { useState, useEffect, useRef, useCallback } from 'react';

// Dynamic import with no SSR
import ForceGraph from 'react-force-graph-2d'

function Graph({ graphData, selectedNodeToZoom }: any) {
    const fgRef = useRef<any>(null);
    const [selectedNode, setSelectedNode] = useState("");

    const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level at 1 (100%)

    const handleZoomIn = useCallback(() => {
        if (fgRef.current) {
            const newZoomLevel = zoomLevel * 1.2; // Increase zoom level by 20%
            fgRef.current.zoom(newZoomLevel, 500);
            setZoomLevel(newZoomLevel);
        } else {
            console.error('Zoom function is not available');
        }
    }, [zoomLevel]);

    const handleZoomOut = useCallback(() => {
        if (fgRef.current) {
            const newZoomLevel = zoomLevel * 0.8; // Decrease zoom level by 20%
            fgRef.current.zoom(newZoomLevel, 500);
            setZoomLevel(newZoomLevel);
        } else {
            console.error('Zoom function is not available');
        }
    }, [zoomLevel]);

    const handleReset = useCallback(() => {
        if (fgRef.current && fgRef.current.zoomToFit) {
            fgRef.current.zoomToFit(500);
            setZoomLevel(1); // Reset zoom level to initial state
        } else {
            console.error('zoomToFit function is not available');
        }
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            const canvas = fgRef.current?.canvas; // Assuming the ref exposes `canvas` directly
            console.log("canvas", canvas);
            if (canvas && canvas.requestFullscreen) {
                canvas.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };


    const zoomToNode = useCallback((node: any) => {
        if (!fgRef.current || !node) return;

        const distance = 100;  // Scale factor for zoom
        const duration = 1000;  // Animation duration in milliseconds

        // Make sure node coordinates are numbers
        const x = parseFloat(node.x);
        const y = parseFloat(node.y);

        if (isNaN(x) || isNaN(y)) {
            console.error("Node coordinates are not valid numbers.");
            return;
        }

        const graphWidth = fgRef.current.offsetWidth;
        const graphHeight = fgRef.current.offsetHeight;

        const offsetX = graphWidth / 2 - x * distance;
        const offsetY = graphHeight / 2 - y * distance;

        // Assuming zoom and centerAt methods exist, or find alternative methods
        // If using centerAt directly and not using zoomToFit because zoomToFit's parameters might not include offsets in your library version
        if (fgRef.current.centerAt) {
            fgRef.current.centerAt(x, y, duration);
            fgRef.current.zoom(distance, duration);
        } else {
            console.error("Required functions (centerAt, zoom) are not available in the graph library.");
        }
    }, []);

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
        <div className={styles.webView} id="graph2d">
            <ForceGraph
                height={window.innerHeight}
                width={window.innerWidth}
                ref={fgRef}
                graphData={graphData}
                linkColor={(link: any) => '#999'}
                nodeLabel="name"
                nodeAutoColorBy="group" />
            <div className={styles.controls}>
                <button onClick={handleZoomIn}>Zoom In</button>
                <button onClick={handleZoomOut}>Zoom Out</button>
                <button onClick={handleReset}>Reset</button>
                {/* <button onClick={toggleFullScreen}>Full Screen</button> */}
            </div>
        </div>
    );
}

export default Graph;