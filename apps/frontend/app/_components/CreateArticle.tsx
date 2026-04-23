"use client"

import { useCallback, useState } from "react"

const AUTHOR_ID = 1;
const ENDPOINT = "http://localhost:8000/articles/create";

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
      <div className="flex gap-[10px]">
        <label htmlFor="title">Title</label>
        <input name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
      </div>
      <div className="flex gap-[10px]">
        <label htmlFor="externalLink">Bandcamp link</label>
        <input name="externalLink" id="externalLink" value={externalLink} onChange={(e) => setExternalLink(e.target.value)}/>
      </div>
      <div className="flex gap-[10px]">
        <label htmlFor="content">Content</label>
        <textarea name="content" id="content" value={content} onChange={(e) => setContent(e.target.value)}/>
      </div>
      <button
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}
