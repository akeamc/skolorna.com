import { useFBX, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { FunctionComponent, Suspense } from "react";
import { MenuStats } from "../../lib/oden/stats";
import Container from "../layout/Container";
import styles from "./HomeHero.module.scss";

const Scene: FunctionComponent = () => {
  const fbx = useGLTF("/plate.glb");

  return (
    <Canvas>
      <Suspense fallback={null}>
      <primitive object={fbx} />
      </Suspense>
    </Canvas>
  )
}

export const HomeHero: FunctionComponent<{ stats: MenuStats }> = ({
  stats,
}) => (
  <Container>
    <div className={styles.text}>
      <h1 className={styles.heading}>
        Vi vet vad det blir till lunch<sup>*</sup>
      </h1>
      <p className={styles.description}>
        Med sofistikerade algoritmer analyserar vi skolmaten i{" "}
        {stats.menus.toLocaleString()} skolor. Hittills har vi samlat
        in {stats.days.toLocaleString()} luncher. 
      </p>
      <p className={styles.note}>
        <sup>*</sup>Förutom när vi inte vet.
      </p>
    </div>
    <Scene />
  </Container>
);
