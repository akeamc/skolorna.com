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

export interface Props {
  menus: string[];
}

interface BoxProps {
  i: number;
}

const Box: FunctionComponent<BoxProps> = ({ i, ...props }) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<MeshProps>(null);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  const offset = useRef(Math.random() * 2 * Math.PI);
  const inclination = useRef(((Math.random() - 0.5) * Math.PI) / 3);
  const speed = useRef((Math.random() - 0.5) * 4 + 1);
  const r = useRef(Math.random() * 10 + 5);
  const h = useRef((Math.random() - 0.5) * 20);

  useFrame(({ clock }, delta) => {
    if (ref.current == null) {
      return;
    }

    const a = (clock.getElapsedTime() + offset.current) * speed.current;

    ref.current.position.x = r.current * Math.cos(a);
    ref.current.position.y =
      r.current * Math.sin(a) * inclination.current + h.current;
    ref.current.position.z = r.current * Math.sin(a);

    ref.current.rotation.x += 0.01;
    // ref.current.rotation.y += Math.sin(clock.getElapsedTime() / 100);
  });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const Scene: FunctionComponent<Props> = ({ menus }) => (
  <Canvas camera={{ position: [10, 10, 10], fov: 12 }}>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    {menus.map((menu, i) => (
      <Box key={menu} i={i} />
    ))}
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
