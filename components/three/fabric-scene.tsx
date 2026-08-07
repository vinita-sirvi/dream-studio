"use client";

import { useEffect, useRef } from "react";
import {
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

/**
 * The hero's silk. A subdivided plane displaced by layered sine waves in the
 * vertex shader, lit by a soft rim that tracks the pointer.
 *
 * Why this is not decoration: the brand's entire proposition is cloth and how it
 * falls. The hero *is* the fabric — it moves as the visitor moves, which is the
 * one thing a photograph cannot do.
 *
 * Only ever mounted behind `canRunWebglHero()` and a `next/dynamic` boundary, so
 * neither `three` nor this module reaches the initial bundle.
 */

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;

  varying vec2  vUv;
  varying float vElevation;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Three offset waves at different frequencies read as cloth rather than a
    // single mechanical ripple.
    float wave =
        sin(pos.x * 1.6 + uTime * 0.45) * 0.34
      + sin(pos.y * 2.1 - uTime * 0.32) * 0.22
      + sin((pos.x + pos.y) * 1.05 + uTime * 0.24) * 0.28;

    // The pointer lifts the sheet locally — a hand under the silk.
    float pull = 1.0 - clamp(distance(uv, uPointer * 0.5 + 0.5) * 1.7, 0.0, 1.0);
    wave += pull * 0.55;

    // Pin the outer edge so the plane never tears away from the frame.
    float edge = smoothstep(0.0, 0.42, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
    pos.z += wave * edge;

    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorDeep;
  uniform vec3 uColorMid;
  uniform vec3 uColorLight;

  varying vec2  vUv;
  varying float vElevation;

  void main() {
    // Height drives the sheen: crests catch light, troughs fall into shadow.
    float h = clamp(vElevation * 0.6 + 0.5, 0.0, 1.0);

    vec3 color = mix(uColorDeep, uColorMid, smoothstep(0.15, 0.6, h));
    color = mix(color, uColorLight, smoothstep(0.62, 1.0, h));

    // Warm the lower body so it grounds against the page background.
    color = mix(color, uColorDeep, (1.0 - vUv.y) * 0.22);

    // Vignette to a soft edge instead of a hard rectangle.
    float vignette = smoothstep(0.0, 0.35, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));

    gl_FragColor = vec4(color, vignette);
  }
`;

export default function FabricScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new Scene();

    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      // Context creation can still fail even when the probe passed.
      return;
    }

    // Cap DPR: beyond 2x the shader cost doubles for no perceptible gain.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const geometry = new PlaneGeometry(7, 7, 96, 96);
    const material = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new Vector2(0, 0) },
        // Brand palette: espresso → coral → near-white teal.
        uColorDeep: { value: new Color("#0b1717") },
        uColorMid: { value: new Color("#ea4f2e") },
        uColorLight: { value: new Color("#f5f9f8") },
      },
    });

    const mesh = new Mesh(geometry, material);
    mesh.rotation.set(-0.62, 0.18, 0.12);
    scene.add(mesh);

    function resize() {
      const { clientWidth, clientHeight } = host!;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(host);

    // --- pointer -----------------------------------------------------------
    const pointer = new Vector2(0, 0);
    const targetPointer = new Vector2(0, 0);

    const onPointerMove = (event: PointerEvent) => {
      const rect = host!.getBoundingClientRect();
      targetPointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // --- render loop -------------------------------------------------------
    // Paused whenever the hero is off-screen or the tab is hidden, so an
    // unattended tab costs nothing.
    let raf = 0;
    let running = false;
    let last = performance.now();
    let elapsed = 0;

    const frame = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += delta;

      pointer.lerp(targetPointer, 0.055);
      material.uniforms.uTime.value = elapsed;
      (material.uniforms.uPointer.value as Vector2).copy(pointer);

      // A touch of drift so it never looks frozen when the pointer is still.
      mesh.rotation.z = 0.12 + Math.sin(elapsed * 0.14) * 0.035;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    visibility.observe(host);

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else if (host!.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Fade in once the first frame is on screen.
    host.style.opacity = "0";
    host.style.transition = "opacity 900ms var(--ease-out-expo)";
    requestAnimationFrame(() => {
      if (host) host.style.opacity = "1";
    });

    return () => {
      stop();
      visibility.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      // Explicit teardown — WebGL resources are not garbage collected.
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
