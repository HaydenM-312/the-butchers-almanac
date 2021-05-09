#pragma once
#include "parser.h"

char* load_path(char* path) {
	FILE* file = fopen(path, "r");
	size_t size;
	char* contents;
	
	// Check if file exists
	if (file == NULL) {
		fputs("Invalid file name.", stderr);
		exit(2);
	}

	// Get the size of the file
	fseek(file, 0L, SEEK_END);
	size = ftell(file);
	rewind(file);
	
	contents = (char*)malloc(size * sizeof(char));

	// Check if enough memory was allocated
	if (file == NULL) {
		fputs("Not enough memory.", stderr);
		exit(12);
	}

	fread(contents, sizeof(char), size, file);
	
	fclose(file);
	return contents;
}