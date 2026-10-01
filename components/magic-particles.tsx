"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 250 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse = useMemo(() => new THREE.Vector2(9999, 9999), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouse]);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 5; // Más profundidad

      const speed = 0.002 + Math.random() * 0.004; // Mucho más lento y sutil
      const factor = Math.random() * 100;

      const isGold = Math.random() > 0.2; // Mayoría doradas como luciérnagas
      const color = new THREE.Color(isGold ? "#fde68a" : "#6ee7b7");
      color.multiplyScalar(0.7); // Brillo suave

      temp.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        speed,
        factor,
        color,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    particles.forEach((particle, i) => {
      let t = particle.factor + state.clock.elapsedTime * (particle.speed * 40);

      particle.y += particle.speed;

      if (particle.y > viewport.height / 2 + 1) {
        particle.y = -viewport.height / 2 - 1;
        particle.x = (Math.random() - 0.5) * viewport.width * 1.5;
        particle.baseX = particle.x;
      }

      // Movimiento ondulante de luciérnaga
      const oscX = Math.sin(t) * 0.5;
      const oscY = Math.cos(t * 0.8) * 0.2;

      let targetX = particle.baseX + oscX;
      let targetY = particle.y + oscY;

      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const interactRadius = 2.5;

      // Interacción amigable: Las luciérnagas se apartan muy suavemente o se acercan si están muy cerca
      if (distance < interactRadius) {
        const force = (interactRadius - distance) / interactRadius;
        // Empuje muy delicado en lugar de salir volando
        targetX += (dx / distance) * force * 0.3;
        targetY += (dy / distance) * force * 0.3;
      }

      // LERP súper suave
      particle.x += (targetX - particle.x) * 0.03;
      particle.y += (targetY - particle.y) * 0.03;

      dummy.position.set(particle.x, particle.y, particle.z);

      // Escala minúscula
      const scale = 0.01 + Math.sin(t * 2) * 0.008;
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      mesh.current!.setColorAt(i, particle.color);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) {
      mesh.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[null as any, null as any, count]}>
      <circleGeometry args={[1, 16]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export function MagicParticles() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Particles count={250} />
      </Canvas>
    </div>
  );
}
