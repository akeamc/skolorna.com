import { PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Group, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MenuStats } from "../../lib/oden/stats";
import Container from "../layout/Container";
import styles from "./HomeHero.module.scss";

const Plate: FunctionComponent = () => {
  const [model, setModel] = useState<Object3D | null>(null);
  const group = useRef<Group>(null);

  useFrame(() =>
    group.current ? (group.current.rotation.x += 0.01) : undefined
  );

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/plate.glb", async (gltf) => {
      const node = await gltf.parser.loadNode(0);

      setModel(node);
    });
  }, []);

  if (!model) return null;

  return (
    <group ref={group} scale={20}>
      <primitive object={model} />
    </group>
  );
};

const Scene: FunctionComponent = () => {
  return (
    <Canvas>
      <PresentationControls global>
        <directionalLight />
        <ambientLight />
        <Plate />
      </PresentationControls>
    </Canvas>
  );
};

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
        {stats.menus.toLocaleString("sv")} skolor. Hittills har vi samlat in{" "}
        {stats.days.toLocaleString("sv")} luncher.
      </p>
      <p className={styles.note}>
        <sup>*</sup>Förutom när vi inte vet.
      </p>
    </div>
    <Scene />
  </Container>
);
