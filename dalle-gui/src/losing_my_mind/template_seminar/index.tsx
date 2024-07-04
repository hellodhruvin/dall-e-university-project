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
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
  debug_fabric_obj,
  drawCircle,
  drawScaledImageFromURL,
  drawSquare,
  drawSquareScaledImageFromURL,
  drawSvg,
  drawText,
} from "@/canvas/util";
import { CONSTANTS } from "@/ui/CONSTANTS";
import { Canvas, Line } from "fabric";
import { RefObject } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import GuestDetailsSheet from "./guest_sheet";

interface ITemplateSeminarProps {
  fabricCanvasRef: RefObject<Canvas>;
}

export function TemplateSeminar({ fabricCanvasRef }: ITemplateSeminarProps) {
  const backgroundImageFileInputRef = useRef<HTMLInputElement>(null);

  const [backgroundImage, setBackgroundImage] = useState<File | undefined>(
    undefined,
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");

  const [topic, setTopic] = useState<string>("");

  const [date, setDate] = useState<Date>(new Date());
  const [venue, setVenue] = useState<string>("");

  const [eventCoordinator, setEventCoordinator] = useState<string>("");
  const [eventCoordinatorTitle, setEventCoordinatorTitle] =
    useState<string>("");

  // I know first,second,third as prefixes isn't a good variable naming idea but like the folder suggests, I am losing my mind.
  const [firstTopic, setFirstTopic] = useState<string>("");
  // `${format(firstTime!, "p")}`
  const [firstTimeFrom, setFirstTimeFrom] = useState<Date>();
  const [firstTimeTo, setFirstTimeTo] = useState<Date>();
  const [firstName, setFirstName] = useState<string>("");

  const firstPictureImageFileRef = useRef<HTMLInputElement>(null);
  const [firstPictureImageFile, setFirstPictureImageFile] = useState<
    File | undefined
  >(undefined);
  const [firstPictureUrl, setFirstPictureUrl] = useState<string>("");
  const [firstTitle, setFirstTitle] = useState<string>("");
  const [firstUniversity, setFirstUniversity] = useState<string>("");
  const [firstCollege, setFirstCollege] = useState<string>("");

  const [secondTopic, setSecondTopic] = useState<string>("");

  const [secondTimeFrom, setSecondTimeFrom] = useState<Date>();
  const [secondTimeTo, setSecondTimeTo] = useState<Date>();
  const [secondName, setSecondName] = useState<string>("");

  const secondPictureImageFileRef = useRef<HTMLInputElement>(null);
  const [secondPictureImageFile, setSecondPictureImageFile] = useState<
    File | undefined
  >(undefined);
  const [secondPictureUrl, setSecondPictureUrl] = useState<string>("");
  const [secondTitle, setSecondTitle] = useState<string>("");
  const [secondUniversity, setSecondUniversity] = useState<string>("");
  const [secondCollege, setSecondCollege] = useState<string>("");

  const [thirdTopic, setThirdTopic] = useState<string>("");

  const [thirdTimeFrom, setThirdTimeFrom] = useState<Date>();
  const [thirdTimeTo, setThirdTimeTo] = useState<Date>();
  const [thirdName, setThirdName] = useState<string>("");

  const thirdPictureImageFileRef = useRef<HTMLInputElement>(null);
  const [thirdPictureImageFile, setThirdPictureImageFile] = useState<
    File | undefined
  >(undefined);
  const [thirdPictureUrl, setThirdPictureUrl] = useState<string>("");
  const [thirdTitle, setThirdTitle] = useState<string>("");
  const [thirdUniversity, setThirdUniversity] = useState<string>("");
  const [thirdCollege, setThirdCollege] = useState<string>("");

  async function drawBackground() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;

      fabricCanvas.clear();

      const img = await drawSquareScaledImageFromURL(backgroundImageUrl, 512, {
        selectable: false,
      });

      fabricCanvas.backgroundImage = img;

      const sq = await drawSquare(
        {
          x: 0,
          y: 0,
          size: 512,
          fill: CONSTANTS.blue,
          opacity: 0.85,
        },
        { selectable: false },
      );

      fabricCanvas.add(sq);

      fabricCanvas.renderAll();
    }
  }

  // Make this more readable, use currying, make the functions take parameters for a lot of manually adjusted stuff.
  async function drawSeminarTemplateStuff() {
    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;

      const logo = await drawScaledImageFromURL(
        "/gsfc-logo-white.png",
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

      //const nameText = drawText(
      //  topic,
      //  {
      //    color: CONSTANTS.orange_alt,
      //    fontSize: 38,
      //    italic: true,
      //    bold: true,
      //    underline: false,
      //    fontFamily: "Inter",
      //  },
      //  { selectable: false },
      //);
      //
      //nameText.left = 15;
      //nameText.top = 113;
      //
      //const line = new Line([0, 160, 162, 160], {
      //  stroke: CONSTANTS.orange_alt,
      //  strokeWidth: 2,
      //  selectable: false,
      //});
      //
      //fabricCanvas.add(line);
      //
      //fabricCanvas.add(nameText);
      //
      //const calendarIcon = await drawSvg("/calendar-icon.svg", {
      //  selectable: false,
      //});
      //
      //calendarIcon.top = 214;
      //calendarIcon.left = 16;
      //calendarIcon.selectable = false;
      //
      //fabricCanvas.add(calendarIcon);
      //
      //const dateText = drawText(
      //  `Batch ${format(date, "yyyy")}`,
      //  {
      //    color: "black",
      //    fontSize: 20,
      //    italic: false,
      //    underline: false,
      //    fontFamily: "Open Sans",
      //  },
      //  { selectable: false },
      //);
      //
      //dateText.left = 37;
      //dateText.top = 214;
      //
      //fabricCanvas.add(dateText);
      //
      //const placedAtText = drawText(
      //  "Placed at",
      //  {
      //    color: "black",
      //    fontSize: 28,
      //    italic: false,
      //    underline: false,
      //    fontFamily: "Open Sans",
      //  },
      //  { selectable: false },
      //);
      //
      //placedAtText.left = 13;
      //placedAtText.top = 247;
      //
      //fabricCanvas.add(placedAtText);
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
    if (backgroundImage) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setBackgroundImageUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(backgroundImage);
    }
  }, [backgroundImage]);

  useEffect(() => {
    if (firstPictureImageFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setFirstPictureUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(firstPictureImageFile);
    }
  }, [firstPictureImageFile]);

  useEffect(() => {
    if (secondPictureImageFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setSecondPictureUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(secondPictureImageFile);
    }
  }, [secondPictureImageFile]);

  useEffect(() => {
    if (thirdPictureImageFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setThirdPictureUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(thirdPictureImageFile);
    }
  }, [thirdPictureImageFile]);

  // Extract the fabric part and use existing states to load image and name this formGo
  async function formGo() {
    // TOOD: Remove if later when validation is added
    if (backgroundImage) {
      await drawBackground();
      await drawSeminarTemplateStuff();
    }
  }

  const clearFirstGuestDetails = () => {
    if (firstPictureImageFileRef.current) {
      firstPictureImageFileRef.current.value = "";
    }

    setFirstTopic("");
    setFirstTimeFrom(undefined);
    setFirstTimeTo(undefined);
    setFirstName("");
    setFirstPictureImageFile(undefined);
    setFirstPictureUrl("");
    setFirstTitle("");
    setFirstUniversity("");
    setFirstCollege("");
  };

  const clearSecondGuestDetails = () => {
    if (secondPictureImageFileRef.current) {
      secondPictureImageFileRef.current.value = "";
    }

    setSecondTopic("");
    setSecondTimeFrom(undefined);
    setSecondTimeTo(undefined);
    setSecondName("");
    setSecondPictureImageFile(undefined);
    setSecondPictureUrl("");
    setSecondTitle("");
    setSecondUniversity("");
    setSecondCollege("");
  };

  const clearThirdGuestDetails = () => {
    if (thirdPictureImageFileRef.current) {
      thirdPictureImageFileRef.current.value = "";
    }

    setThirdTopic("");
    setThirdTimeFrom(undefined);
    setThirdTimeTo(undefined);
    setThirdName("");
    setThirdPictureImageFile(undefined);
    setThirdPictureUrl("");
    setThirdTitle("");
    setThirdUniversity("");
    setThirdCollege("");
  };

  const clearSeminarDetails = () => {
    if (backgroundImageFileInputRef.current) {
      backgroundImageFileInputRef.current.value = "";
    }

    setTopic("");
    setDate(new Date());
    setVenue("");
    setBackgroundImage(undefined);
    setBackgroundImageUrl("");

    setEventCoordinator("");
    setEventCoordinatorTitle("");
  };

  function formClear() {
    clearSeminarDetails();
    clearFirstGuestDetails();
    clearSecondGuestDetails();
    clearThirdGuestDetails();

    if (fabricCanvasRef.current) {
      const fabricCanvas = fabricCanvasRef.current;
      fabricCanvas.clear();

      fabricCanvas.backgroundColor = "white";
      fabricCanvas.renderAll();
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Seminar Announcement Post</CardTitle>
          <CardDescription>
            Template for a social media post that announces an upcoming seminar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid w-full items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Fill Seminar Details</Button>
              </SheetTrigger>
              <SheetContent className="w-full">
                <div className="grid gap-4">
                  <SheetHeader>
                    <SheetTitle>Edit Seminar Details</SheetTitle>
                    <SheetDescription>
                      Set the details for seminar
                    </SheetDescription>
                  </SheetHeader>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="background">Background Image</Label>
                    <Input
                      ref={backgroundImageFileInputRef}
                      id="background"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBackgroundImage(e.target.files?.[0])}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Topic of Seminar"
                      onChange={(e) => setTopic(e.target.value)}
                      value={topic}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="date">Date of Seminar</Label>
                    <Sheet>
                      <SheetTrigger asChild>
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
                      </SheetTrigger>
                      <SheetContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(day) => setDate(day ?? new Date())}
                          initialFocus
                        />
                      </SheetContent>
                    </Sheet>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      placeholder="Venue"
                      onChange={(e) => setVenue(e.target.value)}
                      value={venue}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="event-coord">Event Coordinator</Label>
                    <Input
                      id="event-coord"
                      placeholder="Event Coordinator"
                      onChange={(e) => setEventCoordinator(e.target.value)}
                      value={eventCoordinator}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="event-coord-title">
                      Event Coordinator Title
                    </Label>
                    <Input
                      id="event-coord-title"
                      placeholder="Event Coordinator Title"
                      onChange={(e) => setEventCoordinatorTitle(e.target.value)}
                      value={eventCoordinatorTitle}
                    />
                  </div>
                </div>

                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="mt-4">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <GuestDetailsSheet
              guestNumber={1}
              name={firstName}
              setName={setFirstName}
              title={firstTitle}
              setTitle={setFirstTitle}
              university={firstUniversity}
              setUniversity={setFirstUniversity}
              college={firstCollege}
              setCollege={setFirstCollege}
              topic={firstTopic}
              setTopic={setFirstTopic}
              timeFrom={firstTimeFrom}
              setTimeFrom={setFirstTimeFrom}
              timeTo={firstTimeTo}
              setTimeTo={setFirstTimeTo}
              pictureImageFileRef={firstPictureImageFileRef}
              setPictureImageFile={setFirstPictureImageFile}
            />

            {/* Second Guest */}
            <GuestDetailsSheet
              guestNumber={2}
              name={secondName}
              setName={setSecondName}
              title={secondTitle}
              setTitle={setSecondTitle}
              university={secondUniversity}
              setUniversity={setSecondUniversity}
              college={secondCollege}
              setCollege={setSecondCollege}
              topic={secondTopic}
              setTopic={setSecondTopic}
              timeFrom={secondTimeFrom}
              setTimeFrom={setSecondTimeFrom}
              timeTo={secondTimeTo}
              setTimeTo={setSecondTimeTo}
              pictureImageFileRef={secondPictureImageFileRef}
              setPictureImageFile={setSecondPictureImageFile}
            />

            {/* Third Guest */}
            <GuestDetailsSheet
              guestNumber={3}
              name={thirdName}
              setName={setThirdName}
              title={thirdTitle}
              setTitle={setThirdTitle}
              university={thirdUniversity}
              setUniversity={setThirdUniversity}
              college={thirdCollege}
              setCollege={setThirdCollege}
              topic={thirdTopic}
              setTopic={setThirdTopic}
              timeFrom={thirdTimeFrom}
              setTimeFrom={setThirdTimeFrom}
              timeTo={thirdTimeTo}
              setTimeTo={setThirdTimeTo}
              pictureImageFileRef={thirdPictureImageFileRef}
              setPictureImageFile={setThirdPictureImageFile}
            />
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
