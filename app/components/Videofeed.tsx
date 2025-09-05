'use client'
import { TVideo } from "@/models/Video.model";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: TVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <VideoComponent key={video._id?.toString()} video={video} />
        ))}
      </div>
    </div>
  );
}
