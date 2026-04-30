"use client"

import { useCallback, useState } from "react";
import { FormField } from "@/_components/FormField";
import { getEndpoint } from "@/_utils/api.client";

const AUTHOR_ID = 1;
const ENDPOINT = getEndpoint("articles/create");

export const CreateArticle = () => {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [externalLink, setExternalLink] = useState<string>("")

  const handleSave = useCallback(async () => {
    const formData = new FormData();
    formData.append("author_id", `${AUTHOR_ID}`)
    formData.append("title", title)
    formData.append("content", content)
    formData.append("external_link", externalLink)
    const result = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author_id: AUTHOR_ID,
        title,
        content,
        external_link: externalLink,
      }),
    })
    const response = await result.json()
    console.log(response)
  }, [title, content, externalLink])

  return (
    <div className="flex flex-col gap-[10px]">
      <FormField
        label="Title"
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <FormField
        label="Bandcamp link"
        name="externalLink"
        onChange={(e) => setExternalLink(e.target.value)}
        value={externalLink}
      />
      <FormField
        label="Content"
        name="content"
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />
      <button
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}
