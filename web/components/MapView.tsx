"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PresetId, PresetWeights } from "../lib/presets";
import Inspector from "./Inspector";
import { getFactorsAt, scoreFromFactors } from "../lib/factors";

// Lazy import to keep initial JS small
let maplibreglPromise: Promise<typeof import("maplibre-gl")> | null = null;
function loadMapLibre() {
	if (!maplibreglPromise) {
		maplibreglPromise = import("maplibre-gl");
	}
	return maplibreglPromise;
}

const TILE_BASE = process.env.NEXT_PUBLIC_TILE_BASE_URL || "/tiles";
const BASEMAP_URL = process.env.NEXT_PUBLIC_BASEMAP_URL || "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

export default function MapView(props: {
	preset: PresetId;
	opacity: number;
	zoom: number;
	center: { lat: number; lng: number };
	weights: PresetWeights;
	onViewport: (v: { zoom: number; center: { lat: number; lng: number } }) => void;
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<any>(null);
	const [lib, setLib] = useState<any>(null);

	const [inspector, setInspector] = useState<{
		lat: number; lng: number; screenXY: { x: number; y: number } | null;
	} | null>(null);

	const rasterUrl = useMemo(() => `${TILE_BASE}/${props.preset}/{z}/{x}/{y}.png`, [props.preset]);

	useEffect(() => {
		let cancelled = false;
		loadMapLibre().then((m) => {
			if (cancelled) return;
			setLib(m);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!lib || !containerRef.current) return;
		if (mapRef.current) return;
		const map = new lib.Map({
			container: containerRef.current,
			style: {
				version: 8,
				sources: {
					basemap: { type: "raster", tiles: [BASEMAP_URL], tileSize: 256 }
				},
				layers: [ { id: "basemap", type: "raster", source: "basemap", paint: { "raster-opacity": 1 } } ]
			},
			center: [props.center.lng, props.center.lat],
			zoom: props.zoom,
			minZoom: 1,
			maxZoom: 12,
			attributionControl: true
		});
		mapRef.current = map;

		map.on("moveend", () => {
			const c = map.getCenter();
			props.onViewport({ zoom: map.getZoom(), center: { lat: c.lat, lng: c.lng } });
			if (inspector) {
				const pt = map.project([inspector.lng, inspector.lat]);
				setInspector({ ...inspector, screenXY: { x: pt.x, y: pt.y } });
			}
		});

		map.on("click", (e: any) => {
			const pt = map.project([e.lngLat.lng, e.lngLat.lat]);
			setInspector({ lat: e.lngLat.lat, lng: e.lngLat.lng, screenXY: { x: pt.x, y: pt.y } });
		});

		return () => {
			map.remove();
			mapRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lib]);

	// Manage raster source/layer for preset with opacity
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;
		const sourceId = "suitability";
		const layerId = "suitability-layer";
		if (map.getSource(sourceId)) {
			(map.getSource(sourceId) as any).tiles = [rasterUrl];
			map.style.sourceCaches[sourceId]?.reload();
		} else {
			map.addSource(sourceId, { type: "raster", tiles: [rasterUrl], tileSize: 256 });
			map.addLayer({ id: layerId, type: "raster", source: sourceId, paint: { "raster-opacity": props.opacity } });
		}
		map.setPaintProperty(layerId, "raster-opacity", props.opacity);
	}, [rasterUrl, props.opacity]);

	const factors = useMemo(() => {
		if (!inspector) return null;
		return getFactorsAt(inspector.lat, inspector.lng);
	}, [inspector]);

	return (
		<div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
			{inspector && (
				<Inspector
					lat={inspector.lat}
					lng={inspector.lng}
					score={factors ? scoreFromFactors(factors.factors, props.weights) : null}
					weights={props.weights}
					factors={factors ? factors.factors : null}
					dataSparse={!!factors?.dataSparse}
					screenXY={inspector.screenXY}
					onClose={() => setInspector(null)}
				/>
			)}
		</div>
	);
}