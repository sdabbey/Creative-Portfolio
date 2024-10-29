import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'



const GOLDENRATIO = 1.51803398875

export const App = ({ images }) => {
 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set the initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
      <color attach="background" args={['#191920']} />
      <fog attach="fog" args={['#191920', 0, 15]} />
      <group position={[0, -0.5, 0]}>
        <Frames images={images} />
        {!isMobile && (  // Only render the mesh when not on mobile
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#050505"
              metalness={0.5}
            />
          </mesh>
        )}
        
      </group>
      
      <Environment preset="city" />
    </Canvas>
  )
}




function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(null)

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })

  // Handle drag-based scrolling
  const onPointerDown = (e) => {
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const onPointerMove = (e) => {
    if (!isDragging) return
    const delta = e.clientX - dragStart
    p.set(delta * 0.01, 0, 5.5) // Adjust factor for scrolling speed
  }

  const onPointerUp = () => {
    setIsDragging(false)
  }

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })

  return (
    <group
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))}
      onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame description={props.description} key={props.url} {...props} /> /* prettier-ignore */)}
      <CenterFrame
        description="Welcome to my Exhibition! Use your mouse to navigate around. Click on each frame to zoom in and again to zoom out"
      />
    </group>
  )
}

function CenterFrame({ description, c = new THREE.Color(), ...props }) {
  const frame = useRef();
  const image = useRef();
  const [hovered, setHovered] = useState(false);

  const isMobile = window.innerWidth <= 768;
  const localImage = (filename) => `/images/${filename}`;
  const url = localImage('banner.png')
  // Animation effects using `useFrame`
  useFrame((state, dt) => {
    if (image.current && image.current.material) {
      image.current.material.zoom = hovered ? 0.55 : 0.6;
    }
    if (frame.current && frame.current.material) {
      easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt);
    }
  });

  return (
    <group {...props} position={(isMobile ? [0, 2.8, 1] : [0, 2, 2])}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={(isMobile ? [2.2, 1.3, 0.1] : [2.5, 1.6, 0.1])} // Adjust for a larger frame
        position={[0, 0, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#000"  envMapIntensity={2} />
        <mesh ref={frame} scale={[0.95, 0.3, 0.9]}>
          <boxGeometry />
          
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0.13, 0.7]} scale={[1, 0.7, 0]}  url={url} />
      </mesh>

      {/* Display Text in Center Frame */}
      <Text
        maxWidth={2} // Wider text for larger frame
        anchorX="center"
        anchorY="center"
        fontSize={0.08}
        color="white"
        position={[0, (isMobile ? -0.42 : -0.44), 0.2]} // Position text slightly in front
      >
        {description}
      </Text>

      {/* Display Text in Center Frame */}
      <Text
        maxWidth={2} // Wider text for larger frame
        anchorX="center"
        anchorY="bottom"
        fontSize={0.08}
        color="orange"
        position={(isMobile ? [0, -5.2, 0.2] : [0, 0,0])} // Position text slightly in front
      >
        Samuel Desmond Abbey darko
      </Text>
    </group>
  );
}

function Frame({ url, title, description, insight, c = new THREE.Color(), ...props }) {
  const image = useRef()
  const sigimage = useRef()
  const frame = useRef()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  
  const localImage = (filename) => `/images/${filename}`;
  const signatureurl = localImage('sdabbey.png')

  const name = getUuid(url)
  const isActive = params?.id === name
  const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed
  useCursor(hovered)
  useFrame((state, dt) => {
    if( image.current){
      image.current.material.zoom = 1.5 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    }
   
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.95 : 1), 0.7 * (!isActive && hovered ? 0.95 : 1), 1], 0.1, dt)
    easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
  })
  
 
  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[(isMobile ? 1 : 1.3), (isMobile ? GOLDENRATIO + 0.2 : GOLDENRATIO + 0.1), 0.05]}
        position={[0, GOLDENRATIO / 1.9, 0]}
        
        >
        
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0.1, 0.7]} url={url} />
        
      </mesh>
      {/* Signature */}
      <Text 
        maxWidth={isMobile ? 0.8 : 1} 
        anchorX="left" 
        anchorY="left" 
        position={[(isMobile ? -0.38 : -0.52), (isMobile ? 1.46 : 1.45), 0.04]} 
        fontSize={0.035}
        color="orangered"
       
        rotation={[0, 0, Math.PI / 6]} // Rotates the text around the z-axis to slant it
      >
        sdabbey
      </Text>

      

      {/* Background for Text */}
     
      <mesh position={[0, 0.24, 0.04]} scale={[(isMobile ? 1 : 1.3), (isMobile ? GOLDENRATIO + 0.2 : GOLDENRATIO + 0.1), 0.05]}>
        <planeGeometry args={[0.846, (isMobile ? 0.25 : 0.2)]} />
        <meshStandardMaterial color="rgba(0, 0, 0, 0.3)" />
        
      </mesh>
      
      {/* Image Title */}
      <Text 
        maxWidth={(isMobile ? 0.8 : 1)} 
        anchorX="center" 
        anchorY="left" 
        position={[(isMobile ? 0: 0), (isMobile ? 0.42 : 0.37), 0.04]} 
        
        fontSize={0.03}
        color="orangered">
        {title}
      </Text>

      {/* Image Description */}
      <Text 
        maxWidth={(isMobile ? 0.8 : 1)} 
        anchorX="left" 
        anchorY="center" 
        position={[(isMobile ? -0.4: -0.5), (isMobile ? 0.35 : 0.32), 0.04]} 
        lineHeight={1.2}
        fontSize={(isMobile ? 0.025 : 0.022)}
        color="white">
        {description}
      </Text>

      {/* Artist Insight */}
      <Text 
        maxWidth={(isMobile ? 0.8 : 1)} 
        anchorX="left" 
        anchorY="center" 
        position={[(isMobile ? -0.4: -0.5), (isMobile ? 0.14 : 0.16), 0.04]} 
        lineHeight={1.3}
        fontSize={0.025}
        
        color="orangered">
        {insight}
      </Text>
        
      
     
    </group>
  )
}
