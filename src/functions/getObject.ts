import { TranspilerError } from "../error";
import { Scope } from "../scope";
import { funcData, FunctionData } from "../typings/interface";
import { escapeResult, escapeVars } from "../util";
export const $getObject: FunctionData = {
  name: "$getObject",
  brackets: true,
  optional: false,
  type: "getter",
  fields: [
    {
      name: "name",
      type: "string",
      required: true,
    },
  ],
  version: "1.0.0",
  description: "returns the object",
  default: ["void"],
  returns: "object",
  code: (data: funcData, scope: Scope[]) => {
    const currentScope = scope[scope.length - 1];
    const name = data.inside;
    if (
      !name &&
      !currentScope.name.startsWith("$try_") &&
      !currentScope.name.endsWith("$catch_")
    ) {
      throw new TranspilerError(`${data.name}: No Object Name Provided`);
    }
    if (
      !currentScope.objects[<string>name ?? ""] &&
      !currentScope.name.startsWith("$try_") &&
      !currentScope.name.endsWith("$catch_")
    ) {
      throw new TranspilerError(`${data.name}: Invalid Object Name Provided`);
    }
    if (!currentScope.packages.includes("const UTIL = await import('util');")) {
      currentScope.packages += "const UTIL = await import('util');\n";
    }
    const res = escapeResult(
      `UTIL.inspect(${escapeVars(<string>name)},{depth:null})`,
    );

    currentScope.rest = currentScope.rest.replace(data.total, res);
    return {
      code: res,
      scope,
    };
  },
};
