import { PresetId } from "./presets";

export function buildPermalinkQuery(params: {
	preset: PresetId;
	opacity: number;
	zoom: number;
	center: { lat: number; lng: number };
}): string {
	const q = new URLSearchParams();
	q.set("preset", params.preset);
	q.set("opa", String(Math.max(0, Math.min(1, params.opacity))));
	q.set("z", String(Math.round(params.zoom * 10) / 10));
	q.set("ll", `${round6(params.center.lat)},${round6(params.center.lng)}`);
	return q.toString();
}

function round6(n: number): number {
	return Math.round(n * 1e6) / 1e6;
}