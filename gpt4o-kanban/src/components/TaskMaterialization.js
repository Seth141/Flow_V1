import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TaskMaterialization = ({ task, delay, color, onComplete }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Disable antialiasing for pixelated effect
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    camera.position.z = 5;

    // Create pixel grid
    const gridSize = 32; // Number of pixels in each dimension
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const uvs = [];
    const indices = [];
    const pixelSize = 0.1;

    // Create grid of pixels
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize/2) * pixelSize;
        const y = (j - gridSize/2) * pixelSize;

        // Create pixel (two triangles)
        positions.push(
          x, y, 0,
          x + pixelSize, y, 0,
          x + pixelSize, y + pixelSize, 0,
          x, y + pixelSize, 0
        );

        const uvX = i / gridSize;
        const uvY = j / gridSize;
        uvs.push(
          uvX, uvY,
          uvX + 1/gridSize, uvY,
          uvX + 1/gridSize, uvY + 1/gridSize,
          uvX, uvY + 1/gridSize
        );

        const vertexIndex = (i * gridSize + j) * 4;
        indices.push(
          vertexIndex, vertexIndex + 1, vertexIndex + 2,
          vertexIndex, vertexIndex + 2, vertexIndex + 3
        );
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    // Material with custom shader for pixel materialization
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
        progress: { value: 0 },
        random: { value: new Float32Array(gridSize * gridSize).map(() => Math.random()) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float progress;
        uniform float time;
        uniform float random[1024]; // gridSize * gridSize
        varying vec2 vUv;
        
        void main() {
          int index = int(vUv.x * 32.0) * 32 + int(vUv.y * 32.0);
          float randomValue = random[index];
          float threshold = progress * 1.2 - randomValue * 0.2;
          float alpha = step(randomValue, threshold);
          
          // Add some pixel noise
          float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
          vec3 finalColor = color + noise * 0.1;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation
    let progress = 0;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      material.uniforms.time.value = elapsed * 0.001;
      
      if (elapsed > delay) {
        progress = Math.min((elapsed - delay) * 0.001, 1);
        material.uniforms.progress.value = progress;
        
        if (progress >= 1 && onComplete) {
          onComplete();
        }
      }

      renderer.render(scene, camera);
      sceneRef.current = requestAnimationFrame(animate);
    };

    sceneRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [delay, color, onComplete]);

  return (
    <div ref={containerRef} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }} />
  );
};

export default TaskMaterialization; 