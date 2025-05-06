#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

int main(int argc, char** argv) {
    unsigned long int target = 100;
    if(argc == 2) {
        target = strtol(argv[1], NULL, 10);
    }

    for(unsigned long int i = 1; i <= target; i++) {
        if(!(i % 3)) {
            if(!(i % 5)) {
                puts("fizz buzz");
            } else {
                puts("fizz");
            }
        } else if (!(i % 5)) {
            puts("buzz");
        } else {
            printf("%lu\n", i);
        }
    }

    return 0;
}