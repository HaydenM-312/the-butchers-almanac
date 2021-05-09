#pragma once
#include "parser.h"

// Struct for dynamic temperature array

typedef struct {
	char** value;
	size_t len;
} temp_array;

// Basic functions for the dynamic temperature array

void init_temp(temp_array* arr, char* val) {
	arr->len = 0L;
	arr->value = (char**)malloc(sizeof(char*));
	arr->value[0] = val;
}

void append_temp(temp_array* arr, char* val) {
	arr->len++;
	arr->value = (char**)realloc(arr->value, sizeof(char*) * arr->len);
	arr->value[arr->len-1] = val;
}

void free_temp(temp_array* arr) {
	for (int i = 0; i < arr->len - 1; i++) {
		free(arr->value[i]);
	}

	free(arr->value);
}