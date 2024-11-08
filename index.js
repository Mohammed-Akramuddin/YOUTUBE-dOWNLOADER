const inputField = document.querySelector("#sys");
const submitButton = document.querySelector("#syst");

submitButton.addEventListener("click", async () => {
    const videoUrl = inputField.value.trim();

    if (videoUrl) {
        try {
            const response = await fetch("http://127.0.0.1:8000/sample", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ link: videoUrl }),
            });
            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Video download started!");
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
