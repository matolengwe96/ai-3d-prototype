import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Avatar({ action }) {
  const avatarGroupRef = useRef(null);
  const rightArmRef = useRef(null);
  const leftArmRef = useRef(null);
  const bodyRef = useRef(null);

  useFrame(({ clock }) => {
    if (
      !avatarGroupRef.current ||
      !rightArmRef.current ||
      !leftArmRef.current ||
      !bodyRef.current
    ) {
      return;
    }

    const elapsed = clock.getElapsedTime();

    avatarGroupRef.current.position.x = 0;
    avatarGroupRef.current.position.y = 0;
    rightArmRef.current.rotation.z = 0;
    rightArmRef.current.rotation.x = 0;
    leftArmRef.current.rotation.z = 0;
    leftArmRef.current.rotation.x = 0;
    bodyRef.current.rotation.y = 0;

    if (action === "wave") {
      // Keep the arm high and swing from the shoulder for a clear greeting.
      rightArmRef.current.rotation.z = -1.2;
      rightArmRef.current.rotation.x = -0.15 + Math.sin(elapsed * 7.5) * 1.05;
      bodyRef.current.rotation.y = Math.sin(elapsed * 2.4) * 0.08;
    } else if (action === "point") {
      // Hold a stable "point ahead" stance.
      rightArmRef.current.rotation.z = -0.05;
      rightArmRef.current.rotation.x = -1.45;
      leftArmRef.current.rotation.z = 0.22;
      bodyRef.current.rotation.y = -0.15;
    } else if (action === "walk") {
      // Add travel + subtle bounce for stronger walk readability.
      avatarGroupRef.current.position.x = Math.sin(elapsed * 1.9) * 2.1;
      avatarGroupRef.current.position.y = Math.abs(Math.sin(elapsed * 3.8)) * 0.08;
      rightArmRef.current.rotation.x = Math.sin(elapsed * 6) * 0.75;
      leftArmRef.current.rotation.x = -Math.sin(elapsed * 6) * 0.75;
    }
  });

  return (
    <group ref={avatarGroupRef} position={[0, 0, 0]}>
      <mesh ref={bodyRef} position={[0, 1.4, 0]}>
        <capsuleGeometry args={[0.4, 0.9, 4, 8]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#f3d3b1" />
      </mesh>

      <group ref={rightArmRef} position={[0.55, 1.75, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.18, 0.75, 0.18]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>

      <group ref={leftArmRef} position={[-0.55, 1.75, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.18, 0.75, 0.18]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>

      <mesh position={[0.22, 0.55, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.22, 0.55, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}

function ResetCameraController({ resetSignal, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2.2, 6);
    camera.lookAt(0, 1.2, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1.2, 0);
      controlsRef.current.update();
    }
  }, [camera, controlsRef, resetSignal]);

  return null;
}

function Scene({ action, resetSignal, controlsRef }) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-4, 4, -4]} intensity={0.35} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      <Avatar action={action} />

      <ResetCameraController resetSignal={resetSignal} controlsRef={controlsRef} />

      <OrbitControls
        ref={controlsRef}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

export default function AvatarScene({ action }) {
  const [resetSignal, setResetSignal] = useState(0);
  const controlsRef = useRef(null);

  const handleResetCamera = () => {
    setResetSignal((prev) => prev + 1);
  };

  return (
    <div className="viewer-card">
      <div className="viewer-header">
        <h2>Avatar Scene</h2>
        <div className="viewer-actions">
          <span className="viewer-badge">Action: {action}</span>
          <button
            type="button"
            className="viewer-reset-button"
            onClick={handleResetCamera}
          >
            Reset Camera
          </button>
        </div>
      </div>

      <div className="viewer-container avatar-viewer-container">
        <Canvas camera={{ position: [0, 2.2, 6], fov: 48 }}>
          <Scene
            action={action}
            resetSignal={resetSignal}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>

      <p className="viewer-caption">
        Use mouse drag/scroll to orbit and zoom around the avatar.
      </p>
    </div>
  );
}
