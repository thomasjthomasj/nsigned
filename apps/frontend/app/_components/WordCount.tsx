"use client";

import { useEffect, useMemo } from "react";

import { getWordCount } from "@/_utils/text";

type WordCountProps = {
  text: string;
  setWordCount: (wordCount: number) => void;
};

export const WordCount = ({ text, setWordCount }: WordCountProps) => {
  const wordCount = useMemo(() => getWordCount(text), [text]);

  useEffect(() => {
    setWordCount(wordCount);
  }, [wordCount]);

  return (
    <p className="text-[12px] text-foreground-500 -mt-[5px]">
      {wordCount} word{wordCount === 1 ? "" : "s"}
    </p>
  );
};
