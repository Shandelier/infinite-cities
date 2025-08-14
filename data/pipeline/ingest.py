#!/usr/bin/env python3
import os
import argparse


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("--out", required=True)
	args = parser.parse_args()
	os.makedirs(args.out, exist_ok=True)
	print("Ingest placeholder. Document sources in data/README.md.")


if __name__ == "__main__":
	main()