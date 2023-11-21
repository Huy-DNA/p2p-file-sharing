import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useRef } from "react";

const hostList = [
  "192.168.1.17",
  "127.0.0.1",
  "172.18.0.1",
  "172.23.0.1",
  "172.16.0.2",
];

const fetchHostOfFile = (fileName: string) => {
  console.log(fileName);
};

const fetchFile = (fileName: string, clientIp: string) => {
  console.log(`fetching ${fileName} from ${clientIp}`);
};

const pingClient = (clientIp: string) => {
  console.log(`pinging ${clientIp} `);
};

export function GetFilePage() {
  const fileNameRef: React.Ref<HTMLInputElement> = useRef(null);

  const FileNameInput = () => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        if (fileNameRef.current) fetchHostOfFile(fileNameRef.current.value);
      }
    };

    return (
      <div className="w-full flex flex-row justify-center">
        <div className="w-[600px]">
          <Input
            crossOrigin=""
            label="File name"
            className="rounded-none"
            size="md"
            color="white"
            inputRef={fileNameRef}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>
    );
  };

  const HostTable: Component<{ hostList: string[] }> = ({ hostList }) => {
    const TABLE_HEAD = ["IP", "Control"];

    const handleFetchButton = (clientIp: string) => {
      if (fileNameRef.current) fetchFile(fileNameRef.current?.value, clientIp);
    };

    const handlePingButton = (clientIp: string) => {
      if (fileNameRef.current) pingClient(clientIp);
    };

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
                          <Button
                            className="rounded-none capitalize w-20 py-2"
                            onClick={() => handlePingButton(host)}
                            variant="gradient"
                          >
                            Ping
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
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Typography variant="h3">Look up</Typography>
        <Typography variant="paragraph">
          Find all the hosts that have the file
        </Typography>
      </div>
      <FileNameInput />
      <HostTable hostList={hostList} />
    </div>
  );
}
