import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { DiscoverRequest, FetchRequest, serializeRequest } from "../../../../../common/protocol/requests";
import { MessageType } from "../../../../../common/protocol/types";
import { extractDiscoverResponse, extractFetchResponse } from "../../../../../common/protocol/validators/response";
import { requestInterface } from "@utils";
import { deserializeResponse } from "../../../../../common/protocol/response";

function ClientIpInput({ clientIp, handleClientIpChange }: { clientIp: string; handleClientIpChange: (newIp: string) => void }) {
  return (
    <div className="w-full flex flex-row justify-center">
      <div className="w-[600px]">
        <Input
          crossOrigin=""
          label="Client IP"
          className="rounded-none"
          size="md"
          color="white"
          value={clientIp}
          onChange={(event) => handleClientIpChange(event.target.value)}
        />
      </div>
    </div>
  );
}

function HostTable({ fileList, handleFetchButton }: { fileList: string[] | null; handleFetchButton: (filename: string) => void; }) {
  const TABLE_HEAD = ["File name", "Control"];

  return (
    <div className="w-full flex justify-center">
      {!fileList?.length ? (
        fileList === null ? "Host not found" : "This host doesn't have any file"
      ) : (
        <div className="w-full flex flex-col gap-6 justify-center">
          <div className="flex justify-center">
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
                  {fileList.map((fileName, index) => (
                    <tr key={`${index}`} className="even:bg-blue-gray-50/50">
                      <td className="p-3">
                        <div className="flex justify-center">
                          <div className="w-52">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {fileName}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <div className="w-52 flex justify-between">
                            <Button
                              className="rounded-none capitalize w-20 py-2"
                              onClick={() => handleFetchButton(fileName)}
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
          </div>
        </div>
      )}
    </div>
  );
}
  
export function DiscoverPage() {
  const [peerIp, setPeerIp] = useState('');
  const [fileList, setFileList] = useState(null as string[] | null);

  const handlePeerIpChange = async (newIp: string) => {
    setPeerIp(newIp);

    const discoverRequest: DiscoverRequest = {
      type: MessageType.DISCOVER,
      headers: {
        hostname: newIp,
      },
    }

    const rawResponse = await requestInterface(serializeRequest(discoverRequest));
    const response = deserializeResponse(rawResponse).chain(extractDiscoverResponse).unwrap_or(undefined);

    setFileList(response?.body || null);
  };

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
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Typography variant="h3">Discover</Typography>
        <Typography variant="paragraph">
          Show all files of another peer
        </Typography>
      </div>
      <ClientIpInput clientIp={peerIp} handleClientIpChange={handlePeerIpChange}/>
      <HostTable fileList={fileList} handleFetchButton={(filename: string) => handleFetch(filename, peerIp)} />
    </div>
  );
}
