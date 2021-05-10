#pragma once
#include "parser.h"

typedef struct {
	char* value;
	size_t len;
} dyn_js_array;

void init_array(dyn_js_array* arr) {
	arr->len = 0;
	arr->value = (char*)malloc(1);
	arr->value = '\0';
}

void add_to_array(dyn_js_array* arr, char* append_val) {
	arr->value = (char*) realloc(arr->value, strlen(append_val) + 1);
	arr->value = append_val;
}

void free_array(dyn_js_array* arr) {
	free(arr->value);
}

size_t fwrite_sm(const void* a, size_t b, FILE* f) {
	return fwrite(a, b, strlen(a), f);
}

temp_array gen_char_array(char* text) {
	size_t size = strlen(text);
	temp_array values;
	char* temp_char_buffer = (char*)malloc(1);
	size_t buffer_len = 1;

	init_temp(&values, "\0");

	for (int c_char = 1; c_char < size; c_char++) {
		switch(text[c_char]) {
			case '\n':
			case ',':
				temp_char_buffer[buffer_len-2] = '\0';
				append_temp(&values, strdup(temp_char_buffer));
				buffer_len = 0;
				temp_char_buffer = (char*) realloc(temp_char_buffer, 1);
				temp_char_buffer[0] = '\0';
				break;
			default:
				buffer_len++;
				temp_char_buffer = (char*) realloc(temp_char_buffer, buffer_len);
				temp_char_buffer[buffer_len-2] = text[c_char];
				temp_char_buffer[buffer_len-1] = '\0';

				break;

		}
		
	}
	return values;
}

void write_js_file(temp_array temperatures, char* path) {
	// Clear file, a neat trick
	fclose(fopen(path, "w"));

	FILE* file = fopen(path, "a");
	int col_title_num = 8;

	fwrite("let data = [\n", 1, strlen("let data = [\n"),  file);

	for (size_t i = col_title_num; i < temperatures.len; i++) {
		if (i % col_title_num == 0) fwrite_sm("\t{\n", 1,  file);

		fwrite_sm("\t\t\"", 1,  file);
		fwrite_sm(temperatures.value[i % col_title_num], 1,  file);
		fwrite_sm("\"", 1,  file);
		fwrite_sm(": ", 1,  file);
		if (i % col_title_num == 0 || i % col_title_num == 4) fwrite_sm("\"", 1,  file);
		fwrite_sm(temperatures.value[i], 1,  file);
		if (i % col_title_num == 0 || i % col_title_num == 4) fwrite_sm("\"", 1,  file);

		if (i % col_title_num != col_title_num - 1) fwrite_sm(",", 1,  file);

		fwrite_sm("\n", 1,  file);
		
		if (i % 8 == 7) {
			fwrite_sm("\t}", 1,  file);
			if (i != temperatures.len - 1) fwrite_sm(",\n", 1,  file);
			else fwrite_sm("\n];\n", 1,  file);
		}
		
	}


	fclose(file);
}
