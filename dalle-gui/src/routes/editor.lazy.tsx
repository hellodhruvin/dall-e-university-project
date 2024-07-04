import { Canvas } from "@/ui/Canvas";
import * as fabric from "fabric";
import { format } from "date-fns";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
  drawCircle,
  drawScaledImageFromURL,
  drawSquareScaledImageFromURL,
  drawSvg,
  drawText,
} from "@/canvas/util";
import { CONSTANTS } from "@/ui/CONSTANTS";

export const Route = createLazyFileRoute("/editor")({
  component: Editor,
});

function Editor() {
  const fabricCanvasRef = useRef<fabric.Canvas>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const companyLogoFileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [companyLogoFile, setCompanyLogoFile] = useState<File | undefined>(
    undefined,
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>("");

  // @ts-ignore
  function debug_fabric_obj(object: fabric.FabricObject) {
    object.on("mousedown", () => {
      console.log({
        top: object.get("top"),
        left: object.get("left"),
        height: object.getScaledHeight(),
        width: object.getScaledWidth(),
      });
    });
  }

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

  async function drawBackground() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;

      fabricCanvas.clear();

      const img = await drawSquareScaledImageFromURL(imageUrl, 512, {
        selectable: false,
      });

      fabricCanvas.backgroundImage = img;

      fabricCanvas.renderAll();
    }
  }

  async function drawCompanyLogo() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;

      const img = await drawScaledImageFromURL(
        companyLogoUrl,
        {
          height: 50,
        },
        {
          selectable: true,
        },
      );

      img.top = 300;
      img.left = 14;

      fabricCanvas.add(img);

      fabricCanvas.renderAll();
    }
  }

  // Make this more readable, use currying, make the functions take parameters for a lot of manually adjusted stuff.
  async function drawStuff() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;

      const circle = drawCircle(-270, -451, 412, "white", 1);

      fabricCanvas.add(circle);

      const logo = await drawScaledImageFromURL(
        "/gsfc-logo-black.png",
        {
          height: 50,
        },
        {
          selectable: false,
        },
      );
      logo.left = 14;
      logo.top = 14;
      // @debug-code
      //debug_fabric_obj(logo)
      fabricCanvas.add(logo);

      const nameText = drawText(
        name,
        {
          color: CONSTANTS.orange_alt,
          fontSize: 38,
          italic: true,
          bold: true,
          underline: false,
          fontFamily: "Inter",
        },
        { selectable: false },
      );

      nameText.left = 15;
      nameText.top = 113;

      const line = new fabric.Line([0, 160, 162, 160], {
        stroke: CONSTANTS.orange_alt,
        strokeWidth: 2,
        selectable: false,
      });

      fabricCanvas.add(line);

      fabricCanvas.add(nameText);

      const branchText = drawText(
        branch,
        {
          color: CONSTANTS.blue,
          fontSize: 20,
          italic: false,
          bold: true,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      branchText.left = 14;
      branchText.top = 180;

      fabricCanvas.add(branchText);

      const calendarIcon = await drawSvg("/calendar-icon.svg", {
        selectable: false,
      });

      calendarIcon.top = 214;
      calendarIcon.left = 16;
      calendarIcon.selectable = false;

      fabricCanvas.add(calendarIcon);

      const dateText = drawText(
        `Batch ${format(date, "yyyy")}`,
        {
          color: "black",
          fontSize: 20,
          italic: false,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      dateText.left = 37;
      dateText.top = 214;

      fabricCanvas.add(dateText);

      const placedAtText = drawText(
        "Placed at",
        {
          color: "black",
          fontSize: 28,
          italic: false,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      placedAtText.left = 13;
      placedAtText.top = 247;

      fabricCanvas.add(placedAtText);
    }
  }

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setImageUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    if (companyLogoFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setCompanyLogoUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(companyLogoFile);
    }
  }, [companyLogoFile]);

  // Extract the fabric part and use existing states to load image and name this formGo
  async function formGo() {
    // TOOD: Remove if later when validation is added
    if (imageFile) {
      await drawBackground();
      await drawStuff();
    }

    if (companyLogoFile) {
      await drawCompanyLogo();
    }
  }

  function formClear() {
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = "";
    }
    if (companyLogoFileInputRef.current) {
      companyLogoFileInputRef.current.value = "";
    }

    setName("");
    setBranch("");
    setDate(new Date());
    setImageFile(undefined);
    setImageUrl("");
    setCompanyLogoFile(undefined);
    setCompanyLogoUrl("");

    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;
      fabricCanvas.clear();

      fabricCanvas.backgroundColor = "white";
      fabricCanvas.renderAll();
    }
  }

  function formDownload() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;
      const dataURL = fabricCanvas.toDataURL();
      const link = document.createElement("a");
      link.download = `placement-post-${name}-${format(date, "yyyy-MM-dd")}.png`;
      link.href = dataURL;
      link.click();
    }
  }

  return (
    <div className="p-2">
      <div className="flex w-full">
        <div className="flex justify-center items-center p-8">
          <Card>
            <CardHeader>
              <CardTitle>Student Placement Post Template</CardTitle>
              <CardDescription>
                Template for a social media post that congratulates a student
                for getting placed.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="background">Background Image</Label>
                  {}
                  <Input
                    ref={imageFileInputRef}
                    id="background"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0])}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of student"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Branch</Label>
                  <Input
                    id="branch"
                    placeholder="Branch of student"
                    onChange={(e) => setBranch(e.target.value)}
                    value={branch}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Date of Placement</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          `Batch ${format(date, "yyyy")}`
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(day) => setDate(day ?? new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="company-logo">Company Logo</Label>
                  <Input
                    ref={companyLogoFileInputRef}
                    id="company-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCompanyLogoFile(e.target.files?.[0])}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => formClear()}>
                Clear
              </Button>
              <Button onClick={() => formGo()}>Go</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="bg-gray-300 w-full flex flex-col justify-center h-[576px] items-center rounded-md">
          <Canvas ref={fabricCanvasRef} onLoad={onLoad} />
          <Button className="mt-3 mb-2" onClick={() => formDownload()}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
