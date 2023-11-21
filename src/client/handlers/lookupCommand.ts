import { LookupStatus } from "../../common/protocol/response.js";
import lookUp from "client/utils/lookup.js";

export default async function handleLookupCommand(
  filename: string
): Promise<string> {
  const response = await lookUp(filename);

  if (response.status === LookupStatus.OK) {
    const hosts = response.body!;
    return hosts.length === 0 ? "<Empty>" : hosts.join("\n");
  } else if (response.status === LookupStatus.NOT_FOUND) {
    return "Host not found";
  } else {
    return "Something wrong has happened";
  }
}
