import { NumberVal, runtimeValue } from "./values.ts";
import {
  AsssignmentExpr,
  BinaryExpr,
  CallExpr,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  statement,
  VariableDecl,
} from "../lang/ast.ts";
import Environment from "./env.ts";
import { evalProgram, evalVarDeclare } from "./eval/statements.ts";
import { evalAssignment, evalBinop, evalCall, evalIndent, evalObj } from "./eval/expressions.ts";

// Evaluate the actual code
export function interpret(ast: statement, env: Environment): runtimeValue {
  switch (ast.kind) {
    case "NumericLiteral":
      return {
        value: ((ast as NumericLiteral).value),
        type: "number",
      } as NumberVal;

    case "BinaryExpr":
      return evalBinop(ast as BinaryExpr, env);

    case "Program":
      return evalProgram(ast as Program, env);

    case "Identifier":
      return evalIndent(ast as Identifier, env);
    case "ObjectLiteral":
      return evalObj(ast as ObjectLiteral, env)
    case "CallExpr":
        return evalCall(ast as CallExpr, env)
    case "AssignmentExpr":
      return evalAssignment(ast as AsssignmentExpr, env);
    case "VariableDecl":
      return evalVarDeclare(ast as VariableDecl, env);
    default:
      console.error("ASTNode is missing. This is a Gum error.");
      Deno.exit(1);
  }
}
