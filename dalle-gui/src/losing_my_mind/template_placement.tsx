import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Canvas, Line } from "fabric";
import { RefObject } from "react";

interface ITemplatePlacementProps {
  fabricCanvasRef: RefObject<Canvas>;
}

export function TemplatePlacment({ fabricCanvasRef }: ITemplatePlacementProps) {
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const companyLogoFileInputRef = useRef<HTMLInputElement>(null);
  const studentImageFileInputRef = useRef<HTMLInputElement>(null);

  const [studentImageFile, setStudentImageFile] = useState<File | undefined>(
    undefined,
  );
  const [studentImageUrl, setStudentImageUrl] = useState<string>("");
  const [mustRemoveBackground, setMustRemoveBackground] = useState(false);

  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [companyLogoFile, setCompanyLogoFile] = useState<File | undefined>(
    undefined,
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>("");

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

  function createObjectURL(blob: Blob) {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(blob);
        resolve(url);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function removeBackgroundAndDraw() {
    if (studentImageFile) {
      const this_is_my_api_key_if_you_misuse_this_i_will_haunt_you_in_your_dreams =
        "eMWQDPh237eng4SF6jy2esgw";

      const formData = new FormData();
      formData.append("size", "auto");
      formData.append("image_file", studentImageFile);
      formData.append("format", "png");
      formData.append("crop", "true");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key":
            this_is_my_api_key_if_you_misuse_this_i_will_haunt_you_in_your_dreams,
        },
        body: formData,
      });

      if (response.ok) {
        setStudentImageUrl("");
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "image/png" });

        const imageUrl = await createObjectURL(blob);
        console.log({ imageUrl });
        setStudentImageUrl(imageUrl as string);

        // Literally copy pasted the function to avoid race conditions. Talk about bad code!
        if (fabricCanvasRef.current) {
          const fabricCanvas = fabricCanvasRef.current;

          const img = await drawScaledImageFromURL(
            imageUrl as string,
            {
              width: 250,
            },
            {
              selectable: true,
            },
          );

          img.top = 130;
          img.left = 250;

          fabricCanvas.add(img);

          fabricCanvas.renderAll();
        }
        return;
      } else {
        console.log(`${response.status}: ${response.statusText}`);
        toast({
          title: "An error has occured. Please report this to developers.",
          variant: "destructive",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 break-normal whitespace-pre-wrap">
              <code className="text-white">
                {"API Call to remove.bg has failed"}
              </code>
            </pre>
          ),
        });
        return;
      }
    }
  }

  async function drawStudentPhotoForPlacementPosts() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;

      const img = await drawScaledImageFromURL(
        studentImageUrl,
        {
          width: 310,
        },
        {
          selectable: true,
        },
      );

      img.top = 42;
      img.left = 231;
      debug_fabric_obj(img);

      fabricCanvas.add(img);

      fabricCanvas.renderAll();
    }
  }

  async function drawCompanyLogoForPlacementPosts() {
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
  async function drawPlacementTemplateStuff() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;

      const circle = drawCircle({
        x: -270,
        y: -451,
        radius: 412,
        fill: "white",
        opacity: 1
      }, { selectable: false });

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

      const line = new Line([0, 160, 162, 160], {
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


  function clearFabricCanvas() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = "white";
      fabricCanvas.renderAll();
    }
  }

  useEffect(() => {
    clearFabricCanvas()
    return clearFabricCanvas();
  }, []);

  useEffect(() => {
    if (studentImageFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setStudentImageUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(studentImageFile);
    }
  }, [studentImageFile]);

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
      await drawPlacementTemplateStuff();
    }

    if (companyLogoFile) {
      await drawCompanyLogoForPlacementPosts();
    }

    if (studentImageFile) {
      if (mustRemoveBackground) {
        await removeBackgroundAndDraw();
      } else {
        await drawStudentPhotoForPlacementPosts();
      }
    }
  }

  function formClear() {
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = "";
    }
    if (companyLogoFileInputRef.current) {
      companyLogoFileInputRef.current.value = "";
    }
    if (studentImageFileInputRef.current) {
      studentImageFileInputRef.current.value = "";
    }

    setName("");
    setBranch("");
    setDate(new Date());
    setImageFile(undefined);
    setImageUrl("");
    setCompanyLogoFile(undefined);
    setCompanyLogoUrl("");

    clearFabricCanvas()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Placement Post Template</CardTitle>
          <CardDescription>
            Template for a social media post that congratulates a student for
            getting placed.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="background">Background Image</Label>
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
                      "w-full justify-start text-left font-normal",
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
                <PopoverContent className="w-auto p-0" align="center">
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
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="background">Student Image</Label>
              <Input
                ref={studentImageFileInputRef}
                id="background"
                type="file"
                accept="image/*"
                onChange={(e) => setStudentImageFile(e.target.files?.[0])}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="must-remove-bg"
                  checked={mustRemoveBackground}
                  onCheckedChange={(c) =>
                    setMustRemoveBackground(c === "indeterminate" ? false : c)
                  }
                />
                <label
                  htmlFor="must-remove-bg"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remove Background
                </label>
              </div>
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
    </>
  );
}
