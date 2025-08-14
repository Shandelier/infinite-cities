export type PresetId = "A" | "B" | "C";

export type PresetWeights = {
	solar: number;
	water: number;
	remoteness: number;
	population: number;
	flood: number;
};

export const PRESET_LIST: PresetId[] = ["A", "B", "C"];

// Hard-code defaults aligning with config; used before client fetches config
const DEFAULTS: Record<PresetId, PresetWeights> = {
	A: { solar: 0.25, water: 0.25, remoteness: 0.2, population: 0.15, flood: 0.15 },
	B: { solar: 0.2, water: 0.4, remoteness: 0.15, population: 0.1, flood: 0.15 },
	C: { solar: 0.2, water: 0.2, remoteness: 0.35, population: 0.15, flood: 0.1 }
};

let configCache: Partial<Record<PresetId, PresetWeights>> | null = null;

export function getPresetWeights(preset: PresetId): PresetWeights {
	return (configCache?.[preset] as PresetWeights) || DEFAULTS[preset];
}

export async function loadPresetsConfig(): Promise<void> {
	try {
		const r = await fetch("/config/presets.json", { cache: "force-cache" });
		if (!r.ok) return;
		const data = (await r.json()) as Record<PresetId, PresetWeights>;
		configCache = data;
	} catch {}
}