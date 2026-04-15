import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  ContactShadows,
  Html,
  Bounds
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

function ViewerLoader() {
  return (
    <Html center>
      <div className="viewer-loader">
        <div className="viewer-spinner" />
        <span>Loading model...</span>
      </div>
    </Html>
  );
}

function PlaceholderModel() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <boxGeometry args={[1.4, 1.4, 1.4]} />
      <meshStandardMaterial color="#d1d5db" metalness={0.15} roughness={0.6} />
    </mesh>
  );
}

function getModelAdjustments(modelPath) {
  if (!modelPath) {
    return {
      scale: 1.8,
      rotation: [0, 0, 0],
      position: [0, 0, 0]
    };
  }

  const path = modelPath.toLowerCase();

  if (path.includes("fire-extinguisher")) {
    return {
      scale: 1.25,
      rotation: [0, Math.PI, 0],
      position: [0, -0.2, 0]
    };
  }

  if (path.includes("protective-gloves")) {
    return {
      scale: 3.1,
      rotation: [0, 0.35, 0],
      position: [0, -0.15, 0]
    };
  }

  if (path.includes("safety-vest")) {
    return {
      scale: 2.25,
      rotation: [0, 0, 0],
      position: [0, -0.45, 0]
    };
  }

  if (path.includes("hard-hat")) {
    return {
      scale: 2.4,
      rotation: [0, 0.55, 0],
      position: [0, -0.1, 0]
    };
  }

  return {
    scale: 2,
    rotation: [0, 0, 0],
    position: [0, 0, 0]
  };
}

function LoadedModel({ modelPath }) {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  const adjustments = useMemo(() => getModelAdjustments(modelPath), [modelPath]);

  return (
    <Bounds fit clip observe margin={1.25}>
      <Center>
        <group
          scale={adjustments.scale}
          rotation={adjustments.rotation}
          position={adjustments.position}
        >
          <primitive object={scene} />
        </group>
      </Center>
    </Bounds>
  );
}

function ResetCameraController({ resetSignal, controlsRef, modelPath }) {
  const { camera } = useThree();

  useEffect(() => {
    const path = (modelPath || "").toLowerCase();

    let cameraPosition = [0, 0.6, 4.5];
    let target = [0, 0, 0];

    if (path.includes("fire-extinguisher")) {
      cameraPosition = [0, 0.5, 5.2];
      target = [0, 0.2, 0];
    } else if (path.includes("protective-gloves")) {
      cameraPosition = [0, 0.35, 3.8];
      target = [0, 0, 0];
    } else if (path.includes("safety-vest")) {
      cameraPosition = [0, 0.7, 4.2];
      target = [0, 0.1, 0];
    } else if (path.includes("hard-hat")) {
      cameraPosition = [0, 0.45, 3.8];
      target = [0, 0, 0];
    }

    camera.position.set(...cameraPosition);
    camera.lookAt(...target);

    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [resetSignal, camera, controlsRef, modelPath]);

  return null;
}

function SceneContents({ modelPath, resetSignal, controlsRef }) {
  return (
    <>
      <color attach="background" args={["#f8fafc"]} />

      <ambientLight intensity={1.35} />
      <hemisphereLight intensity={0.9} groundColor="#d1d5db" />
      <directionalLight position={[5, 6, 5]} intensity={2.1} />
      <directionalLight position={[-4, 4, -3]} intensity={1} />
      <directionalLight position={[0, 3, 6]} intensity={0.75} />

      <ResetCameraController
        resetSignal={resetSignal}
        controlsRef={controlsRef}
        modelPath={modelPath}
      />

      <ModelErrorBoundary
        fallback={<PlaceholderModel />}
        resetKey={modelPath || "empty"}
      >
        <Suspense fallback={<ViewerLoader />}>
          {modelPath ? (
            <LoadedModel modelPath={modelPath} />
          ) : (
            <PlaceholderModel />
          )}
        </Suspense>
      </ModelErrorBoundary>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.28}
        scale={12}
        blur={2.5}
        far={5}
      />

      <OrbitControls
        ref={controlsRef}
        autoRotate
        autoRotateSpeed={0.9}
        enablePan={false}
        minDistance={2.4}
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

useGLTF.preload("/models/hard-hat .glb");
useGLTF.preload("/models/safety-vest.glb");
useGLTF.preload("/models/protective-gloves.glb");
useGLTF.preload("/models/fire-extinguisher.glb");