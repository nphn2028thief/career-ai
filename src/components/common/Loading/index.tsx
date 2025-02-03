import { LoaderCircle } from "lucide-react";

function Loading() {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <LoaderCircle className="w-8 h-8 animate-spin" />
    </div>
  );
}

export default Loading;
