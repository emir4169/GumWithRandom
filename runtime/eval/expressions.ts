import { AsssignmentExpr, BinaryExpr, CallExpr, Identifier, ObjectLiteral } from "../../lang/ast.ts";
import Environment from "../env.ts";
import { interpret } from "../interpreter.ts";
import { makeNull, NativeFunction, NumberVal, ObjectVal, runtimeValue } from "../values.ts";

export function evalIndent(ident: Identifier, env: Environment): runtimeValue {
  const val = env.lookup(ident.symbol);
  return val;
}

// Actually does the math
function evalNumericExpression(
  l: NumberVal,
  r: NumberVal,
  operand: string,
): NumberVal {
  let result = 0;
  switch (operand) {
    case "+":
      result = l.value + r.value;
      break;
    case "-":
      result = l.value - r.value;
      break;
    case "*":
      result = l.value * r.value;
      break;
    case "/":
      // TODO: Check for division by 0
      if (r.value === 0) {
        throw "Cannot divide by 0.";
      }
      result = l.value / r.value;
      break;
    case "%":
      result = l.value % r.value;
  }
  return { value: result, type: "number" };
}

// Takes a BinaryExpression and verifies that it is indeed a binaryExpression
export function evalBinop(binop: BinaryExpr, env: Environment): runtimeValue {
  const left = interpret(binop.left, env);
  const right = interpret(binop.right, env);
  if (left.type == "number" && right.type == "number") {
    return evalNumericExpression(
      left as NumberVal,
      right as NumberVal,
      binop.operator,
    );
  } else {
    return makeNull();
  }
}

export function evalObj(obj: ObjectLiteral, env: Environment): runtimeValue {
  const object = { type: "object", properties: new Map()} as ObjectVal
  for (const {key, value} of obj.properies) {
    // when short handed we're expecting the value to have alr been defined. If not short handed we're expecting an expression
    const runtimeVal = (value == undefined) ? env.lookup(key) : interpret(value, env)
    object.properties.set(key, runtimeVal)
  }

  return object
}

export function evalAssignment(
  node: AsssignmentExpr,
  env: Environment,
): runtimeValue {
  if (node.assignee.kind !== "Identifier") {
    throw "Gum can not assign a value that is not an Indentifier";
  }
  const varName = (node.assignee as Identifier).symbol;
  return env.assignVar(varName, interpret(node.value, env));
}

export function evalCall(expr: CallExpr, env: Environment): runtimeValue {
  const args = expr.args.map((arg) => interpret(arg,env))
  const fn = interpret(expr.caller,env)

  // console.log(fn.type, "native-fn" == fn.type)
  if (fn.type !== "native-fn") {
    throw 'Invalid Call Type ' + JSON.stringify(fn)
  }

  const res = (fn as NativeFunction).call(args,env)

  return res
}