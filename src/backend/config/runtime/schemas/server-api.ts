import { ServerCommonSchemaType } from "./common";
import { ServerCommonSchema } from "./common";

export interface ServerApiSchemaType extends ServerCommonSchemaType {
}

const ServerApiSchema: ServerApiSchemaType = {
  ...ServerCommonSchema,
};

export default ServerApiSchema;
