import React, {
  FunctionComponent,
  MutableRefObject,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, MeshProps } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Container from "./Container";
import styles from "./HomeHero.module.scss";
import { Vector3 } from "three";

export interface Props {
  menus: string[];
}

const G = 0.03;

const BlackHole: FunctionComponent<MeshProps> = (props) => {
  const ref = useRef<MeshProps>();

  // useFrame(() => {
  //   ref.current.rotation.x += 0.01;
  //   ref.current.rotation.y += 0.01;
  // });

  return (
    <mesh {...props} ref={ref}>
      <sphereBufferGeometry attach="geometry" args={[1, 32, 16]} />
      <meshBasicMaterial attach="material" color="black" />
    </mesh>
  );
};

const Thing: FunctionComponent<MeshProps> = (props) => {
  const ref = useRef<MeshProps>();
  const v = useRef<Vector3>(new Vector3(0, 0, 0.1));
  const dead = useRef<boolean>(false);

  useFrame(() => {
    if (dead.current) return;

    const dir = ref.current.position.clone();
    dir.negate();
    const r2: number = dir.lengthSq();
    const a = G / r2;
    dir.setLength(a);

    v.current.add(dir);
    ref.current.position.add(v.current);

    if (ref.current.position.lengthSq() < 1) {
      ref.current.position.set(0, 0, 0);
      dead.current = true;
    }
  });

  return (
    <mesh {...props} ref={ref} castShadow>
      <sphereBufferGeometry attach="geometry" args={[0.1, 32, 16]} />
      <meshBasicMaterial attach="material" color="red" />
    </mesh>
  );
};

const Scene: FunctionComponent<Props> = ({ menus }) => (
  <Canvas camera={{ position: [10, 10, 10], fov: 50 }} shadows>
    <ambientLight />
    {/* {/* <pointLight position={[10, 10, 10]} castShadow /> */}
    <spotLight
      penumbra={1}
      angle={1}
      castShadow
      position={[10, 60, -5]}
      intensity={8}
      shadow-mapSize={[2048, 2048]}
    />
    <BlackHole />
    <Thing position={[2, 0, 0]} />
    {/* <Thing position={[2.1, 0, 0]} />
    <Thing position={[2.2, 0, 0]} /> */}
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      scale={[200, 200, 200]}
      receiveShadow
      renderOrder={100000}
    >
      <planeGeometry />
      <shadowMaterial color="#251005" />
    </mesh>
    {/* {menus.map((menu, i) => (
      <Box key={menu} i={i} />
    ))} */}
    <OrbitControls />
  </Canvas>
);

export const HomeHero: FunctionComponent<Props> = ({ menus }) => (
  <header className={styles.container}>
    <Container>
      <h1 className={styles.heading}>
        Vi vet vad det blir till lunch<sup>*</sup>
      </h1>
    </Container>
    <div className={styles.scene}>
      <Scene menus={menus} />
    </div>
  </header>
);
