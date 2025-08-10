import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function Blobby() {
  const mesh = useMemo(() => new THREE.IcosahedronGeometry(2, 5), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#9BC7B5"),
    roughness: 0.3,
    metalness: 0.2,
  }), []);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const obj = state.scene.getObjectByName("blob");
    if (obj) {
      obj.rotation.x = Math.sin(t / 2) / 8;
      obj.rotation.y = Math.cos(t / 2) / 8;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh name="blob" geometry={mesh} material={material} />
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Blobby />
          <Environment preset="forest" />
        </Suspense>
      </Canvas>
    </div>
  );
}

