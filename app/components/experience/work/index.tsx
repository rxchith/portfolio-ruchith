
const Work = () => {
  return (
    <group>
      {/* Shadow catcher */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </group>
  );
};

export default Work;