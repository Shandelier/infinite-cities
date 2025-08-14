import { PresetWeights } from "./presets";

export type Factors = { solar: number; water: number; remoteness: number; population: number; flood: number };

export function getFactorsAt(lat: number, lng: number): { factors: Factors; dataSparse: boolean } {
	// Placeholder: neutral values per PRD for missing data
	return {
		factors: { solar: 0.6, water: 0.6, remoteness: 0.6, population: 0.6, flood: 0.6 },
		dataSparse: true
	};
}

export function scoreFromFactors(factors: Factors, weights: PresetWeights): number {
	const s = (
		factors.solar * weights.solar +
		factors.water * weights.water +
		factors.remoteness * weights.remoteness +
		factors.population * weights.population +
		factors.flood * weights.flood
	);
	return Math.round(100 * s);
}