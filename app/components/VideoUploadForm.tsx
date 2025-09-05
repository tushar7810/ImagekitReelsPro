'use client'
import React from "react";
import FileUpload from "./FileUpload";
import ThumbnailUpload from "./ThumbnailUpload";
import axios from "axios";
import Video from "@/models/Video.model";
import { useNotification } from "./Notification";
import { useRouter } from "next/router";

const VideoUploadForm = () => {
  const [videoURL , setVideoURL] = React.useState<string>("");
  const [thumbnailURL, setThumbnailURL] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const { showNotification } = useNotification();
  // const [tags, setTags] = React.useState<string>("");

  // const router = useRouter()

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoURL || !thumbnailURL || !title || !description) {
      showNotification("Please fill in all fields", "error");
      return;
    }
    const details = await axios.post('/api/posts', {
      title,
      description,
      videoURL,
      thumbnailURL
    }, {
      headers: {
        "Content-Type" : "application/json"
      }
    })

    const response = details.data;

    console.log("Video upload response:", response);


    showNotification("Video uploaded successfully!", 'success');

    // console.log(newPost);

    // router.push('/dashboard')
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col gap-4">
        <div className="mb-4">
            <label className="block text-cyan-400 text-sm font-bold mb-2" htmlFor="videoTitle">
            Video Title
            </label>
            <input
            type="text"
            id="videoTitle"
            className="shadow appearance-none border rounded w-full text-[#605dff] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter video title"
            onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div className="mb-4">
            <label className="block text-cyan-400 text-sm font-bold mb-2" htmlFor="videoDescription">
            Video Description
            </label>
            <textarea
            id="videoDescription"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-[#605dff] leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter video description"
            onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        <div className="mb-4">
          <label className="block text-cyan-400 text-sm font-bold mb-2" htmlFor="videoDescription">
            Upload Video 
          </label>
          <FileUpload
          onProgress={(progress) => console.log(`Upload progress: ${progress}%`)}
          onSuccess={(res) => setVideoURL(res.url)}
          onUploadError={(error) => console.error("Upload error:", error)}
          fileType="video"
          />
        </div>
        

        <div className="mb-4">
          <label className="block text-cyan-400 text-sm font-bold mb-2" htmlFor="thumbnail">
            Upload Thumbnail
          </label>
          <ThumbnailUpload
          onProgress={(progress) => console.log(`Upload progress: ${progress}%`)}
          onSuccess={(res) => setThumbnailURL(res.url)}
          onUploadError={(error) => console.error("Upload error:", error)}
          fileType="image"
          />
        </div>

        <button
          type="submit"
          className="bg-[#605dff] hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline max-w-fit"
        >
          Create Post
        </button>

    </form>
    </>
  );
};

export default VideoUploadForm;
