#include "parser.h"

int main(int argc, char** argv) {
	char* file_contents = load_path(argv[1]);
	temp_array temp_file = gen_char_array(file_contents);

	write_js_file(temp_file, "data.js");

	// Cleanup to avoid memory leaks
	free(file_contents);
	free_temp(&temp_file);
	return 0;
}