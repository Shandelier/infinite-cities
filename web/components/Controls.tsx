"use client";

import { PresetId, PRESET_LIST, PresetWeights } from "../lib/presets";

export default function Controls(props: {
	preset: PresetId;
	setPreset: (p: PresetId) => void;
	opacity: number;
	setOpacity: (n: number) => void;
	weights: PresetWeights;
}) {
	return (
		<div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: 300 }}>
			<div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
				{PRESET_LIST.map((p) => (
					<button
						key={p}
						onClick={() => props.setPreset(p)}
						style={{
							padding: "6px 10px",
							borderRadius: 6,
							border: "1px solid #ddd",
							background: props.preset === p ? "#0ea5e9" : "white",
							color: props.preset === p ? "white" : "#222",
							cursor: "pointer"
						}}
					>
						Preset {p}
					</button>
				))}
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 8, marginBottom: 8 }}>
				<label htmlFor="opacity" style={{ fontSize: 12, color: "#333" }}>Opacity</label>
				<div style={{ fontSize: 12 }}>{props.opacity.toFixed(2)}</div>
				<input
					id="opacity"
					type="range"
					min={0}
					max={1}
					step={0.01}
					value={props.opacity}
					onChange={(e) => props.setOpacity(Number(e.target.value))}
					style={{ gridColumn: "1 / span 2" }}
				/>
			</div>
			<div style={{ fontSize: 12, color: "#333", marginBottom: 6 }}>Legend</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 8 }}>
				<div style={{ height: 10, background: "linear-gradient(90deg, #440154 0%, #31688e 25%, #35b779 50%, #fde725 100%)", borderRadius: 4 }} />
				<div style={{ fontSize: 11, color: "#555" }}>0 | 25 | 50 | 75 | 100</div>
			</div>
			<div style={{ fontSize: 11, color: "#666", marginTop: 8 }}>
				Weights: solar {props.weights.solar}, water {props.weights.water}, remote {props.weights.remoteness}, pop {props.weights.population}, flood {props.weights.flood}
			</div>
			<div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
				<a href="/about" onClick={(e) => { e.preventDefault(); alert("About data coming soon. See data/README.md"); }}>
					About data
				</a>
			</div>
		</div>
	);
}