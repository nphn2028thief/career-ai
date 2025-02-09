"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CoverLetter } from "@prisma/client";
import { Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { deleteCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EPath from "@/constants/path";
import useFetch from "@/hooks/useFetch";

interface IProps {
  coverLetters: CoverLetter[];
}

function CoverLetterList({ coverLetters }: IProps) {
  const router = useRouter();

  const [coverLetterList, setCoverLetterList] = useState<CoverLetter[]>([]);

  const {
    isLoading: isDeleting,
    fn: deleteCoverLetterFn,
    data: coverLetterData,
    error: errorDelete,
  } = useFetch<CoverLetter>(deleteCoverLetter);

  useEffect(() => {
    if (coverLetters) {
      setCoverLetterList(coverLetters);
    }
  }, [coverLetters]);

  useEffect(() => {
    if (errorDelete) {
      toast.error("Failed to delete cover letter");
      return;
    }

    if (!isDeleting && coverLetterData) {
      toast.success("Delete cover letter successfully!");
      setCoverLetterList((prev) =>
        prev.filter((item) => item.id !== coverLetterData.id)
      );
    }
  }, [coverLetterData, errorDelete, isDeleting]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCoverLetterFn(id);
    } catch (error) {
      console.log("Error delete cover letter: ", error);
    }
  };

  return coverLetterList.map((item) => (
    <Card key={item.id}>
      <CardHeader className="flex space-y-0 pb-2">
        <div className="flex flex-row justify-between items-center space-y-0">
          <CardTitle>
            {item.jobTitle} at {item.companyName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => router.push(`${EPath.COVER_LETTER}/${item.id}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your cover letter for {item.jobTitle} at {item.companyName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(item.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Created: {format(new Date(item.createdAt), "MMMM dd, yyyy HH:mm")}
        </p>
      </CardHeader>
      <CardContent>
        <p className="mt-2 text-sm text-muted-foreground">{item.jobDesc}</p>
      </CardContent>
    </Card>
  ));
}

export default CoverLetterList;
