#!/usr/bin/env python3
import os
import argparse


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("--tiles", required=True)
	args = parser.parse_args()
	print(f"Upload placeholder: sync {args.tiles} to CDN bucket/versioned path.")


if __name__ == "__main__":
	main()