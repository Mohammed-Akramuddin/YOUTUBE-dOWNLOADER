const inputField = document.querySelector("#sys");
const submitButton = document.querySelector("#syst");
const progressBar = document.querySelector("#progress");

submitButton.addEventListener("click", async () => {
    const videoUrl = inputField.value.trim();

    if (videoUrl) {
        try {
            const response = await fetch("https://youtube-downloader-1-3xal.onrender.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ link: videoUrl }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Video download started!");

                // Listen for progress updates
                const progressResponse = await fetch("https://mohammed-akramuddin.github.io/YOUTUBE-dOWNLOADER/progress");
                if (progressResponse.ok) {
                    const progressData = await progressResponse.json();
                    updateProgressBar(progressData.progress);
                }
            } else {
                const errorResult = await response.json();
                alert(errorResult.error || "Error downloading video.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    } else {
        alert("Please enter a valid URL.");
    }
});

// Function to update the progress bar
function updateProgressBar(progress) {
    progressBar.value = progress;
}
