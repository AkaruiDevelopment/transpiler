import { TranspilerError } from "../error";
import { parseString } from "../stringparser";
import { FunctionData } from "../typings/interface";
import { escapeResult, escapeVars, resolveColor } from "../util";
export const $description: FunctionData = {
  name: "$description",
  type: "setter",
  brackets: true,
  optional: false,
  version: "1.0.0",
  fields: [
    {
      name: "index",
      type: "number",
      required: false,
    },
    {
      name: "text",
      type: "string",
      required: true,
    },
  ],
  default: ["1", "void"],
  returns: "void",
  description: "Sets the description of the embed",
  code: (data, scope) => {
    const fields = data.splits;
    const currentScope = scope[scope.length - 1];

    if (isNaN(Number(fields[0]))) {
      const text = parseString(fields.join(";"));
      const index = 0;
      if (!currentScope.embeds[index]) {
        currentScope.embeds[index] = { fields: [] };
        currentScope.setters += `${escapeVars(
          `${currentScope.name}_embeds`,
        )}[${index}] = {fields: []};\n`;
      }
      currentScope.embeds[index].color = 1;
      currentScope.rest = currentScope.rest.replace(data.total, "");
      scope[scope.length - 1] = currentScope;
      const res = escapeResult(
        escapeVars(`${currentScope.name}_embeds`) +
          `[${index}].description = ${text};`,
      );
      currentScope.setters += res + "\n";
      return {
        code: res,
        scope,
      };
    } else {
      const index = Number(fields.shift()) - 1;
      if (
        index < 0 ||
        (index > 9 &&
          (!currentScope.name.startsWith("$try_") ||
            !currentScope.name.startsWith("$catch_")))
      ) {
        throw new TranspilerError(`${data.name} requires a valid index`);
      }
      const text = parseString(fields.join(";"));
      if (!currentScope.embeds[index]) {
        currentScope.embeds[index] = { fields: [] };
        currentScope.setters += `${escapeVars(
          `${currentScope.name}_embeds`,
        )}[${index}] = {fields: []};\n`;
      }
      currentScope.embeds[index].color = 1;
      currentScope.rest = currentScope.rest.replace(data.total, "");
      const res = escapeResult(
        escapeVars(`${currentScope.name}_embeds`) +
          `[${index}].description = ${text};`,
      );
      currentScope.setters += res + "\n";
      scope[scope.length - 1] = currentScope;
      return {
        code: res,
        scope,
      };
    }
  },
};
