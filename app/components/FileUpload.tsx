"use client";

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import axios from "axios";
import { useRef, useState } from "react";

interface FileUploadProps {
    onProgress: (progress: number) => void;
    onSuccess: (res: any) => void;
    onUploadError: (error: Error) => void;
    fileType?: "image" | "video";
}

const FileUpload = ( {
    onProgress,
    onSuccess,
    fileType
} : FileUploadProps) => {
    // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoURL, setVideoURL] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');

    // Create a ref for the file input element to access its files easily
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create an AbortController instance to provide an option to cancel the upload if needed.
    const abortController = new AbortController();

    //optional validation
    const validateFile = (file: File) => {
        // if(fileType === "video"){
        //     if(!file.type.startsWith("video/")){
        //         setError("Please select a valid video file");
        //     }
        // }

        // if(file.size > 100 * 1024 * 1024){ //100MB limit
        //     setError("File size exceeds 100MB");
        // }
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please select a valid video file");
                return;
            }
            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                setError("File size exceeds 100MB");
                return;
            }
        } else {
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setError("File size exceeds 10MB");
                return;
            }
        }

        return true
    }

    const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        const file = fileInput.files[0];

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });
            console.log("Upload response:", uploadResponse);
        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
        }
    };

    const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFile(file)) return;

        if (file) {
            setFileName(file.name);
            const url = URL.createObjectURL(file);
            setVideoURL(url);
        }

        setUploading(true);
        setError(null)

        try {
            const authRes = await axios.get('/api/auth/imagekit-auth');
            const authData = await authRes.data;
            console.log("Auth Data:", authData);
            // if (!authRes.ok) throw new Error(authData.message || "Failed to fetch auth data");

            const res = await upload({
                file,
                expire: authData.expire,
                token: authData.token,
                signature: authData.signature,
                publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
                fileName: file.name, 
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress){
                        const percentCompleted = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percentCompleted))
                    }
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            })

            console.log("Upload Success:", res);
            onSuccess(res)

        } catch (error) {
            console.error("Upload Failed", error);
            setError("Upload Failed");
        } finally{
            setUploading(false);
        }
        // Validate file type and size
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please select a valid video file");
                return;
            }
            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                setError("File size exceeds 100MB");
                return;
            }
        } else {
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setError("File size exceeds 10MB");
                return;
            }
        }

        setError(null);
        // Proceed with file upload
    }


    return (
        <>
            <input type="file" 
            ref={fileInputRef} 
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-primary w-full max-w-xs mb-4"
            />
            {uploading && <span>Uploading...</span>}
            <br />
            Upload progress: <progress value={progress} max={100} className="progress-bar"></progress>
            {videoURL && (
              <div>
                <p>Selected Video: {fileName}</p>
                <video controls width="100%">
                  <source src={videoURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
        </>
    );
};

export default FileUpload;