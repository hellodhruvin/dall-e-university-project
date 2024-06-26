import { useEffect, useRef, useState } from "react";
import { Label } from "./components/ui/label";
import { Skeleton } from "./components/ui/skeleton";
import { Textarea } from "./components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
//import { saveAs } from "file-saver";

// TODO: Display these on front end above the prompt label
const SUGGESTIONS = {
  "Women's Day": [
    "Women of different ages under a banner that reads 'Happy Womens Day from GSFC Unversity' for Women's Day",
    "Diverse women from different profesions celebrating women's day, with a backdrop of university buildings.",
    "Female student holding a book with a GSFC University logo, surrounded by flowers and 'Happy Womens Day from GSFC University' text",
    "Modern college featuring influential women in history with central focus on 'Women's Day celebration at GSFC Unversity'",
    "Depiction of a Woman giving a lecture in a unversity, with the text 'Happy Women's Day from GSFC University'",
  ],
  "Orientation for firsty year students": [
    "Excited first-year under graduate students arriving at university campus for orientation, with 'Welcome to GSFC University' banners.",
    "Group of diverse freshers exploring university campus with 'Welcome to GSFC University' banner on a poster somewhere.",
    "Modern collage of orientation events such as campus tours, informative sessions, featuring enthusiastic first-year students.",
    "Bright and colorful image of students participating in orientation workshops with gsfc university staff and volunteers assisting them.",
    "Depiction of first year students attending a welcome speech in a large auditorium with banners and decorations highlighting 'GSFC University Orientation'",
  ],
  "Foundation day at GSFC University": [
    "Illustration of GSFC University campus with festive decorations, students & faculties celebrating 'Foundation Day'",
    "Depiction of a stage with a speaker, GSFC University logo in the backdrop, and a large audience of interested students in an auditorium.",
  ],
  "Independence/Republic Day": [
    "Illustration of students and faculty of GSFC University hoisting the indian flag with patriotic decorations in the background for Independence Day celebration.",
    "Digital art of a parade on GSFC University campus, featuring students in Indian traditional attire, with Tricolor from Indian flag being displayed prominently.",
    "Group of students performing cultural dances and songs to celebrate Indian Independence Day at GSFC University.",
    "Modern collage of Independence day activities at GSFC University, such as flag-hoisting ceremonies, patriotic speeches, cultural performances",
    "Bright and colorful image of students hoisting a giant indian flag on the university grounds, surrounded by tricolor decorations.",
    "Depiction of students and faculties celebrating Indian Republic Day at GSFC University.",
    "Illustration of students creating rangoli decorations featuring indian flag and other patriotic symbols for Independence day celebration at GSFC University",
    "Students at GSFC University participating in a Republic Day flag-hoisting ceremony with festive decorations.",
    "Republic day parade at GSFC University campus, featuring students dressed in traditional indian attire and holding indian flag.",
    "Depiction of students performing cultural dances and songs celebrating Republic Day with a GSFC University backdrop.",
    "Modern collage of Republic Day Events at GSFC University, including flag-hoisting, speeches, cultural performance that highlights indian heritage.",
  ],
  Ananta: [
    "Illustration of students participating in GSFC University technical event, 'Ananta', doing various technical workshops and competitions.",
    "Digital art of an auditorium stage with a speakers showcasing keynote adn tech demos at GSFC University technical event, 'Ananta'.",
    "Modern collage of GSFC University technical event 'Ananta', showcasing coding competitions, tech exhibitions, and enthusiastic participants.",
    "Depiction of students participating in a hackathon with laptops, code and brainstorming discussions under the banner of 'Ananta', the GSFC University technical event.",
  ],
};

function App() {
  //const [count, setCount] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [tip, setTip] = useState("Press 'Enter' key to submit.");

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const [fetching, setFetching] = useState(false);

  const [selectedSuggestionCtx, setSelectedSuggestionCtx] = useState<
    keyof typeof SUGGESTIONS | null
  >(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  async function saveAs(url: string, name: string) {
    const a = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a",
    ) as any;
    a.download = name;
    a.rel = "noopener";
    a.href = url;
    a.target = "_blank";

    setTimeout(() => URL.revokeObjectURL(a.href), 40 /* sec */ * 1000);
    setTimeout(() => a.click(), 0);
  }

  //async function saveAs(url: string, name: string) {
  //
  ////  Guess what? CORS!
  //    const res = await fetch(url);
  //
  //    const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as any;
  //    a.download = name
  //    a.rel = 'noopener'
  //    a.href = URL.createObjectURL(await res.blob())
  //
  //    setTimeout(() => URL.revokeObjectURL(a.href), 40 /* sec */ * 1000)
  //    setTimeout(() => a.click(), 0)
  //}

  async function downloadImage(url: string) {
    // For saving canvas use canvas#toBlob to save post-edit stuff.
    await saveAs(url, "art-please-rename.png");
    // Doesn't work cause bullshit browser apis can't download cross origin and blah blah
    // Can't idiots just right click and download image?
  }

  async function generateImages(prompt: string) {
    setImage1("");
    setImage2("");
    setImage3("");
    setImage4("");
    setFetching(true);

    const apiUrl = `http://127.0.0.1:8000/generate-image?prompt=${encodeURIComponent(prompt)}`;

    let res = await fetch(apiUrl);

    console.log({ res });

    if (!res.ok) {
      toast({
        title: "An error has occured. Please report this to developers.",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 break-normal whitespace-pre-wrap">
            <code className="text-white">{"API Call has failed"}</code>
          </pre>
        ),
      });
      setFetching(false);
      return;
    }

    let data = await res.json();
    setImage1(data.images[0].url);
    setImage2(data.images[1].url);
    setImage3(data.images[2].url);
    setImage4(data.images[3].url);

    setFetching(false);

    //console.log({ data })
  }

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        generateImages(prompt);
      }
    }

    // Since it's a function passed around it's not registering multiple times so will only get called once.
    textAreaRef.current?.addEventListener("keypress", handleKeyPress);

    return () => {
      textAreaRef.current?.removeEventListener("keypress", handleKeyPress);
    };
  }, [prompt]);

  return (
    <>
      <main className="h-screen">
        <div className="flex bg-primary w-full py-2 text-primary-foreground items-center justify-between">
          <img src="/gsfc-logo-white.png" className="h-12 w-auto" />
          <h1 className="text-lg font-bold">Social Media Image Generator</h1>
          {/*
              This is literally the same image here but it's invisible so that
              the text is properly centered. Hack but need to get things
              working quick.
          */}
          <img src="/gsfc-logo-white.png" className="h-12 w-auto invisible" />
        </div>

        <div className="flex h-full justify-center">
          <div className="flex flex-col space-y-4 pt-12">
            <div className="flex w-full space-x-2 justify-around">
              {image1 ? (
                <div className="flex flex-col space-y-1">
                  <img
                    alt="Loading Image 1"
                    src={image1}
                    className="h-[192px] w-[192px]"
                  />
                  <Button onClick={() => downloadImage(image1)}>
                    Download
                  </Button>
                </div>
              ) : (
                <Skeleton className="h-[192px] w-[192px]" />
              )}
              {image2 ? (
                <>
                  <div className="flex flex-col space-y-1">
                    <img
                      alt="Loading Image 2"
                      src={image2}
                      className="h-[192px] w-[192px]"
                    />
                    <Button onClick={() => downloadImage(image2)}>
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <Skeleton className="h-[192px] w-[192px]" />
              )}
              {image3 ? (
                <>
                  <div className="flex flex-col space-y-1">
                    <img
                      alt="Loading Image 3"
                      src={image3}
                      className="h-[192px] w-[192px]"
                    />
                    <Button onClick={() => downloadImage(image3)}>
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <Skeleton className="h-[192px] w-[192px]" />
              )}
              {image4 ? (
                <>
                  <div className="flex flex-col space-y-1">
                    <img
                      alt="Loading Image 4"
                      src={image4}
                      className="h-[192px] w-[192px]"
                    />
                    <Button onClick={() => downloadImage(image4)}>
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <Skeleton className="h-[192px] w-[192px]" />
              )}
            </div>
            <div>
              {!prompt && selectedSuggestionCtx && (
                <>
                  <ScrollArea className="h-48 w-full rounded-md border">
                    <div className="p-4">
                      <div className="flex mb-2">
                        <Button
                          variant="ghost"
                          className="pl-2"
                          onClick={() => setSelectedSuggestionCtx(null)}
                        >
                          <ChevronLeftIcon className="mr-2 h-4 w-4" />{" "}
                          <h4 className="text-sm font-medium ">
                            {selectedSuggestionCtx}
                          </h4>
                        </Button>
                      </div>
                      {SUGGESTIONS[selectedSuggestionCtx].map((s, idx) => (
                        <>
                          <div
                            key={s}
                            className="text-sm cursor-pointer"
                            onClick={() => {
                              setSelectedSuggestionCtx(null);
                              setPrompt(s);
                              setTip("You can now edit this prompt and press 'Enter' key when you want to submit!")
                            }}
                          >
                            {s}
                          </div>
                          {idx + 1 !==
                            SUGGESTIONS[selectedSuggestionCtx].length && (
                            <Separator className="my-2" />
                          )}
                        </>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
              {!prompt && !selectedSuggestionCtx && (
                <div className="flex space-x-2 w-full justify-around">
                  {Object.keys(SUGGESTIONS).map((k) => {
                    // Isn't typescript just amazing?
                    return (
                      <Button
                        onClick={() =>
                          setSelectedSuggestionCtx(
                            k as keyof typeof SUGGESTIONS,
                          )
                        }
                      >
                        {k}
                      </Button>
                    );
                  })}
                </div>
              )}
              <Label htmlFor="prompt">Prompt:</Label>
              <Textarea
                id="prompt"
                ref={textAreaRef}
                placeholder="Type your prompt here."
                maxLength={999}
                rows={9}
                disabled={fetching}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                value={prompt}
              />
              <p className="text-sm text-muted-foreground">
                Tip: {tip}
              </p>
            </div>
          </div>
        </div>
        <Toaster />
      </main>
    </>
  );
}

export default App;
