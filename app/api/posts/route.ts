import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Video, { TVideo } from "@/models/Video.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB()
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()

        if(!videos || videos.length === 0){
            return NextResponse.json([],{status:200})
        }

        return NextResponse.json(videos,{status: 200})
    } catch (error) {
        return NextResponse.json({
            error: "Failed to fetched videos"
        },{status: 200})
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if(!session) {
            return NextResponse.json({
                error: "Unauthorized"
            }, {status: 401})
        }

        await connectDB()
        console.log("Connected to database");

        const body:TVideo = await request.json()
        if(
            !body.title || 
            !body.description || 
            !body.videoURL || 
            !body.thumbnailURL
        ){
            return NextResponse.json({
                error: "Missing required fields!"
            }, {status: 401})
        }
        console.log("all data are correct");
        const videoData = {
            ...body,
            controls: body?.controls?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality?? 100
            }
        }

        const newVideo = await Video.create(videoData);

        return NextResponse.json({
            success: true,
            message: "Video uploaded successfully",
            newVideo
        },{status: 200})
        
    } catch (error) {
        return NextResponse.json({
            error: "Failed to upload video! Please try again"
        }, {status: 500})
    }
}