import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PurpleStreamEffect = ({ containerId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Particles
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = Math.random() * 2 - 1;
      positions[i * 3 + 1] = Math.random() * 5 - 2.5;
      positions[i * 3 + 2] = Math.random() * 2 - 1;

      // Even slower velocities
      velocities.push({
        x: (Math.random() - 0.5) * 0.0005,  // Half the previous speed
        y: Math.random() * 0.004 + 0.002,   // Half the previous speed
        z: (Math.random() - 0.5) * 0.0005   // Half the previous speed
      });

      // Much larger particles for more blur
      sizes[i] = Math.random() * 0.5 + 0.3;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Updated material for more glow and blur
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x6D55CE) }
      },
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        uniform float time;
        
        void main() {
          vAlpha = 0.2 + sin(time + position.y) * 0.1; // Even subtler alpha variation
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (600.0 / -mvPosition.z); // Much larger base size
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 color;
        
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;
          
          // Even softer falloff for maximum blur
          float alpha = smoothstep(0.5, 0.1, r) * vAlpha;
          
          // Enhanced glow effect
          vec3 glowColor = mix(color, vec3(1.0), 0.6);
          gl_FragColor = vec4(glowColor, alpha * 0.4); // More transparent
        }
      `
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      const positions = particles.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        // Reset if particle goes out of bounds
        if (positions[i * 3 + 1] > 2.5) {
          positions[i * 3 + 1] = -2.5;
          positions[i * 3] = Math.random() * 2 - 1;
          positions[i * 3 + 2] = Math.random() * 2 - 1;
        }
      }

      particles.attributes.position.needsUpdate = true;
      particleMaterial.uniforms.time.value += 0.0005; // Half the previous speed

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      particles.dispose();
      particleMaterial.dispose();
    };
  }, [containerId]);

  return null;
};

export default PurpleStreamEffect; 