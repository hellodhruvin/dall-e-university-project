import { format } from "date-fns";
import * as fabric from "fabric";
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
  drawRectangle,
  drawScaledImageFromURL,
  drawSquare,
  drawSquareScaledImageFromURL,
  drawSvg,
  drawText,
  drawTextBox,
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

      const seminar_on_text = drawText(
        "Seminar on",
        {
          color: "white",
          fontSize: 30,
          italic: true,
          bold: false,
          underline: true,
          fontFamily: "Inter",
        },
        { selectable: false },
      );

      seminar_on_text.left = (512 - seminar_on_text.get("width")) / 2;
      seminar_on_text.top = 40;

      fabricCanvas.add(seminar_on_text);

      const topic_text = drawText(
        topic,
        {
          color: CONSTANTS.blue,
          fontSize: 32,
          italic: false,
          bold: true,
          underline: false,
          fontFamily: "Inter",
        },
        { selectable: false },
      );

      topic_text.left = (512 - topic_text.get("width")) / 2;
      topic_text.top = 90;

      function paddingRect(
        text: fabric.FabricText,
        color: string,
        { x, y, rx, ry }: { x: number; y: number; rx: number; ry: number },
      ) {
        const boundingRect = new fabric.Rect({
          left: text.left - x,
          top: text.top - y,
          width: text.getBoundingRect().width + 2 * x,
          height: text.getBoundingRect().height + 2 * y,
          fill: color,
          rx: rx,
          ry: ry,
          selectable: false,
          evented: false,
        });

        return boundingRect;
      }

      const backgroundRect = paddingRect(topic_text, CONSTANTS.orange, {
        x: 12,
        y: 4,
        rx: 4,
        ry: 4,
      });

      fabricCanvas.add(backgroundRect);
      fabricCanvas.add(topic_text);

      const rect = await drawRectangle(
        {
          x: 320,
          y: 425,
          height: 512 - 425,
          width: 512 - 320,
          fill: CONSTANTS.orange,
          opacity: 1,
        },
        { selectable: false },
      );

      fabricCanvas.add(rect);

      const dateText = drawText(
        `Date: ${format(date, "PPP")}`,
        {
          color: "black",
          fontSize: 14,
          italic: false,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      dateText.left = 320 + 35;
      dateText.top = 430 + 10;

      fabricCanvas.add(dateText);

      const calendarIcon = await drawSvg("/calendar-icon.svg", {
        selectable: false,
      });

      calendarIcon.top = 430 + 8;
      calendarIcon.left = 320 + 12;

      fabricCanvas.add(calendarIcon);

      const venueText = drawText(
        `Venue: ${venue}`,
        {
          color: "black",
          fontSize: 14,
          italic: false,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      venueText.left = 320 + 15;
      venueText.top = 430 + 50;

      fabricCanvas.add(venueText);

      const eventCoordText = drawText(
        "Event Coordinator:",
        {
          color: CONSTANTS.blue,
          fontSize: 14,
          italic: false,
          bold: true,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      eventCoordText.top = 430 + 10;
      eventCoordText.left = 25;

      const ev_rect = paddingRect(eventCoordText, "white", {
        x: 4,
        y: 4,
        rx: 0,
        ry: 0,
      });

      ev_rect.width = ev_rect.get("width") + 25;
      ev_rect.left = 0;

      fabricCanvas.add(ev_rect);
      fabricCanvas.add(eventCoordText);

      const topic1 = drawTextBox(
        `${firstTopic}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          bold: true,
          width: 170,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      topic1.top = 175;
      topic1.left = 0;

      fabricCanvas.add(topic1);

      const topic2 = drawTextBox(
        `${secondTopic}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          bold: true,
          underline: false,
          width: 170,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      topic2.top = 175;
      topic2.left = 170;

      fabricCanvas.add(topic2);

      const topic3 = drawTextBox(
        `${thirdTopic}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          width: 170,
          bold: true,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      topic3.top = 175;
      topic3.left = 342;

      fabricCanvas.add(topic3);

      const photo1 = await drawSquareScaledImageFromURL(firstPictureUrl, 100, {
        selectable: false,
      });

      const photo2 = await drawSquareScaledImageFromURL(secondPictureUrl, 100, {
        selectable: false,
      });

      const photo3 = await drawSquareScaledImageFromURL(thirdPictureUrl, 100, {
        selectable: false,
      });

      photo3.top = 240;
      photo3.left = 342 + 35;

      fabricCanvas.add(photo3);

      photo2.top = 240;
      photo2.left = 170 + 35;

      fabricCanvas.add(photo2);

      photo1.top = 240;
      photo1.left = 35;

      fabricCanvas.add(photo1);

      const name1 = drawTextBox(
        `${firstName}`,
        {
          color: CONSTANTS.orange,
          fontSize: 12,
          italic: false,
          bold: true,
          width: 170,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      name1.top = 355;
      name1.left = 0;

      fabricCanvas.add(name1);

      const name2 = drawTextBox(
        `${secondName}`,
        {
          color: CONSTANTS.orange,
          fontSize: 12,
          italic: false,
          bold: true,
          width: 170,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      name2.top = 355;
      name2.left = 170;

      fabricCanvas.add(name2);

      const name3 = drawTextBox(
        `${thirdName}`,
        {
          color: CONSTANTS.orange,
          fontSize: 12,
          italic: false,
          bold: true,
          width: 170,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      name3.top = 355;
      name3.left = 342;

      fabricCanvas.add(name3);

      const title1 = drawTextBox(
        `${firstTitle}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          bold: false,
          width: 170,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      title1.top = 370 + 10;
      title1.left = 0;

      fabricCanvas.add(title1);

      const title2 = drawTextBox(
        `${secondTitle}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          bold: false,
          width: 170,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      title2.top = 370 + 10;
      title2.left = 170;

      fabricCanvas.add(title2);

      const title3 = drawTextBox(
        `${thirdTitle}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          bold: false,
          width: 170,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      title3.top = 370 + 10;
      title3.left = 342;

      fabricCanvas.add(title3);

      const t1 = drawText(
        `${format(firstTimeFrom!, "p")} to ${format(firstTimeTo!, "p")}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          bold: true,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      t1.top = 215;
      t1.left = 15;

      fabricCanvas.add(t1);

      const t2 = drawText(
        `${format(secondTimeFrom!, "p")} to ${format(secondTimeTo!, "p")}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          bold: true,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      t2.top = 215;
      t2.left = 170 + 15;

      fabricCanvas.add(t2);

      const t3 = drawText(
        `${format(thirdTimeFrom!, "p")} to ${format(thirdTimeTo!, "p")}`,
        {
          color: "white",
          fontSize: 12,
          italic: false,
          bold: true,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      t3.top = 215;
      t3.left = 342 + 15;

      fabricCanvas.add(t3);

      const l1 = new Line([170, 240, 170, 400], {
        stroke: "white",
        strokeWidth: 1,
        selectable: false,
      });

      fabricCanvas.add(l1);

      const l2 = new Line([342, 240, 342, 400], {
        stroke: "white",
        strokeWidth: 1,
        selectable: false,
      });

      fabricCanvas.add(l2);

      // l1 t1 l2 t2
      const line = new Line(
        [
          ev_rect.get("width"),
          ev_rect.get("top") + ev_rect.get("height") / 2,
          ev_rect.get("width") + 75,
          ev_rect.get("top") + ev_rect.get("height") / 2,
        ],
        {
          stroke: "white",
          strokeWidth: 1,
          selectable: false,
        },
      );

      fabricCanvas.add(line);

      const eventCoordNameText = drawText(
        `${eventCoordinator}`,
        {
          color: "white",
          fontSize: 14,
          italic: false,
          bold: true,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      eventCoordNameText.top = 455 + 10;
      eventCoordNameText.left = 25;

      fabricCanvas.add(eventCoordNameText);

      const eventCoordTitleText = drawText(
        `${eventCoordinatorTitle}`,
        {
          color: "white",
          fontSize: 14,
          italic: false,
          bold: false,
          underline: false,
          fontFamily: "Open Sans",
        },
        { selectable: false },
      );

      eventCoordTitleText.top = 465 + 10 + 14;
      eventCoordTitleText.left = 25;

      fabricCanvas.add(eventCoordTitleText);

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
    clearFabricCanvas();
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
                      <SheetContent className="w-auto p-0">
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
