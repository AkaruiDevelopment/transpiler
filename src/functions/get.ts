import { TranspilerError } from "../error";
import { Scope } from "../scope";
import { funcData, FunctionData } from "../typings/interface";
import { escapeResult, escapeVars, removeSetFunc } from "../util";

export const $get: FunctionData = {
  name: "$get",
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
  default: ["void"],
  returns: "any",
  description: "Gets the value of the variable",
  code: (data: funcData, scope: Scope[]) => {
    let res;
    const splits = data.splits;
    const currentScope = scope[scope.length - 1];
    if ($get.brackets) {
      if (
        !data.total.startsWith($get.name + "[") &&
        (!currentScope.name.startsWith("$try_") ||
          !currentScope.name.startsWith("$catch_"))
      ) {
        throw new TranspilerError(`${data.name} requires closure brackets`);
      }
    }
    if (
      splits.length !== 1 &&
      !currentScope.name.startsWith("$try_") &&
      !currentScope.name.startsWith("$catch_")
    ) {
      throw new TranspilerError(`${data.name} requires 1 argument`);
    }
    const name = removeSetFunc(splits[0]);
    if (
      name === "" &&
      !currentScope.name.startsWith("$try_") &&
      !currentScope.name.startsWith("$catch_")
    ) {
      throw new TranspilerError(`${data.name} requires a name`);
    }
    if (
      !currentScope.variables.includes(name) &&
      !currentScope.name.startsWith("$try_") &&
      !currentScope.name.startsWith("$catch_")
    ) {
      throw new TranspilerError(`${data.name} cannot find ${name}`);
    }
    res = `${escapeResult(escapeVars(name))}`;

    currentScope.rest = currentScope.rest.replace(data.total, res);
    return { code: res, scope: scope };
  },
};
