import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { DiscoverRequest, PublishRequest, serializeRequest } from "../../../../../common/protocol/requests";
import { MessageType } from "../../../../../common/protocol/types";
import { requestInterface } from "@utils";
import { deserializeResponse } from "../../../../../common/protocol/response";
import { extractDiscoverResponse, extractPublishResponse } from "../../../../../common/protocol/validators/response";
import _ from "lodash";

function FilePathInput({ filepath, handleFilepathChange, handlePublishButton }: { filepath: string; handleFilepathChange: (newFilepath: string) => void; handlePublishButton: () => void; }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <div>
        <Button
          onClick={handleOpen}
          variant="gradient"
          className="rounded-none capitalize w-32 py-2"
        >
          Publish file
        </Button>
      </div>

      <Dialog open={open} handler={handleOpen} className="bg-gray-800">
        <DialogHeader className="text-white">Publish new file</DialogHeader>
        <DialogBody className="flex flex-col gap-4 py-0">
          <Typography variant="paragraph" color="white">
            Enter full path of file
          </Typography>
          <Input
            crossOrigin=""
            label="File path"
            className="rounded-none"
            size="md"
            color="white"
            value={filepath}
            onChange={(event) => handleFilepathChange(event.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="white"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="white" onClick={() => { handlePublishButton(); handleOpen(); }}>
            <span>Publish</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function PublishedFilesTable({ publishedFiles } : { publishedFiles: string[] }) {
  const TABLE_HEAD = ["File", "Control"];

  const handlePublishButton = async (filename: string) => {
    const { VITE_PEER_REPO } = import.meta.env;
    
    const publishRequest: PublishRequest = {
      type: MessageType.PUBLISH,
      headers: {
        filename,
        abspath: `${VITE_PEER_REPO}\\${filename}`,
      },
    }

    const rawResponse = await requestInterface(serializeRequest(publishRequest));
    const response = deserializeResponse(rawResponse).chain(extractPublishResponse).unwrap_or(undefined);
    console.log(response);
  }

  return (
    <div className="w-full flex justify-center">
      {publishedFiles.length === 0 ? (
        "No file have been published"
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
              {publishedFiles.map((file, index) => (
                <tr key={`${index}`} className="even:bg-blue-gray-50/50">
                  <td className="p-3">
                    <div className="w-full flex justify-center">
                      <div className="w-52">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {file}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <div className="w-52 flex justify-between">
                        <Button
                          className="rounded-none capitalize w-20 py-2"
                          onClick={() =>
                            handlePublishButton(file)
                          }
                          variant="gradient"
                        >
                          Publish 
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

export function SharedFilePage() {
  const [filepath, setFilepath] = useState('');
  const [publishedFilesList, setPublishedFilesList] = useState([] as string[]);
  
  const handleFilepathChange = (newFilepath: string) => {
    setFilepath(newFilepath);
  };

  const handlePublishButton = async () => {
    const publishRequest: PublishRequest = {
      type: MessageType.PUBLISH,
      headers: {
        filename: _.last(filepath.split(/[\\/]/)) || '',
        abspath: filepath,
      },
    }

    const rawResponse = await requestInterface(serializeRequest(publishRequest));
    const response = deserializeResponse(rawResponse).chain(extractPublishResponse).unwrap_or(undefined);
    refresh();
    console.log(response);
  };

  const refresh = async () => {
    const discoverRequest: DiscoverRequest = {
      type: MessageType.DISCOVER,
      headers: {
        hostname: '0.0.0.0',
      },
    };

    const rawResponse = await requestInterface(serializeRequest(discoverRequest));
    const response = deserializeResponse(rawResponse).chain(extractDiscoverResponse).unwrap_or(undefined);

    setPublishedFilesList(response?.body || []);
  }

  useEffect(() => {
    refresh();
  }, [])
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Typography variant="h3">Publish</Typography>
        <Typography variant="paragraph">Announce files you have.</Typography>
      </div>
      <FilePathInput filepath={filepath} handleFilepathChange={handleFilepathChange} handlePublishButton={handlePublishButton}/>
      <PublishedFilesTable publishedFiles={publishedFilesList} />
    </div>
  );
}
