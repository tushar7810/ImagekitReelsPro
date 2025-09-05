import mongoose, {Schema , models, model} from "mongoose";

export const videoDimensions = {
    height: 1930,
    width: 1080,
} as const;


export interface TVideo{
    _id: mongoose.Types.ObjectId,
    title: string,
    description: string,
    videoURL: string,
    thumbnailURL: string,
    controls?: boolean,
    transformation: {
        height: number,
        width: number,
        quality?: number
    }
}

const videoSchema = new Schema<TVideo>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoURL: {
        type: String,
        required: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    controls:{
        type: Boolean,
        default: true
    },
    transformation: {
        height: {type:Number, default: videoDimensions.height},
        width: {type:Number, default: videoDimensions.width},
        quality: {
            type: Number,
            min: 1,
            max:100
        }
    }
}, {timestamps: true})

const Video = models?.Video || model<TVideo>("Video", videoSchema)

export default Video