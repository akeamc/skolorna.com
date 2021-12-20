import React, { FunctionComponent } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import styles from "./HomeHero.module.scss";

interface Props {}

const Scene: FunctionComponent<Props> = () => (
  <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
    <OrbitControls />
    <Box>
      <meshBasicMaterial attach="material" wireframe />
    </Box>
  </Canvas>
);

export const HomeHero: FunctionComponent<Props> = (props) => (
  <header className={styles.container}>
    <div className={styles.scene}>
      <Scene {...props} />
    </div>
  </header>
);
