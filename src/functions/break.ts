import { FunctionData } from "../typings/interface";
import { escapeFunctionResult, escapeResult } from "../util";

export const $break: FunctionData = {
  name: "$break",
  type: "function",
  brackets: false,
  optional: false,
  fields: [],
  version: "1.0.0",
  default: [],
  returns: "void",
  description: "Breaks out of a loop",
  code: (data, scope) => {
    const currentScope = scope[scope.length - 1];
    const res = escapeFunctionResult(`break;`);
    currentScope.rest = currentScope.rest.replace(data.total, res);
    scope[scope.length - 1] = currentScope;
    return {
      code: res,
      scope,
    };
  },
};
