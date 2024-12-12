from fastapi import FastAPI, Request, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from yt_dlp import YoutubeDL
from urllib.parse import urlparse

app = FastAPI()

# CORS Middleware Configuration
# Adjust the URL to your frontend hosted on GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mohammed-akramuddin.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Directory setup for downloads
cur_dir = os.getcwd()
downloads_dir = os.path.join(cur_dir, "downloads")
os.makedirs(downloads_dir, exist_ok=True)

# Validate YouTube URL
def is_valid_youtube_url(url):
    parsed_url = urlparse(url)
    return parsed_url.netloc in ("www.youtube.com", "youtu.be") and parsed_url.path

# Background Download Function
def background_download(link: str):
    try:
        # Get the path to the system's default Downloads directory
        downloads_path = os.path.join(os.path.expanduser("~"), "Downloads")
        options = {
            "format": "bestvideo+bestaudio/best",
            "merge_output_format": "mp4",
            "outtmpl": os.path.join(downloads_path, "%(title)s.%(ext)s"),
            "noplaylist": True,
            "postprocessors": [{
                "key": "FFmpegVideoConvertor",
                "preferedformat": "mp4"
            }],
        }

        with YoutubeDL(options) as ydl:
            ydl.download([link])
        print(f"Download completed for: {link}")
    except Exception as e:
        print(f"Download error for {link}: {e}")

@app.post("/download")
async def download_video(request: Request, background_tasks: BackgroundTasks):
    try:
        data = await request.json()
        link = data.get("link")
        print(f"Received download request for link: {link}")

        if not link or not is_valid_youtube_url(link):
            raise HTTPException(status_code=400, detail="Invalid or missing YouTube link")

        background_tasks.add_task(background_download, link)
        return {"message": "Video download started successfully!"}

    except HTTPException as http_err:
        print(f"HTTP error: {http_err.detail}")
        raise http_err
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": f"Unexpected error: {e}"}
