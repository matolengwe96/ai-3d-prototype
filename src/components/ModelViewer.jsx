import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import React, { Suspense, useMemo } from "react";

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Model loading failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function PlaceholderBox() {
  return (
    <mesh rotation={[0.4, 0.4, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function LoadedModel({ modelPath }) {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  return (
    <Center>
      <primitive object={scene} scale={2} />
    </Center>
  );
}

function SceneContents({ modelPath }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 3, 3]} intensity={1.5} />
      <directionalLight position={[-3, -2, -2]} intensity={1} />

      <ModelErrorBoundary fallback={<PlaceholderBox />}>
        <Suspense fallback={<PlaceholderBox />}>
          {modelPath ? <LoadedModel modelPath={modelPath} /> : <PlaceholderBox />}
        </Suspense>
      </ModelErrorBoundary>

      <OrbitControls />
    </>
  );
}

export default function ModelViewer({ modelPath }) {
  return (
    <div className="viewer-card">
      <h2>3D Viewer</h2>

      <div className="viewer-container">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <SceneContents modelPath={modelPath} />
        </Canvas>
      </div>

      <p style={{ marginTop: "12px", textAlign: "center" }}>
        {modelPath
          ? `Loaded model: ${modelPath}`
          : "No model selected yet."}
      </p>
    </div>
  );
}

useGLTF.preload("/models/hard-hat.glb");