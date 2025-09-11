import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-darkbg text-textlight min-h-screen flex items-center justify-center p-4">
      <div class="bg-cardbg p-8 rounded-xl shadow-2xl w-full max-w-4xl text-center flex flex-col items-center">
        <h1 class="text-4xl font-extrabold text-primary mb-2">AI Image Studio</h1>
        <p class="text-gray-400 mb-8">अपनी तस्वीर अपलोड करें और AI से इसे बदलें</p>

        <!-- Image Upload Section -->
        <div class="mb-6 w-full">
          <label for="imageUpload" class="cursor-pointer file-input"></label>
          <input type="file" id="imageUpload" accept="image/jpeg, image/png" class="hidden" (change)="onFileSelected($event)">
        </div>

        <!-- Image Display Area -->
        <div class="flex flex-col md:flex-row justify-center items-start w-full space-y-4 md:space-y-0 md:space-x-4">
          <!-- User Uploaded Image -->
          <div class="w-full flex justify-center p-2 rounded-xl border border-dashed border-gray-600">
            <img [src]="selectedImage()" *ngIf="selectedImage()" class="max-w-full h-auto rounded-xl shadow-lg transition-transform duration-500 ease-in-out transform hover:scale-105" alt="आपकी तस्वीर" style="max-height: 400px;">
            <div *ngIf="!selectedImage()" class="text-gray-500 py-16">तस्वीर यहां दिखाई देगी</div>
          </div>

          <!-- Generated Image and Download Button Container -->
          <div class="relative w-full flex justify-center p-2 rounded-xl border border-dashed border-gray-600">
            @if (isLoading()) {
              <div class="text-primary py-16">
                <svg class="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-2">तस्वीर जनरेट हो रही है...</p>
              </div>
            } @else if (generatedImage()) {
              <img [src]="generatedImage()" class="max-w-full h-auto rounded-xl shadow-lg transition-transform duration-500 ease-in-out transform hover:scale-105" alt="AI द्वारा जनरेट की गई तस्वीर" style="max-height: 400px;">
              <button (click)="onDownload()" class="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-110 shadow-lg">
                डाउनलोड करें
              </button>
            } @else {
              <div class="text-gray-500 py-16">जनरेट की गई तस्वीर यहां दिखाई देगी</div>
            }
          </div>
        </div>
        
        <!-- Loading and Message Area -->
        @if (statusMessage()) {
          <div class="mt-6 text-center text-secondary font-semibold">{{ statusMessage() }}</div>
        }

        <!-- Prompt Buttons -->
        @if (selectedImage()) {
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <button class="bg-gray-700 hover:bg-gray-600 text-textlight font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out" (click)="onButtonClick('Convert the image to a cartoon style.')">इसे कार्टून जैसा बनाओ</button>
            <button class="bg-gray-700 hover:bg-gray-600 text-textlight font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out" (click)="onButtonClick('Convert the image into a watercolor painting.')">इसे एक वॉटरकलर पेंटिंग बनाओ</button>
            <button class="bg-gray-700 hover:bg-gray-600 text-textlight font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out" (click)="onButtonClick('Add futuristic sci-fi effects to the image.')">फ्यूचरिस्टिक Sci-Fi इफ़ेक्ट जोड़ो</button>
            <button class="bg-gray-700 hover:bg-gray-600 text-textlight font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out" (click)="onButtonClick('Convert the image into a charcoal sketch.')">इसे चारकोल स्केच में बदलो</button>
            <button class="bg-gray-700 hover:bg-gray-600 text-textlight font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out" (click)="onButtonClick('Then Create a 1/7 scale commercialized figurine of the characters in the picture, in a realistic style, in a real environment. The figurine is placed on a computer desk. The figurine has a round transparent acrylic base, with no text on the base. The content on the computer screen is a 3D modeling process of this figurine. Next to the computer screen is a toy packaging box, designed in a style reminiscent of high-quality collectible figures, printed with original artwork. The packaging features two-dimensional flat illustrations.')">Viral Model Image Generate</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    :host {
      --darkbg: #1a1a1a;
      --cardbg: #252525;
      --primary: #3b82f6;
      --secondary: #ef4444;
      --textlight: #f9fafb;
      font-family: 'Inter', sans-serif;
    }
    .file-input::-webkit-file-upload-button {
      visibility: hidden;
    }
    .file-input::before {
      content: 'तस्वीर चुनें (JPEG/PNG)';
      display: inline-block;
      background: var(--primary);
      color: var(--textlight);
      font-weight: bold;
      border-radius: 9999px;
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: scale(1);
    }
    .file-input:hover::before {
      background: #2563eb;
      transform: scale(1.05);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  selectedImage = signal<string | null>(null);
  generatedImage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  statusMessage = signal<string | null>(null);

  apiKey = ""; // This will be provided by the runtime

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage.set(e.target?.result as string);
        this.generatedImage.set(null);
        this.statusMessage.set(null);
      };
      reader.readAsDataURL(file);
    }
  }

  async onButtonClick(prompt: string) {
    if (!this.selectedImage()) {
      this.statusMessage.set('कृपया पहले एक तस्वीर अपलोड करें।');
      return;
    }

    this.isLoading.set(true);
    this.generatedImage.set(null);
    this.statusMessage.set(null);

    try {
      const uploadedBase64 = this.selectedImage()!.split(',')[1];
      const apiUrl = https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${this.apiKey};
      
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
          this.generatedImage.set(data:image/jpeg;base64,${base64Data});
      } else {
          throw new Error('API से कोई तस्वीर नहीं मिली। दोबारा कोशिश करें।');
      }
    } catch (error: any) {
        this.statusMessage.set(Error: ${error.message});
        console.error('API call failed:', error);
    } finally {
        this.isLoading.set(false);
    }
  }

  onDownload() {
    const link = document.createElement('a');
    link.href = this.generatedImage()!;
    link.download = 'ai_generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}