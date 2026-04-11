import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

export default function ModelViewer({ modelPath }) {
  if (!modelPath) return null;

  return (
    <div className="viewer-card">
      <h2>3D Viewer</h2>
      <div className="viewer-container">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 3]} intensity={1.5} />
          <directionalLight position={[-3, 2, -2]} intensity={1} />

          <Suspense fallback={null}>
            <Center>
              <Model modelPath={modelPath} />
            </Center>
          </Suspense>

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}