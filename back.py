from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cur_dir = os.getcwd()

# Background download function to allow asynchronous processing
def background_download(link: str):
    try:
        youtube_dl_options = {
            "format": "b",
            "outtmpl": os.path.join(cur_dir, f"video{link[-11:]}.mp4"),
        }
        with yt_dlp.YoutubeDL(youtube_dl_options) as ydl:
            ydl.download([link])
    except Exception as e:
        print(f"Download error: {e}")

@app.post("/sample")
async def download_video(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    link = data.get("link")

    if not link:
        return {"error": "No link provided"}

    # Schedule background download task
    background_tasks.add_task(background_download, link)
    return {"message": "Download started in the background"}
