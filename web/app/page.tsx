"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PresetId, PresetWeights, getPresetWeights } from "../lib/presets";
import { buildPermalinkQuery } from "../lib/url";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });
const Controls = dynamic(() => import("../components/Controls"), { ssr: false });

function Content() {
	const search = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const initialPreset = (search.get("preset") as PresetId) || "A";
	const initialOpacity = (() => {
		const v = search.get("opa");
		if (!v) return 0.8;
		const n = Number(v);
		return isFinite(n) && n >= 0 && n <= 1 ? n : 0.8;
	})();
	const initialZoom = (() => {
		const v = search.get("z");
		const n = v ? Number(v) : 2;
		return isFinite(n) ? n : 2;
	})();
	const initialCenter = (() => {
		const ll = search.get("ll");
		if (!ll) return { lat: 20, lng: 0 };
		const parts = ll.split(",");
		if (parts.length !== 2) return { lat: 20, lng: 0 };
		const lat = Number(parts[0]);
		const lng = Number(parts[1]);
		if (!isFinite(lat) || !isFinite(lng)) return { lat: 20, lng: 0 };
		return { lat, lng };
	})();

	const [preset, setPreset] = useState<PresetId>(initialPreset);
	const [opacity, setOpacity] = useState<number>(initialOpacity);
	const [zoom, setZoom] = useState<number>(initialZoom);
	const [center, setCenter] = useState<{ lat: number; lng: number }>(initialCenter);

	const weights: PresetWeights = useMemo(() => getPresetWeights(preset), [preset]);

	const updatePermalink = useCallback(
		(next?: Partial<{ preset: PresetId; opacity: number; zoom: number; center: { lat: number; lng: number } }>) => {
			const q = buildPermalinkQuery({
				preset: next?.preset ?? preset,
				opacity: next?.opacity ?? opacity,
				zoom: next?.zoom ?? zoom,
				center: next?.center ?? center
			});
			router.replace(`${pathname}?${q}`, { scroll: false });
		},
		[preset, opacity, zoom, center, pathname, router]
	);

	useEffect(() => {
		updatePermalink();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preset, opacity, zoom, center.lat, center.lng]);

	return (
		<div style={{ width: "100vw", height: "100vh", display: "grid", gridTemplateRows: "auto 1fr" }}>
			<header style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderBottom: "1px solid #eee" }}>
				<div style={{ fontWeight: 600 }}>Off-Grid Suitability</div>
				<div style={{ marginLeft: "auto", fontSize: 12, color: "#666" }}>MVP • Tiles z0–z7 • Scores 0–100</div>
			</header>
			<div style={{ position: "relative" }}>
				<MapView
					preset={preset}
					opacity={opacity}
					zoom={zoom}
					center={center}
					weights={weights}
					onViewport={(v) => {
						setZoom(v.zoom);
						setCenter(v.center);
					}}
				/>
				<div style={{ position: "absolute", top: 12, left: 12 }}>
					<Controls
						preset={preset}
						setPreset={(p) => setPreset(p)}
						opacity={opacity}
						setOpacity={(o) => setOpacity(o)}
						weights={weights}
					/>
				</div>
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<Suspense>
			<Content />
		</Suspense>
	);
}