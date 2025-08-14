"use client";

import { PresetWeights } from "../lib/presets";

export type InspectorData = {
	lat: number;
	lng: number;
	score: number | null;
	weights: PresetWeights;
	factors: { solar: number; water: number; remoteness: number; population: number; flood: number } | null;
	dataSparse: boolean;
	screenXY: { x: number; y: number } | null;
	onClose: () => void;
};

export default function Inspector(props: InspectorData) {
	if (!props.screenXY) return null;
	return (
		<div
			style={{
				position: "absolute",
				top: props.screenXY.y,
				left: props.screenXY.x,
				transform: "translate(8px, -100%)",
				background: "white",
				border: "1px solid #ddd",
				borderRadius: 8,
				padding: 10,
				boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
				minWidth: 220,
				zIndex: 10
			}}
		>
			<div style={{ display: "flex", alignItems: "center" }}>
				<div style={{ fontWeight: 600, flex: 1 }}>Inspector</div>
				<button onClick={props.onClose} style={{ border: "none", background: "transparent", cursor: "pointer" }}>✕</button>
			</div>
			<div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>lat {props.lat.toFixed(5)}, lon {props.lng.toFixed(5)}</div>
			<div style={{ marginTop: 8, fontSize: 14 }}>
				<b>Score:</b> {props.score !== null ? props.score : "—"}
				{props.dataSparse ? <span style={{ marginLeft: 6, fontSize: 11, color: "#a66" }}>(data-sparse)</span> : null}
			</div>
			{props.factors && (
				<div style={{ marginTop: 8, fontSize: 12, color: "#333" }}>
					<div>Solar S={props.factors.solar} (w {props.weights.solar})</div>
					<div>Water S={props.factors.water} (w {props.weights.water})</div>
					<div>Remote S={props.factors.remoteness} (w {props.weights.remoteness})</div>
					<div>Pop S={props.factors.population} (w {props.weights.population})</div>
					<div>Flood S={props.factors.flood} (w {props.weights.flood})</div>
				</div>
			)}
			<div style={{ marginTop: 8 }}>
				<a href="#" onClick={(e) => { e.preventDefault(); alert("Links to sources coming soon."); }} style={{ fontSize: 12 }}>Source explorers</a>
			</div>
		</div>
	);
}