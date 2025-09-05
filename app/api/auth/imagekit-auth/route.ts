import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    try {
        const {token, expire, signature} = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
        })

        console.log(token);

        return Response.json({ 
            token, expire, signature,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY 
        }, {status: 200})

    } catch (error) {
        console.log(error);
        return Response.json({
            error: "Authentication for imagekit failed"
        }, {
            status: 400
        })
    }
}