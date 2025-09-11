// DOM elements ko get karein
const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');
const generatedImage = document.getElementById('generatedImage');
const generatedImageContainer = document.getElementById('generatedImageContainer');
const buttonContainer = document.getElementById('buttonContainer');
const downloadButton = document.getElementById('downloadButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const statusMessage = document.getElementById('statusMessage');

const apiKey = ""; // Canvas runtime isko automatic bharega

document.addEventListener('DOMContentLoaded', () => {
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block';
                buttonContainer.style.display = 'grid'; 
                generatedImageContainer.style.display = 'none'; 
                statusMessage.style.display = 'none'; 
            };
            reader.readAsDataURL(file);
        }
    });

    document.querySelectorAll('.prompt-button').forEach(button => {
        button.addEventListener('click', async () => {
            const prompt = button.getAttribute('data-prompt'); 
            const uploadedBase64 = uploadedImage.src.split(',')[1];

            if (!uploadedBase64) {
                statusMessage.textContent = 'कृपया पहले एक तस्वीर अपलोड करें।';
                statusMessage.style.display = 'block';
                return;
            }

            showLoading();

            try {
                const apiUrl = https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey};
                
                const payload = {
                    contents: [{
                        parts: [{
                            text: prompt
                        }, {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: uploadedBase64
                            }
                        }]
                    }],
                    generationConfig: {
                        responseModalities: ["IMAGE"]
                    }
                };

                let response = null;
                let retries = 0;
                const maxRetries = 3;

                while (retries < maxRetries) {
                    try {
                        response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                        if (response.status !== 429) {
                            break;
                        }
                    } catch (e) {
                        console.error("Fetch error:", e);
                    }
                    retries++;
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
                }

                if (!response || !response.ok) {
                     const errorBody = await response.json();
                     throw new Error(API Request failed: ${response.statusText} - ${JSON.stringify(errorBody)});
                }

                const result = await response.json();
                const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

                if (base64Data) {
                    generatedImage.src = data:image/jpeg;base64,${base64Data};
                    generatedImageContainer.style.display = 'flex'; 
                } else {
                    throw new Error('API se koi tasveer nahi mili. Dobara koshish karein.');
                }
            } catch (error) {
                statusMessage.textContent = Error: ${error.message};
                statusMessage.style.display = 'block';
                console.error('API call failed:', error);
            } finally {
                hideLoading();
            }
        });
    });

    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = generatedImage.src;
        link.download = 'ai_generated_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    function showLoading() {
        loadingIndicator.style.display = 'block';
        statusMessage.style.display = 'none';
        buttonContainer.style.display = 'none';
        generatedImageContainer.style.display = 'none';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
        buttonContainer.style.display = 'grid';
    }
});