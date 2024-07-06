import { Canvas } from "@/ui/Canvas";
import * as fabric from "fabric";
import { format } from "date-fns";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { TemplatePlacment } from "@/losing_my_mind/template_placement";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplateSeminar } from "@/losing_my_mind/template_seminar/index";

export const Route = createLazyFileRoute("/editor")({
  component: Editor,
});

type TAcceptableValues = "placement" | "seminar";

function Editor() {
  const fabricCanvasRef = useRef<fabric.Canvas>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TAcceptableValues>("placement");

  const onLoad = useCallback(
    (fabricCanvas: fabric.Canvas) => {
      fabricCanvas.height = 1024;
      fabricCanvas.width = 1024;
      fabricCanvas.setDimensions({
        width: 512,
        height: 512,
      });
      fabricCanvas.backgroundColor = "white";
      fabricCanvas.renderAll();
    },
    [fabricCanvasRef],
  );

  function formDownload() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;
      const dataURL = fabricCanvas.toDataURL();
      const link = document.createElement("a");
      link.download = `generated-post-${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = dataURL;
      link.click();
    }
  }

  return (
    <div className="p-2">
      <div className="flex w-full items-center">
        <div className="flex justify-center items-center p-8">
          {selectedTemplate === "placement" && (
            <TemplatePlacment fabricCanvasRef={fabricCanvasRef} />
          )}
          {selectedTemplate === "seminar" && (
            <TemplateSeminar fabricCanvasRef={fabricCanvasRef} />
          )}
        </div>
        <div className="flex flex-col w-full h-full space-y-4">
          <div className="w-full h-full">
            <Select
              defaultValue="placement"
              value={selectedTemplate}
              onValueChange={(v) => setSelectedTemplate(v as TAcceptableValues)}
            >
              <SelectTrigger className="w-full h-full">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Templates</SelectLabel>
                  <SelectItem value="placement">
                    Student Placement Post
                  </SelectItem>

                  <SelectItem value="seminar">
                    Seminar Announcement Post
                  </SelectItem>

                  <SelectItem value="sample-replace-1" disabled={true}>
                    Student Internship Post
                  </SelectItem>
                  <SelectItem value="sample-replace-2" disabled={true}>
                    Student Sports Achievement Post
                  </SelectItem>

                  <SelectItem value="sample-replace-3" disabled={true}>
                    Student Sports Event Post
                  </SelectItem>
                  <SelectItem value="sample-replace-4" disabled={true}>
                    Flagship Event Posts
                  </SelectItem>
                  <SelectItem value="sample-replace-5" disabled={true}>
                    Foundation Course Posts
                  </SelectItem>

                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-gray-300 w-full flex flex-col justify-center h-[576px] items-center rounded-md">
            <Canvas ref={fabricCanvasRef} onLoad={onLoad} />
            <Button className="mt-3 mb-2" onClick={() => formDownload()}>
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
