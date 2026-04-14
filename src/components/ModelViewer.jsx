import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  ContactShadows
} from "@react-three/drei";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";

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

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function PlaceholderModel() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <boxGeometry args={[1.4, 1.4, 1.4]} />
      <meshStandardMaterial color="#d1d5db" metalness={0.15} roughness={0.6} />
    </mesh>
  );
}

function LoaderFallback() {
  return <PlaceholderModel />;
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

function ResetCameraController({ resetSignal, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.6, 4.5);
    camera.lookAt(0, 0, 0);

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetSignal, camera, controlsRef]);

  return null;
}

function SceneContents({ modelPath, resetSignal, controlsRef }) {
  return (
    <>
      <color attach="background" args={["#f3f4f6"]} />

      <ambientLight intensity={1} />
      <hemisphereLight intensity={0.7} groundColor="#d1d5db" />
      <directionalLight position={[4, 6, 4]} intensity={1.5} />
      <directionalLight position={[-4, 3, -2]} intensity={0.6} />

      <ResetCameraController
        resetSignal={resetSignal}
        controlsRef={controlsRef}
      />

      <ModelErrorBoundary
        fallback={<PlaceholderModel />}
        resetKey={modelPath || "empty"}
      >
        <Suspense fallback={<LoaderFallback />}>
          {modelPath ? (
            <LoadedModel modelPath={modelPath} />
          ) : (
            <PlaceholderModel />
          )}
        </Suspense>
      </ModelErrorBoundary>

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.3}
        scale={10}
        blur={2.2}
        far={4}
      />

      <OrbitControls
        ref={controlsRef}
        autoRotate
        autoRotateSpeed={1}
        enablePan={false}
        minDistance={2.5}
        maxDistance={8}
      />
    </>
  );
}

export default function ModelViewer({ modelPath }) {
  const [resetSignal, setResetSignal] = useState(0);
  const controlsRef = useRef(null);

  const handleResetView = () => {
    setResetSignal((prev) => prev + 1);
  };

  return (
    <div className="viewer-card">
      <div className="viewer-header">
        <h2>3D Viewer</h2>
        <div className="viewer-actions">
          <span className="viewer-badge">
            {modelPath ? "Interactive" : "Preview"}
          </span>
          <button
            type="button"
            className="viewer-reset-button"
            onClick={handleResetView}
          >
            Reset View
          </button>
        </div>
      </div>

      <div className="viewer-container">
        <Canvas camera={{ position: [0, 0.6, 4.5], fov: 45 }}>
          <SceneContents
            modelPath={modelPath}
            resetSignal={resetSignal}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>

      <p className="viewer-caption">
        {modelPath
          ? `Loaded model: ${modelPath}`
          : "No model selected yet. A preview object is shown instead."}
      </p>
    </div>
  );
}

useGLTF.preload("/models/hard-hat.glb");
useGLTF.preload("/models/safety-vest.glb");
useGLTF.preload("/models/protective-gloves.glb");
useGLTF.preload("/models/fire-extinguisher.glb");