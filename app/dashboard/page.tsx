// app/dashboard/page.tsx or components/Dashboard.tsx
'use client';

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import VideoComponent from "../components/VideoComponent";
import { TVideo } from "@/models/Video.model";
import Link from "next/link";
import { error } from "console";
import VideoComponent from "../components/VideoComponent";


interface Media {
  id: string;
  type: 'video' | 'photo';
  url: string;
  title: string;
  uploadedAt: string;
}

const Dashboard = () => {
  const { data: session, status } = useSession()
  const [videos, setVideos] = useState<TVideo[]>([])
  const [loading , setLoading] = useState(false)

  useEffect(()=>{
    const fetchVideos = async() => {
      try {
        setLoading(true)
        const response = await axios.get('/api/posts')
        const videoData = response.data;
        console.log(videoData);
        setVideos(videoData)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchVideos()
  },[session , status])

  return (
    <div className="p-8">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video._id.toString()} className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
              <VideoComponent video={video}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard