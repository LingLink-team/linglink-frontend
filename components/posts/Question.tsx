import { ProgressService } from "@/app/services";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import AudioPlayer from "react-h5-audio-player";

interface QuestionProps {
  id: string;
  content: string;
  answers: string[];
  audio_url?: string;
  user_answers?: {
    answer: number;
    createdAt: Date;
  }[];
  a_key: number;
}

const Question: React.FC<QuestionProps> = ({
  content,
  answers,
  a_key,
  audio_url,
  id
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const handleAnswer = async (index: number) => {
    setSelectedAnswer(index);
    if (index === a_key) {
      setShowConfetti(true);
      await ProgressService.updateQuestion(id, true);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    } else {
      await ProgressService.updateQuestion(id, false);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }
  };
  const queryClient = useQueryClient();

  return (
    <div className="mt-2 w-full">
      <div className="flex w-full justify-center">
        {showConfetti && (
          <ConfettiExplosion
            particleCount={80}
            duration={2500}
            width={1000}
            force={0.6}
          />
        )}
      </div>
      <div className="font-semibold">{content}</div>
      {audio_url && (
        <div className="px-6 mb-4">
          <AudioPlayer
            autoPlay={false}
            src={audio_url}
            className="w-full my-2"
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mt-2">
        {answers.map((ans, index: number) => (
          <div
            key={index}
            className={`transition-all hover:scale-[1.02] duration-300 border border-slate-400 cursor-pointer rounded-md p-2 ${
              selectedAnswer !== null && index === a_key
                ? "bg-green-200 !border-green-500"
                : selectedAnswer !== null && "bg-red-200 !border-red-500"
            }
            }`}
            onClick={() => handleAnswer(index)}
          >
            {ans}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
