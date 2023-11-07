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
import { useRef, useState } from "react";

const publishedFilesList = [
  { fileName: "A", filePath: "B/C/D" },
  { fileName: "A", filePath: "B/C/D" },
  { fileName: "A", filePath: "B/C/D" },
  { fileName: "A", filePath: "B/C/D" },
];

const unpublishedFile = (fileName: string, filePath: string) => {
  console.log(`unpublished ${filePath}/${fileName}`);
};

const publishFile = (filePath: string) => {
  console.log(`publish ${filePath}`);
};

export function SharedFilePage() {
  const FilePathInput = () => {
    const [open, setOpen] = useState(false);

    const fileNameRef: React.Ref<HTMLInputElement> = useRef(null);

    const handleOpen = () => setOpen(!open);

    const handlePublish = () => {
      handleOpen();
      if (fileNameRef.current) publishFile(fileNameRef.current.value);
    };

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
              inputRef={fileNameRef}
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
            <Button variant="gradient" color="white" onClick={handlePublish}>
              <span>Publish</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  };

  const PublishedFilesTable: Component<{
    publishedFile: { fileName: string; filePath: string }[];
  }> = ({ publishedFile }) => {
    const TABLE_HEAD = ["File", "Path", "Control"];

    const handleDeleteButton = (fileName: string, filePath: string) => {
      unpublishedFile(fileName, filePath);
    };

    return (
      <div className="w-full flex justify-center">
        {publishedFile.length === 0 ? (
          "No file have published"
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
                {publishedFile.map(({ fileName, filePath }, index) => (
                  <tr key={`${index}`} className="even:bg-blue-gray-50/50">
                    <td className="p-3 flex justify-center">
                      <div className="w-52">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {fileName}
                        </Typography>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="w-full flex justify-center">
                        <div className="w-52">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {filePath}
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
                              handleDeleteButton(fileName, filePath)
                            }
                            variant="gradient"
                          >
                            Delete
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
        <Typography variant="h3">Publish</Typography>
        <Typography variant="paragraph">Announce files you have.</Typography>
      </div>
      <FilePathInput />
      <PublishedFilesTable publishedFile={publishedFilesList} />
    </div>
  );
}
