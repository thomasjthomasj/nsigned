import { Button } from "@/_components/Button";

export const DonateCTA = () => (
  <div className="flex flex-1 flex-col gap-[10px] h-full flex-1">
    <div className="flex flex-col gap-[10px]">
      <h2>Donate to _nsigned!</h2>
      <p>
        <strong>_nsigned</strong> is a free website built and maintained
        entirely by one person.
      </p>
      <div className="flex flex-col gap-[10px]">
        <p>
          If you have been enjoying the site, please considering{" "}
          <a
            href="https://ko-fi.com/godribbon"
            target="_blank"
            className="font-bold"
          >
            buying me a pizza
          </a>{" "}
          as a way of showing your appreciation.
        </p>
      </div>
    </div>
    <div className="mt-auto flex justify-end w-full">
      <a href="https://ko-fi.com/godribbon" target="_blank" className="mt-auto">
        <Button label="Donate" />
      </a>
    </div>
  </div>
);
