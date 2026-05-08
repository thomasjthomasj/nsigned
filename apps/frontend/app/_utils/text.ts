import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "ul", "ol", "li", "blockquote", "em", "strong"],
  });

export const upper = (text: string) =>
  `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export const parseISODate = (isoDate: string) => {
  function getOrdinal(day: number) {
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
  }
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
