#!/usr/bin/env python3
import os
import argparse

PRESETS = {
	"A": dict(solar=0.25, water=0.25, remoteness=0.20, population=0.15, flood=0.15),
	"B": dict(solar=0.20, water=0.40, remoteness=0.15, population=0.10, flood=0.15),
	"C": dict(solar=0.20, water=0.20, remoteness=0.35, population=0.15, flood=0.10),
}


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("--factors", required=True)
	parser.add_argument("--preset", required=True, choices=list(PRESETS.keys()))
	parser.add_argument("--out", required=True)
	args = parser.parse_args()
	os.makedirs(os.path.dirname(args.out), exist_ok=True)
	print(f"Combine placeholder: weighting factors for preset {args.preset} → {args.out}")


if __name__ == "__main__":
	main()