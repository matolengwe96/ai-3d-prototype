import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function PlaceholderBox() {
  return (
    <mesh rotation={[0.4, 0.4, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial />
    </mesh>
  );
}

export default function ModelViewer({ modelPath }) {
  return (
    <div className="viewer-card">
      <h2>3D Viewer</h2>

      <div className="viewer-container">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 3]} intensity={1.5} />
          <directionalLight position={[-3, -2, -2]} intensity={1} />
          <PlaceholderBox />
          <OrbitControls />
        </Canvas>
      </div>

      <p style={{ marginTop: "12px", textAlign: "center" }}>
        {modelPath
          ? `Requested model: ${modelPath}`
          : "No model selected yet."}
      </p>
    </div>
  );
}