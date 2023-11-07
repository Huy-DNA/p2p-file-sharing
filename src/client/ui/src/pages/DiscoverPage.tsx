import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useRef } from "react";

const filesList = ["A", "B", "C", "D", "E"];

const fetchFileOfClient = (ClientIP: string) => {
  console.log(ClientIP);
};

const fetchFile = (fileName: string, clientIp: string) => {
  console.log(`fetching ${fileName} from ${clientIp}`);
};

const pingClient = (clientIp: string) => {
  console.log(`pinging ${clientIp} `);
};

export function DiscoverPage() {
  const clientIpRef: React.Ref<HTMLInputElement> = useRef(null);

  const ClientIpInput = () => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        if (clientIpRef.current) fetchFileOfClient(clientIpRef.current.value);
      }
    };

    return (
      <div className="w-full flex flex-row justify-center">
        <div className="w-[600px]">
          <Input
            crossOrigin=""
            label="Client IP"
            className="rounded-none"
            size="md"
            color="white"
            inputRef={clientIpRef}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>
    );
  };

  const HostTable: Component<{ fileList: string[] }> = ({ fileList }) => {
    const TABLE_HEAD = ["File name", "Control"];

    const handleFetchButton = (fileName: string) => {
      if (clientIpRef.current) fetchFile(fileName, clientIpRef.current?.value);
    };

    const handlePingButton = () => {
      if (clientIpRef.current) pingClient(clientIpRef.current.value);
    };

    return (
      <div className="w-full flex justify-center">
        {fileList.length === 0 ? (
          "No host have this file"
        ) : (
          <div className="w-full flex flex-col gap-6 justify-center">
            <div className="flex justify-center">
              <Button
                onClick={handlePingButton}
                variant="gradient"
                className="rounded-none capitalize w-fit py-2"
              >
                Ping this client
              </Button>
            </div>
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
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Typography variant="h3">Discover</Typography>
        <Typography variant="paragraph">
          Show all the file of another client
        </Typography>
      </div>
      <ClientIpInput />
      <HostTable fileList={filesList} />
    </div>
  );
}
