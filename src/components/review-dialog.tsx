"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { QuestionFormSchema } from "@/lib/schemas";
import { Button } from "./ui/button";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: QuestionFormSchema;
  classAndSubject: {
    className: string;
    subjectName: string;
  };
}

export function ReviewDialog({
  isOpen,
  onClose,
  onConfirm,
  formData,
  classAndSubject,
}: ReviewDialogProps) {
  if (!isOpen) return null;

  const { chapters, questionTypes } = formData;
  const { className, subjectName } = classAndSubject;
  
  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);
  const generationCost = Math.ceil(totalQuestions / 10);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Review Your Choices</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm your selections below before generating the question paper.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-muted-foreground">Class:</span>
            <span>{className}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-muted-foreground">Subject:</span>
            <span>{subjectName}</span>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Chapters:</span>
            <ul className="list-disc list-inside mt-1 pl-2 space-y-1 max-h-32 overflow-y-auto">
              {chapters.map((chapter) => (
                <li key={chapter.id}>{chapter.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Question Types:</span>
            <ul className="list-disc list-inside mt-1 pl-2 space-y-1">
              {questionTypes.map((qt) => (
                <li key={qt.id} className="flex justify-between">
                    <span>{qt.type}</span>
                    <span>({qt.count} questions)</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold">
                <span className="text-muted-foreground">Total Questions:</span>
                <span>{totalQuestions}</span>
            </div>
            <div className="flex justify-between font-bold text-primary">
                <span className="">Generation Cost:</span>
                <span>{generationCost} {generationCost > 1 ? 'Credits' : 'Credit'}</span>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button onClick={() => {
            onClose();
            onConfirm();
          }}>
            Confirm & Generate
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
