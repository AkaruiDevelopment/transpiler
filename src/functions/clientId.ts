import { Scope } from "../scope";
import { funcData, FunctionData } from "../typings/interface";
import { escapeResult } from "../util";

export const $clientId: FunctionData = {
  name: "$clientId",
  brackets: false,
  optional: true,
  type: "getter",
  fields: [],
  default: [],
  version: "1.0.0",
  returns: "Snowflake",
  description: "Returns the client's ID",
  code: (data: funcData, scope: Scope[]) => {
    let res = escapeResult("__$DISCORD_DATA$__.client.user?.id");
    const currentScope = scope[scope.length - 1];
    currentScope.rest = currentScope.rest.replace(data.total, res);
    return {
      code: res,
      scope: scope,
    };
  },
};
