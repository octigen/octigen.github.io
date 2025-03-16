"use client";

import { useState } from "react";
import { Upload, FileUp, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/mode-toggle";

const loadingMessages = [
  "Scanning your document...",
  "Analyzing presentation structure...",
  "Extracting color schemes and styles...",
  "Processing text formatting...",
  "Updating graphs and tables...",
  "Optimizing design elements...",
  "Finalizing template adjustments..."
];

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { theme } = useTheme();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
      setFile(droppedFile);
      startProcessing();
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
      setFile(selectedFile);
      startProcessing();
    }
  };

  const startProcessing = () => {
    let currentProgress = 0;
    const totalTime = 60000; // 60 seconds
    const interval = 50; // Update every 50ms for smoother animation
    const steps = totalTime / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
      } else {
        setProgress(Math.min(currentProgress, 100));
      }

      // Update message every ~8.5 seconds (60 seconds / 7 messages)
      const messageIndex = Math.min(
        Math.floor((currentProgress / 100) * loadingMessages.length),
        loadingMessages.length - 1
      );
      setCurrentMessageIndex(messageIndex);
    }, interval);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <Button 
          variant="outline" 
          className="bg-white dark:bg-white/10 text-foreground border-[rgba(30,79,226,0.3)] hover:bg-[rgba(30,79,226,0.1)] hover:text-foreground"
        >
          Login
        </Button>
        <Button 
          className="bg-[rgba(30,79,226,1)] hover:bg-[rgba(30,79,226,0.9)] text-white"
        >
          Register
        </Button>
        <ModeToggle />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-16">
          <Image
            src="https://octigen.com/assets/images/logo_octigen_black.png"
            alt="Octigen Logo"
            width={200}
            height={44}
            className="dark:invert"
            priority
          />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[rgba(30,79,226,1)] to-[rgba(30,79,226,0.8)]">
            PowerPoint Template Analyzer
          </h1>
          <p className="text-muted-foreground text-lg">
            Drop your presentation and let us analyze its design patterns
          </p>
        </div>

        {!file ? (
          <div
            className={`
              border-2 border-dashed rounded-xl p-12 transition-all duration-200 backdrop-blur-sm
              shadow-[0_0_15px_rgba(30,79,226,0.1)]
              ${isDragging 
                ? "border-[rgba(30,79,226,1)] bg-[rgba(30,79,226,0.05)] shadow-[0_0_20px_rgba(30,79,226,0.2)]" 
                : "border-[rgba(30,79,226,0.3)] hover:border-[rgba(30,79,226,0.5)] hover:shadow-[0_0_20px_rgba(30,79,226,0.15)]"}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-[rgba(30,79,226,0.1)]">
                <Upload className="w-10 h-10 text-[rgba(30,79,226,1)]" />
              </div>
              <div className="text-center">
                <p className="text-xl font-medium mb-2 text-foreground/90">
                  Drag & Drop your PowerPoint file here
                </p>
                <p className="text-sm text-foreground/70 mb-4">
                  or click to browse from your computer
                </p>
                <label className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[rgba(30,79,226,1)] text-white hover:bg-[rgba(30,79,226,0.9)] transition-colors cursor-pointer shadow-md hover:shadow-lg">
                  <FileUp className="w-4 h-4" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pptx"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto backdrop-blur-sm p-8 rounded-xl border border-[rgba(30,79,226,0.2)]">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="h-8 w-8 rounded-full bg-[rgba(30,79,226,0.1)] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[rgba(30,79,226,1)]" />
              </div>
              <p className="text-lg font-medium text-foreground transition-opacity duration-500">
                {loadingMessages[currentMessageIndex]}
              </p>
            </div>
            <Progress 
              value={progress} 
              className="h-2.5 bg-[rgba(30,79,226,0.1)]"
              style={{
                '--progress-background': 'rgba(30,79,226,0.2)',
                '--progress-foreground': 'rgba(30,79,226,1)',
              } as any}
            />
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {progress.toFixed(0)}% complete
            </p>
          </div>
        )}
      </div>
    </main>
  );
}