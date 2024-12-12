const inputField = document.querySelector("#sys");
const submitButton = document.querySelector("#syst");

submitButton.addEventListener("click", async () => {
    const videoUrl = inputField.value.trim();

    if (videoUrl) {
        try {
            console.log("Sending request to backend with video URL:", videoUrl);

            // Use the actual URL of your deployed backend on Render
            const response = await fetch("http://127.0.0.1:8000/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ link: videoUrl }),
            });
            

            console.log("Response received from backend:", response);

            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Video download started!");
            } else {
                const errorResult = await response.json();
                alert(errorResult.error || "Error downloading video.");
            }
        } catch (error) {
            console.error("Error occurred while making the request:", error);
            alert("An error occurred. Please try again.");
        }
    } else {
        alert("Please enter a valid URL.");
    }
});
