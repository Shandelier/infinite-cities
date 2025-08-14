#!/usr/bin/env python3
import os
import argparse


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("--input_dir", required=True)
	parser.add_argument("--out_dir", required=True)
	parser.add_argument("--minzoom", type=int, default=0)
	parser.add_argument("--maxzoom", type=int, default=7)
	args = parser.parse_args()
	os.makedirs(args.out_dir, exist_ok=True)
	print(f"Tiles placeholder: generate PNG8 tiles z{args.minzoom}–z{args.maxzoom} from {args.input_dir} to {args.out_dir}")


if __name__ == "__main__":
	main()