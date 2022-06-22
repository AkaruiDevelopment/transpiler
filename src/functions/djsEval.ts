import { TranspilerError } from "../error";
import { Scope } from "../scope";
import { parseString } from "../stringparser";
import { funcData, FunctionData } from "../typings/interface";
import { convertToBool, escapeResult } from "../util";
export const $djsEval: FunctionData = {
  name: "$djsEval",
  brackets: true,
  optional: false,
  type: "function_getter",
  fields: [
    {
      name: "output",
      type: "string",
      required: true,
    },
    {
      name: "code",
      type: "string",
      required: true,
    },
  ],
  default: ["void", "void"],
  returns: "any",
  description: "Evaluates the provided Js code",
  code: (data: funcData, scope: Scope[]) => {
    const splits = data.splits;
    const [output, ...code] = splits;
    const currentScope = scope[scope.length - 1];
    const parsedOutput = convertToBool(output);
    if ($djsEval.brackets) {
      if (
        !data.total.startsWith($djsEval.name + "[") &&
        (!currentScope.name.startsWith("$try_") ||
          !currentScope.name.startsWith("$catch_"))
      ) {
        throw new TranspilerError(`${data.name} requires closure brackets`);
      }
    }
    if (
      splits.length < 2 &&
      (!currentScope.name.startsWith("$try_") &&
        !currentScope.name.startsWith("$catch_"))
    ) {
      throw new TranspilerError(`${data.name} requires 2 arguments`);
    }

    const Code = parseString(code.join(";"));
    if (
      !currentScope.functions.includes("async function __$djsEval$__(Code) {")
    ) {
      const setres = `
    async function __$djsEval$__(Code) {
      try {
        const evaled =  await eval(Code);
        return typeof evaled === "object" ? UTIL.inspect(evaled,{depth:0}) : evaled;
      } catch (e) {
        return e;
      }
    }`;
      if (
        !currentScope.packages.includes("const UTIL = await import('util');")
      ) {
        currentScope.packages += "const UTIL = await import('util');\n";
      }
      currentScope.functions += escapeResult(setres) + "\n";
    }
    const res = `${escapeResult(
      `await __$djsEval$__.call(__$DISCORD_DATA$__,${Code})`,
    )}`;
    currentScope.rest = currentScope.rest.replace(data.total, res);
    return {
      code: parsedOutput ? res : "",
      scope: scope,
    };
  },
};
