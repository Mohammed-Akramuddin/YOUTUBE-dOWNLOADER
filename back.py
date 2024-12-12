from fastapi import FastAPI, Request, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from yt_dlp import YoutubeDL
import time
from urllib.parse import urlparse

app = FastAPI()

# CORS Middleware Configuration


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mohammed-akramuddin.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Serve static files
app.mount("/", StaticFiles(directory=".", html=True))

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
        options = {
            "format": "bestvideo+bestaudio/best",
            "merge_output_format": "mp4",
            "outtmpl": os.path.join(downloads_dir, "%(title)s.%(ext)s"),
            "noplaylist": True,
            "postprocessors": [{
                "key": "FFmpegVideoConvertor",
                "preferedformat": "mp4"
            }],
        }

        with YoutubeDL(options) as ydl:
            ydl.download([link])
    except Exception as e:
        print(f"Download error: {e}")

@app.post("/download")
async def download_video(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    link = data.get("link")

    if not link or not is_valid_youtube_url(link):
        raise HTTPException(status_code=400, detail="Invalid or missing YouTube link")

    try:
        # Schedule background download task
        background_tasks.add_task(background_download, link)
        return {"message": "Download started in the background"}
    except HTTPException as e:
        return {"error": str(e.detail)}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}
