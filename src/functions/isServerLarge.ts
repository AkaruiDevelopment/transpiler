import { Scope } from "../scope";
import { parseString } from "../stringparser";
import { funcData, FunctionData } from "../typings/interface";
import { escapeResult } from "../util";

export const $isServerLarge: FunctionData = {
  name: "$isServerLarge",
  brackets: true,
  optional: true,
  type: "getter",
  fields: [
    {
      name: "guildId",
      type: "Snowflake",
      required: false,
    },
  ],
  default: ["__$DISCORD_DATA$__.guild?.id"],
  returns: "boolean",
  description: "Checks if the server is large",
  code: (data: funcData, scope: Scope[]) => {
    let res;
    const id = data.inside ?? `__$DISCORD_DATA$__.guild?.id`;
    const currentScope = scope[scope.length - 1];
    ////console.log({vars:currentScope.variables})
    const parsedId = parseString(id);
    res = escapeResult(
      `__$DISCORD_DATA$__.guilds.cache.get(${parsedId})?.large ?? false`,
    );

    currentScope.rest = currentScope.rest.replace(data.total, res);
    return {
      code: res,
      scope: scope,
    };
  },
};