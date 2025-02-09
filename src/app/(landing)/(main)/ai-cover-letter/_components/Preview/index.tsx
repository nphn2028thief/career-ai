"use client";

import MDEditor from "@uiw/react-md-editor";

interface IProps {
  content: string;
}

function CoverLetterPreview({ content }: IProps) {
  return (
    <div className="py-4">
      <MDEditor value={content} preview="preview" height={700} />
    </div>
  );
}

export default CoverLetterPreview;
