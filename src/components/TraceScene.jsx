import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import traceData from '../data/golfTrace.json';

/* ---------------------------------------------------------------------------
   Ambient background identity layer.

   The trace draws on a slow loop (~60s) behind the hero — no scrolling
   required. It establishes the "radar / trajectory / systems" feel without
   becoming a cinematic intro the user has to scroll through.

   JSON stores real-world-ish units (x = downrange, y = height,
   z = lateral drift). Each axis is scaled independently to frame nicely.
--------------------------------------------------------------------------- */
const SCALE = { x: 0.16, y: 0.34, z: 0.5 };
const LOOP = 60; // seconds per trace cycle

const CURVE = new THREE.CatmullRomCurve3(
	traceData.points.map(
		(p) => new THREE.Vector3(p.x * SCALE.x, p.y * SCALE.y, p.z * SCALE.z),
	),
	false,
	'catmullrom',
	0.5,
);

const SEGMENTS = 280;
const SAMPLED = CURVE.getSpacedPoints(SEGMENTS);
const POSITIONS = new Float32Array((SEGMENTS + 1) * 3);
SAMPLED.forEach((v, i) => {
	POSITIONS[i * 3] = v.x;
	POSITIONS[i * 3 + 1] = v.y;
	POSITIONS[i * 3 + 2] = v.z;
});

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* Camera framing. The base position/target reproduce the original desktop shot;
   on narrow (portrait) viewports the camera dollies back along the same view
   direction so the whole trajectory stays in frame instead of being clipped. */
const CAM_TARGET = new THREE.Vector3(7.5, 3, 1);
const CAM_OFFSET = new THREE.Vector3(-14.5, 3.2, 13); // base camera pos minus target
const REF_ASPECT = 1.1; // at/above this aspect ratio framing is unchanged (fit = 1)
const MAX_FIT = 1.9; // cap dolly-out on very tall/narrow viewports

const PREFERS_REDUCED =
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Maps a 0..1 loop cycle to draw length / visibility / opacity. */
function cyclePhase(c) {
	if (c < 0.7) return { drawT: easeInOut(c / 0.7), opacity: 1, ball: true };
	if (c < 0.85) return { drawT: 1, opacity: 1, ball: true };
	return { drawT: 1, opacity: 1 - (c - 0.85) / 0.15, ball: false };
}

/* ---------------------------------------------------------------------------
   Per-frame driver: looping trace + gentle ambient camera drift.
--------------------------------------------------------------------------- */
function Rig({ traceRef, traceMatRef, ballRef, ballGlowRef, gridRef, hud }) {
	const { camera } = useThree();
	const tip = useRef(new THREE.Vector3());
	const frame = useRef(0);

	useFrame((state) => {
		const elapsed = state.clock.getElapsedTime();

		// --- Loop phase ---
		const c = PREFERS_REDUCED ? 0.78 : (elapsed % LOOP) / LOOP;
		const { drawT, opacity, ball } = cyclePhase(c);

		if (traceRef.current) {
			const count = Math.max(2, Math.floor((SEGMENTS + 1) * drawT));
			traceRef.current.geometry.setDrawRange(0, count);
		}
		if (traceMatRef.current) traceMatRef.current.opacity = opacity;

		CURVE.getPointAt(THREE.MathUtils.clamp(drawT, 1e-4, 1), tip.current);
		if (ballRef.current) {
			ballRef.current.position.copy(tip.current);
			ballRef.current.visible = ball;
		}
		if (ballGlowRef.current) {
			ballGlowRef.current.position.copy(tip.current);
			ballGlowRef.current.visible = ball && drawT > 0.01 && drawT < 0.995;
		}

		// --- Responsive framing + ambient camera drift (no scroll) ---
		const aspect = state.size.width / Math.max(1, state.size.height);
		const fit = THREE.MathUtils.clamp(
			Math.sqrt(REF_ASPECT / aspect),
			1,
			MAX_FIT,
		);
		const drift = PREFERS_REDUCED
			? { x: 0, y: 0, z: 0 }
			: {
					x: Math.sin(elapsed * 0.07) * 0.8,
					y: Math.sin(elapsed * 0.07 * 0.7) * 0.25,
					z: Math.cos(elapsed * 0.07 * 0.85) * 0.7,
				};

		camera.position.set(
			CAM_TARGET.x + CAM_OFFSET.x * fit + drift.x,
			CAM_TARGET.y + CAM_OFFSET.y * fit + drift.y,
			CAM_TARGET.z + CAM_OFFSET.z * fit + drift.z,
		);
		camera.lookAt(CAM_TARGET);

		if (!PREFERS_REDUCED && gridRef.current) {
			gridRef.current.position.x = -elapsed * 0.12;
		}

		// --- Subtle HUD updates (throttled) ---
		frame.current++;
		if (hud && frame.current % 6 === 0) {
			if (hud.carry.current)
				hud.carry.current.textContent = `${Math.round(220 * drawT)} m`;
			if (hud.apex.current)
				hud.apex.current.textContent = `${(tip.current.y / SCALE.y).toFixed(1)} m`;
			if (hud.bar.current)
				hud.bar.current.style.transform = `scaleX(${drawT.toFixed(3)})`;
		}
	});

	return null;
}

function Scene({ hud }) {
	const traceRef = useRef();
	const traceMatRef = useRef();
	const ballRef = useRef();
	const ballGlowRef = useRef();
	const gridRef = useRef();

	return (
		<>
			<color attach="background" args={['#05070d']} />
			<fog attach="fog" args={['#05070d', 14, 70]} />
			<ambientLight intensity={0.6} />

			<group ref={gridRef}>
				<Grid
					position={[0, 0, 0]}
					infiniteGrid
					cellSize={1}
					cellThickness={0.5}
					cellColor="#0b3331"
					sectionSize={5}
					sectionThickness={1}
					sectionColor="#128577"
					fadeDistance={58}
					fadeStrength={4}
					followCamera={false}
				/>
			</group>

			{/* Planned-path halo */}
			<line>
				<bufferGeometry>
					<bufferAttribute attach="attributes-position" args={[POSITIONS, 3]} />
				</bufferGeometry>
				<lineBasicMaterial
					color="#14463f"
					transparent
					opacity={0.16}
					toneMapped={false}
				/>
			</line>

			{/* Live glowing trace */}
			<line ref={traceRef}>
				<bufferGeometry>
					<bufferAttribute attach="attributes-position" args={[POSITIONS, 3]} />
				</bufferGeometry>
				<lineBasicMaterial
					ref={traceMatRef}
					color="#46c9ba"
					transparent
					toneMapped={false}
				/>
			</line>

			<mesh ref={ballRef}>
				<icosahedronGeometry args={[0.16, 3]} />
				<meshBasicMaterial color="#eafffb" toneMapped={false} />
			</mesh>
			<mesh ref={ballGlowRef}>
				<sphereGeometry args={[0.5, 18, 18]} />
				<meshBasicMaterial
					color="#37e6cf"
					transparent
					opacity={0.13}
					depthWrite={false}
					blending={THREE.AdditiveBlending}
					toneMapped={false}
				/>
			</mesh>

			<Rig
				traceRef={traceRef}
				traceMatRef={traceMatRef}
				ballRef={ballRef}
				ballGlowRef={ballGlowRef}
				gridRef={gridRef}
				hud={hud}
			/>

			<EffectComposer>
				<Bloom
					mipmapBlur
					intensity={0.55}
					luminanceThreshold={0.28}
					luminanceSmoothing={0.6}
					radius={0.65}
				/>
			</EffectComposer>
		</>
	);
}

export default function TraceScene() {
	const hud = {
		carry: useRef(null),
		apex: useRef(null),
		bar: useRef(null),
	};

	return (
		<div className="trace-bg" aria-hidden="true">
			<div className="trace-bg__canvas">
				<Canvas
					dpr={[1, 2]}
					gl={{ antialias: true, powerPreference: 'high-performance' }}
					camera={{ position: [-7, 6, 14], fov: 42, near: 0.1, far: 200 }}
				>
					<Scene hud={hud} />
				</Canvas>
			</div>

			<div className="trace-bg__veil" />

			<div className="trace-bg__hud">
				<div className="hud hud--br">
					<div className="hud-row">
						<span className="hud-key">CARRY</span>
						<span className="hud-val" ref={hud.carry}>
							0 m
						</span>
					</div>
					<div className="hud-row">
						<span className="hud-key">APEX</span>
						<span className="hud-val" ref={hud.apex}>
							0 m
						</span>
					</div>
					<div className="hud-bar">
						<span className="hud-bar__fill" ref={hud.bar} />
					</div>
				</div>
			</div>

			<style>{CSS}</style>
		</div>
	);
}

const CSS = `
.trace-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; background: #05070d; }
.trace-bg__canvas { position: absolute; inset: 0; }
.trace-bg__canvas canvas { display: block; }

/* Readability veil: darken left (hero copy) + fade bottom into page bg */
.trace-bg__veil {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background:
		linear-gradient(90deg, rgba(5,7,13,0.95) 0%, rgba(5,7,13,0.7) 42%, rgba(5,7,13,0.4) 80%, rgba(5,7,13,0.32) 100%),
		linear-gradient(0deg, var(--color-bg, #0a0b0d) 2%, rgba(10,11,13,0) 30%),
		linear-gradient(180deg, rgba(5,7,13,0.6) 0%, rgba(5,7,13,0) 24%),
		linear-gradient(rgba(5,7,13,0.3), rgba(5,7,13,0.3));
}

.trace-bg__hud {
	position: absolute;
	inset: 0;
	pointer-events: none;
	font-family: var(--font-mono, ui-monospace, monospace);
	color: var(--color-fg, #e8eaed);
	text-shadow: 0 1px 8px rgba(5,7,13,0.9);
}
.hud { position: absolute; font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; }
.hud--br { bottom: 2rem; right: clamp(1.25rem, 5vw, 3rem); width: 8.5rem; }
.hud-row { display: flex; justify-content: space-between; gap: 1rem; padding: 0.16rem 0; border-bottom: 1px solid rgba(94,234,212,0.18); }
.hud-key { color: var(--color-muted, #9aa1ac); }
.hud-val { color: var(--color-fg, #e8eaed); }
.hud-bar { margin-top: 0.55rem; height: 2px; background: rgba(94,234,212,0.22); overflow: hidden; }
.hud-bar__fill { display: block; height: 100%; width: 100%; transform: scaleX(0); transform-origin: left; background: var(--color-accent, #5eead4); }

@media (max-width: 640px) {
	/* Keep the metrics panel visible, tucked into the empty bottom-right. */
	.hud--br { bottom: 1.5rem; width: 7.5rem; font-size: 0.6rem; }
}
`;
