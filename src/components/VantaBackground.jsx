import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VantaBackground = () => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const particlesRef = useRef(null);
    const timeRef = useRef(0);
    const mouseRef = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        if (!containerRef.current) {
            console.error('Container ref не определён');
            return;
        }

        console.log('Three.js загружен, версия:', THREE.REVISION);

        // Проверяем поддержку WebGL 2.0
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');
        const useWebGL2 = !!gl;
        console.log(useWebGL2 ? 'WebGL 2.0 поддерживается' : 'WebGL 2.0 не поддерживается, используем WebGL 1.0');

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000); // fov исправлен на 75
        camera.position.set(0, 0, 900); // Выше и дальше для обзора
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0); // Ровный горизонт
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const gridSize = 60;
        const spacing = 190;
        const positions = [];

        // Исправлена сетка для симметрии
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = (i - gridSize / 2) * spacing;
                const y = (j - gridSize / 2) * spacing; // Исправлено с /20 на /2
                positions.push(x, y, 0);
            }
        }
        console.log('Сетка создана, количество точек:', positions.length / 3);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        let vertexShader, fragmentShader, glslVersion;
        if (useWebGL2) {
            vertexShader = `
                uniform float time;
                void main() {
                    vec3 pos = position;
                    float wave = sin(time * 0.4 + (position.x + position.y) * 0.2) * 12.0; // Амплитуда увеличена до 6.0
                    pos.z += wave;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = 5.0;
                }
            `;
            fragmentShader = `
                precision highp float;
                uniform float time;
                out vec4 fragColor;
                void main() {
                    vec3 color1 = vec3(0.545, 0.361, 0.965); // #8b5cf6
                    vec3 color2 = vec3(0.0, 0.867, 0.922); // #00ddeb
                    float t = sin(time * 0.666) * 0.5 + 0.5;
                    vec3 finalColor = mix(color1, color2, t);
                    fragColor = vec4(finalColor, 1.0);
                }
            `;
            glslVersion = THREE.GLSL3;
        } else {
            vertexShader = `
                uniform float time;
                void main() {
                    vec3 pos = position;
                    float wave = sin(time * 1.0 + (position.x + position.y) * 0.2) * 6.0; // Амплитуда увеличена до 6.0
                    pos.z += wave;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = 5.0;
                }
            `;
            fragmentShader = `
                precision highp float;
                uniform float time;
                void main() {
                    vec3 color1 = vec3(0.545, 0.361, 0.965); // #8b5cf6
                    vec3 color2 = vec3(0.0, 0.867, 0.922); // #00ddeb
                    float t = sin(time * 0.666) * 0.5 + 0.5;
                    vec3 finalColor = mix(color1, color2, t);
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `;
            glslVersion = THREE.GLSL1;
        }

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0 }
            },
            glslVersion
        });

        const particlesSystem = new THREE.Points(geometry, material);
        particlesSystem.rotation.y = THREE.MathUtils.degToRad(0);
        particlesSystem.rotation.z = Math.PI / 4; // Ромб (поворот на 45 градусов)
        particlesSystem.position.y = 0;
        scene.add(particlesSystem);
        particlesRef.current = particlesSystem;

        const onMouseMove = (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            mouseRef.current.set(mouseX, mouseY);
        };
        window.addEventListener('mousemove', onMouseMove);

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize);

        const animate = () => {
            requestAnimationFrame(animate);
            timeRef.current += 0.02;
            material.uniforms.time.value = timeRef.current;

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const radius = 300;
            const baseAngleY = THREE.MathUtils.degToRad(0);
            const baseAngleX = 0;

            const angleX = baseAngleX + mouseX * THREE.MathUtils.degToRad(10); // Усилено для вправо-влево
            const angleY = baseAngleY + mouseY * THREE.MathUtils.degToRad(10); // Вверх-вниз

            camera.position.x = radius * Math.sin(angleX);
            camera.position.z = radius * Math.cos(angleX);
            camera.position.y = 100 + radius * Math.sin(angleY) * 0.3; // Ограниченное движение по Y
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                background: '#000000'
            }}
        />
    );
};

export default VantaBackground;