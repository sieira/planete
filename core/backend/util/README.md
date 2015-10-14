# Util
*This is part of planète's core backend, whose docs can be found [here](../README.md)*

## Description
***What this is:*** This is a container for common use functions.
***What this is not*** A planète's module

## Properties
None

## Methods
Please, note that both `parallelRunner` and `serialRunner` run methods that take as their sole argument a callback

  - `pathsort` Receives an array of paths (as strings), and returns a down-to-top level sort walk of those paths.
  - `parallelRunner` Runs a list of async tasks at the same time
    - input: Either an array of Parallel tasks, or a series of parallel tasks as arguments.
        async, async, ...
      or
        [async, async, async]
      An async task can be a list of serial async tasks
        async, [async, async], ...
  - `serialRunner`
    - input: A generator of serial tasks
      Each element should be a function or a valid input for the parallelRunner
      Resolves when all the functions have run, and rejects if any of them fails
  - `currier` Takes a context, a function, and a list of arguments, and returns a function that takes a callback run the former with the given arguments in the given context. **Please note that the callback will be run right after the function has been invoked. This allows to use serial and parallel runners with synchronnous functions, but will give unexpected results with async functions, since the callback will be triggered before the async function completion** Use it at your discretion.
  - `iPStringToInt`
    - input: A string in the form 'a[a][a].b[b][b].c[c][c].d[d][d]' representing an IPv4 address
    returns the integer representation of the ip
  - `iPIntToString`
    - input: An int representing an IPv4 address
    returns the string representation of the ip


### Middleware
None

## API
None
