#!/usr/bin/env python3
import os
import argparse


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("--processed", required=True)
	parser.add_argument("--out", required=True)
	args = parser.parse_args()
	os.makedirs(args.out, exist_ok=True)
	print("Normalize placeholder: apply PRD scoring transforms to factors.")
	print("- Solar: S = clamp((GHI-3)/(6-3),0,1)")
	print("- Water: bins 0.4/0.8/1.2/2.0 → 1.0/0.7/0.4/0.2/0.05")
	print("- Remote: S = clamp((T-30)/(180-30),0,1)")
	print("- Pop: ≤5→1.0; 5–50→0.3; 50–200→0.0; >200→0.0")
	print("- Flood: S = 1−F")


if __name__ == "__main__":
	main()