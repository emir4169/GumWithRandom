import Parser from "./lang/parser.ts";
import Environment, { initGlobalScope } from "./runtime/env.ts";
import { interpret } from "./runtime/interpreter.ts";

const debug = false

gum();

async function gum() {
  const parser = new Parser();
  const env = new Environment();
  initGlobalScope(env);

  console.log("\nGum v0.1");

  // Continue Until User Stops Or Types `exit`
  while (true) {
    let input = prompt("> ");
    // Check for no user input or exit keyword.
    if (!input || input.toLowerCase() == "exit") {
      Deno.exit(1);
    }

    if (input == "test") {
      //* This is absolutely temporary, it just makes testing easier.
      input = "run test/test.gum";
    }

    if (input?.split(" ")[0] == "run") {
      const formattedFile = await assembleFile(input);
      runLine(formattedFile, parser, env);
    } else {
      runLine(input, parser, env);
    }
  }
}

async function assembleFile(input: string) {
  // Read and decode the file.
  const filePath = input?.split(" ")[1];

  const decoder = new TextDecoder("utf8");
  const readBytes = await Deno.readFile(filePath);

  return decoder.decode(readBytes);
}

function runLine(input: string, parser: Parser, env: Environment) {
  // Produce AST From source-code if debug is enabled
  if (debug) {
    const program = parser.newAST(input);
    console.log(program);

    const result = interpret(program, env);
    console.log(result);
  }
}
