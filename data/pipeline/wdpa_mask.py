#!/usr/bin/env python3
import os
import argparse


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("--processed", required=True)
	args = parser.parse_args()
	print("WDPA mask placeholder: rasterize polygons onto grid, save mask=0 inside.")


if __name__ == "__main__":
	main()