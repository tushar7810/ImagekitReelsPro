import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { NextRequest , NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const {fullname,username ,email,password,confirmPassword} = await request.json();
        if(!email || !password || !fullname || !username ){
            return NextResponse.json({
                error: "Please provide all correct details."
            }, {status: 400});
        }
        await connectDB()
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({
                error: "User already existed",
                existingUser
            },{status: 200})
        }
        if(password !== confirmPassword){
            return NextResponse.json({
                error: "Conformed Password not matched"
            }, {status: 400});

        }
        const user = await User.create({
            fullname,
            email,
            password,
            username
        })

        return NextResponse.json({
            message: "User registered successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                username: user.username
            }
        }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: "Failed to register user!"},
            {status: 400}
        )
    }
}