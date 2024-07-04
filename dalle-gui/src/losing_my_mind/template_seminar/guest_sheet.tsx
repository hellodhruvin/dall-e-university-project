import { Dispatch, SetStateAction } from 'react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TimePicker12h } from "@/components/ui/third-party-time-picker/time-picker";
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

interface GuestDetailsSheetProps {
  guestNumber: number;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  university: string;
  setUniversity: Dispatch<SetStateAction<string>>;
  college: string;
  setCollege: Dispatch<SetStateAction<string>>;
  topic: string;
  setTopic: Dispatch<SetStateAction<string>>;
  timeFrom: Date | undefined;
  setTimeFrom: Dispatch<SetStateAction<Date | undefined>>;
  timeTo: Date | undefined;
  setTimeTo: Dispatch<SetStateAction<Date | undefined>>;
  pictureImageFileRef: React.RefObject<HTMLInputElement>;
  setPictureImageFile: Dispatch<SetStateAction<File | undefined>>;
}

const GuestDetailsSheet = ({
  guestNumber,
  name,
  setName,
  title,
  setTitle,
  university,
  setUniversity,
  college,
  setCollege,
  topic,
  setTopic,
  timeFrom,
  setTimeFrom,
  timeTo,
  setTimeTo,
  pictureImageFileRef,
  setPictureImageFile,
}: GuestDetailsSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Fill Guest {guestNumber} Details</Button>
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle>Edit Guest {guestNumber}</SheetTitle>
          <SheetDescription>
            Set the details for guest {guestNumber}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`guest-${guestNumber}-name`}>Name</Label>
            <Input
              id={`guest-${guestNumber}-name`}
              placeholder="Guest Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`guest-${guestNumber}-title`}>Title</Label>
            <Input
              id={`guest-${guestNumber}-title`}
              placeholder="Guest Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`guest-${guestNumber}-university`}>
              University
            </Label>
            <Input
              id={`guest-${guestNumber}-university`}
              placeholder="Guest University"
              onChange={(e) => setUniversity(e.target.value)}
              value={university}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`guest-${guestNumber}-college`}>College</Label>
            <Input
              id={`guest-${guestNumber}-college`}
              placeholder="Guest College"
              onChange={(e) => setCollege(e.target.value)}
              value={college}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`guest-${guestNumber}-topic`}>Topic</Label>
            <Input
              id={`guest-${guestNumber}-topic`}
              placeholder="Topic"
              onChange={(e) => setTopic(e.target.value)}
              value={topic}
            />
          </div>

          <div className="flex flex-col">
            <Label>From</Label>
            <div className="flex flex-col space-y-1.5">
              <TimePicker12h date={timeFrom} setDate={setTimeFrom} />
            </div>
          </div>

          <div className="flex flex-col">
            <Label>To</Label>
            <div className="flex flex-col space-y-1.5">
              <TimePicker12h date={timeTo} setDate={setTimeTo} />
            </div>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={`guest-${guestNumber}-picture`}>Photo</Label>
            <Input
              ref={pictureImageFileRef}
              id={`guest-${guestNumber}-picture`}
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPictureImageFile(e.target.files?.[0])
              }
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
  );
};

export default GuestDetailsSheet;
