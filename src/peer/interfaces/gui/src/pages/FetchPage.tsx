import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { ChangeEventHandler, useState } from "react";
import { FetchRequest, LookupRequest, serializeRequest } from "../../../../../common/protocol/requests";
import { deserializeResponse } from "../../../../../common/protocol/response";
import { extractFetchResponse, extractLookupResponse } from "../../../../../common/protocol/validators/response";
import { MessageType } from "../../../../../common/protocol/types";
import { requestInterface } from "@utils";

function FileNameInput({ filename, handleFilenameChange } : { 
  filename: string;
  handleFilenameChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="w-full flex flex-row justify-center">
      <div className="w-[600px]">
        <Input
          crossOrigin=""
          label="File name"
          className="rounded-none"
          size="md"
          color="white"
          value={filename}
          onChange={handleFilenameChange}
        />
      </div>
    </div>
  );
}

function HostTable ({ hostList, handleFetchButton } : {
  hostList: string[];
  handleFetchButton: (host: string) => void;
}) {
  const TABLE_HEAD = ["IP", "Control"];

  return (
    <div className="w-full flex justify-center">
      {hostList.length === 0 ? (
        "No host have this file"
      ) : (
        <Card className="h-full w-[75%] overflow-auto rounded-none">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-200 bg-blue-gray-50 p-3"
                  >
                    <div className="w-full flex justify-center">
                      <div className="w-52">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hostList.map((host, index) => (
                <tr key={`${index}`} className="even:bg-blue-gray-50/50">
                  <td className="p-3">
                    <div className="flex justify-center">
                      <div className="w-52">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {host}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <div className="w-52 flex justify-between">
                        <Button
                          className="rounded-none capitalize w-20 py-2"
                          onClick={() => handleFetchButton(host)}
                          variant="gradient"
                        >
                          Fetch
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}


export function GetFilePage() {
  const [filename, setFilename] = useState('');
  const [hostList, setHostList] = useState([] as string[]);

  const handleFetch = async (filename: string, host: string) => {
    const fetchRequest: FetchRequest = {
      type: MessageType.FETCH,
      headers: {
        filename,
        hostname: host,
      },
    };

    const rawResponse = await requestInterface(serializeRequest(fetchRequest));
    const response = deserializeResponse(rawResponse).chain(extractFetchResponse).unwrap_or(undefined);
    const a = document.createElement('a');
    a.download = filename;
    a.href = `data:application/octet-stream;base64,${response?.body}`; 
    a.click();
  }

  const handleFilenameChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    setFilename(event.target.value);

    const lookupRequest: LookupRequest = {
      type: MessageType.LOOKUP,
      headers: {
        filename: event.target.value,
      },
    }

    const rawResponse = await requestInterface(serializeRequest(lookupRequest));
    const response = deserializeResponse(rawResponse).chain(extractLookupResponse).unwrap_or(undefined);

    setHostList(response?.body || ([] as string[]));

  } 
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Typography variant="h3">Look up</Typography>
        <Typography variant="paragraph">
          Find all the hosts that have the file
        </Typography>
      </div>
      <FileNameInput filename={filename} handleFilenameChange={handleFilenameChange} />
      <HostTable hostList={hostList} handleFetchButton={(host: string) => handleFetch(filename, host)}/>
    </div>
  );
}
