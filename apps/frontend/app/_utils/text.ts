import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "ul", "ol", "li", "blockquote", "em", "strong"],
  });
