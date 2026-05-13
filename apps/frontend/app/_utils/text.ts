import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["a", "p", "ul", "ol", "li", "blockquote", "em", "strong"],
  });

export const upper = (text: string) =>
  `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export const getOrdinal = (day: number) => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

export const parseISODate = (isoDate: string) => {
  const date = new Date(isoDate);

  const formatted = `${getOrdinal(date.getUTCDate())} ${date.toLocaleString(
    "en-GB",
    {
      month: "long",
      timeZone: "UTC",
    },
  )} ${date.getUTCFullYear()}`;

  return formatted;
};

export const parseISOLocalTime = (isoDate: string) => {
  const date = new Date(isoDate);

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatted = `${getOrdinal(date.getDate())} ${date.toLocaleString(
    "en-GB",
    { month: "long" },
  )} ${date.getFullYear()} ${time}`;

  return formatted;
};

export const getWordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;
