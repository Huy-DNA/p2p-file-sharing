import { Button, Typography } from "@material-tailwind/react";

export function HomePage() {
  const handleAnnounceButton = () => {
    console.log("announce to server");
  };
  return (
    <>
      <Typography variant="h3" className="pb-4">
        P2P File Sharing Application
      </Typography>
      <Typography variant="paragraph" className="pb-4">
        Press to connect to Server
      </Typography>
      <Button
        onClick={handleAnnounceButton}
        variant="gradient"
        className="rounded-none capitalize w-fit py-2"
      >
        Announce
      </Button>
    </>
  );
}
