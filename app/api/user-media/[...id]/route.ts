import Video from "@/models/Video.model";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string[] } }) {
  const userId = params.id.toString();
  console.log(userId);
  const media = await Video.find({ _id: userId });
  return NextResponse.json(media);
}