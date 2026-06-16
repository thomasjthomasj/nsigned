import { Button } from "@/_components/Button";

export const DiscordCTA = () => (
  <div className="flex flex-1 flex-col gap-[10px] h-full flex-1">
    <div className="flex flex-col gap-[10px]">
      <h2>Join the community!</h2>
      <div className="flex flex-col gap-[10px]">
        <p>
          We are building a community of music lovers over on our{" "}
          <a href="https://discord.gg/A4hRDQmUYk" target="_blank">
            Discord server
          </a>
          .
        </p>
        <p>Why not come and join us?</p>
      </div>
    </div>
    <div className="mt-auto flex justify-end w-full">
      <a href="https://discord.gg/A4hRDQmUYk" target="_blank">
        <Button label="Join" />
      </a>
    </div>
  </div>
);
