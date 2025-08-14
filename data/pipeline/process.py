#!/usr/bin/env python3
import os
import argparse


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("--raw", required=True)
	parser.add_argument("--processed", required=True)
	args = parser.parse_args()
	os.makedirs(args.processed, exist_ok=True)
	print("Process placeholder: reproject/resample rasters to EPSG:4326 ~1km grid.")


if __name__ == "__main__":
	main()