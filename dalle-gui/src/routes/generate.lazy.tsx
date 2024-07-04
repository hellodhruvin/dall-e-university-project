import { Dispatch, useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import SUGGESTIONS from "../../public/suggestions.json";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createLazyFileRoute("/generate")({
  component: Generate,
});

// There is one key error that happens in console when we click on any of the
// suggestions, but we know the react compiler is so amazing it told us exactly
// where it is.
function Generate() {
  const [prompt, setPrompt] = useState("");
  const [tip, setTip] = useState("Press 'Enter' key to submit.");

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  function clearImages() {
    setImage1("");
    setImage2("");
    setImage3("");
    setImage4("");
  }

  const [wantVariation, setWantVariation] = useState<boolean>(false);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const [fetching, setFetching] = useState(false);

  const [selectedSuggestionCtx, setSelectedSuggestionCtx] = useState<
    keyof typeof SUGGESTIONS | null
  >(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  async function saveAs(url: string, name: string) {
    // Above doesn't work btw it's just here for legacy.
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

  async function generateVariations(file: File) {
    clearImages();
    setFetching(true);

    const apiUrl = `http://127.0.0.1:8000/variations`;

    try {
      const formData = new FormData();
      formData.append("image", file);

      let res = await fetch(apiUrl, {
        body: formData,
        method: "POST",
      });

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
    } catch (e: any) {
      toast({
        title:
          "API Call failed because an error has occured. Please report this to developers.",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 break-normal whitespace-pre-wrap">
            <code className="text-white">{e.toString()}</code>
          </pre>
        ),
      });
      console.error(e);
      setFetching(false);
      return;
    }

    //console.log({ data })
  }

  async function generateVariation(file: File, setter: Dispatch<string>) {
    setter("");
    setFetching(true);

    const apiUrl = `http://127.0.0.1:8000/variation`;

    try {
      const formData = new FormData();
      formData.append("image", file);

      let res = await fetch(apiUrl, {
        body: formData,
        method: "POST",
      });

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
      setter(data.images[0].url);

      setFetching(false);
    } catch (e: any) {
      toast({
        title:
          "API Call failed because an error has occured. Please report this to developers.",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 break-normal whitespace-pre-wrap">
            <code className="text-white">{e.toString()}</code>
          </pre>
        ),
      });
      console.error(e);
      setFetching(false);
      return;
    }

    //console.log({ data })
  }

  async function generateImage(prompt: string, setter: Dispatch<string>) {
    setter("");
    setFetching(true);

    const apiUrl = `http://127.0.0.1:8000/generate-image?prompt=${encodeURIComponent(prompt)}`;

    try {
      let res = await fetch(apiUrl);

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
      setter(data.images[0].url);

      setFetching(false);
    } catch (e: any) {
      toast({
        title:
          "API Call failed because an error has occured. Please report this to developers.",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 break-normal whitespace-pre-wrap">
            <code className="text-white">{e.toString()}</code>
          </pre>
        ),
      });
      setFetching(false);
      console.error(e);
      return;
    }

    //console.log({ data })
  }

  async function generateImages(prompt: string) {
    clearImages();
    setFetching(true);

    const apiUrl = `http://127.0.0.1:8000/generate-images?prompt=${encodeURIComponent(prompt)}`;

    try {
      let res = await fetch(apiUrl);

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
    } catch (e: any) {
      toast({
        title:
          "API Call failed because an error has occured. Please report this to developers.",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 break-normal whitespace-pre-wrap">
            <code className="text-white">{e.toString()}</code>
          </pre>
        ),
      });
      setFetching(false);
      console.error(e);
      return;
    }

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
                <div className="flex justify-between items-center w-full space-x-2">
                  <Button
                    onClick={() => downloadImage(image1)}
                    className="w-full"
                  >
                    Open
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      wantVariation
                        ? imageFile && generateVariation(imageFile, setImage1)
                        : generateImage(prompt, setImage1);
                    }}
                  >
                    Refresh
                  </Button>
                </div>
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
                  <div className="flex justify-between items-center w-full space-x-2">
                    <Button
                      onClick={() => downloadImage(image2)}
                      className="w-full"
                    >
                      Open
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        wantVariation
                          ? imageFile && generateVariation(imageFile, setImage2)
                          : generateImage(prompt, setImage2);
                      }}
                    >
                      Refresh
                    </Button>
                  </div>
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
                  <div className="flex justify-between items-center w-full space-x-2">
                    <Button
                      onClick={() => downloadImage(image3)}
                      className="w-full"
                    >
                      Open
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        wantVariation
                          ? imageFile && generateVariation(imageFile, setImage3)
                          : generateImage(prompt, setImage3);
                      }}
                    >
                      Refresh
                    </Button>
                  </div>
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
                  <div className="flex justify-between items-center w-full space-x-2">
                    <Button
                      onClick={() => downloadImage(image4)}
                      className="w-full"
                    >
                      Open
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        wantVariation
                          ? imageFile && generateVariation(imageFile, setImage4)
                          : generateImage(prompt, setImage4);
                      }}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Skeleton className="h-[192px] w-[192px]" />
            )}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {wantVariation ? "Variate an image" : "Generate Images"}
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center space-x-2 text-primary">
                    <Label htmlFor="want-variation">Generate</Label>
                    <Switch
                      id="want-variation"
                      disabled={fetching}
                      checked={wantVariation}
                      onCheckedChange={(c) => {
                        clearImages();

                        setWantVariation(c);
                      }}
                    />
                    <Label htmlFor="want-variation">Variate</Label>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wantVariation && (
                  <>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="background">Image</Label>
                      <div className="flex space-x-2 justify-center items-center">
                        <Input
                          ref={imageFileInputRef}
                          id="image"
                          type="file"
                          accept="image/png"
                          disabled={fetching}
                          onChange={(e) => setImageFile(e.target.files?.[0])}
                          className="file:bg-primary file:text-primary-foreground
                      file:shadow hover:file:bg-primary/90 file:h-9 file:px-4
                      file:py-2 inline-flex items-center justify-center
                      whitespace-nowrap file:rounded-md file:text-sm
                      file:font-medium file:transition-colors
                      file:focus-visible:outline-none file:focus-visible:ring-1
                      file:focus-visible:ring-ring h-12 cursor-pointer"
                        />
                        <Button
                          onClick={() =>
                            imageFile && generateVariations(imageFile)
                          }
                          className="h-full"
                          disabled={!imageFile || fetching}
                        >
                          Go
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {!prompt && selectedSuggestionCtx && !wantVariation && (
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
                              key={idx}
                              className="text-sm cursor-pointer"
                              onClick={() => {
                                setSelectedSuggestionCtx(null);
                                setPrompt(s);
                                setTip(
                                  "You can now edit this prompt and press 'Enter' key when you want to submit!",
                                );
                              }}
                            >
                              {s}
                            </div>
                            {idx + 1 !==
                              SUGGESTIONS[selectedSuggestionCtx].length && (
                              <Separator
                                key={
                                  // Just to satisfy uniqueness. Amazing react, I know.
                                  idx +
                                  SUGGESTIONS[selectedSuggestionCtx].length
                                }
                                className="my-2"
                              />
                            )}
                          </>
                        ))}
                      </div>
                    </ScrollArea>
                  </>
                )}
                {!prompt && !selectedSuggestionCtx && !wantVariation && (
                  <div className="flex space-x-2 w-full justify-around">
                    {Object.keys(SUGGESTIONS).map((k, idx) => {
                      return (
                        <Button
                          key={idx}
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
                {!wantVariation && (
                  <>
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
                    <p className="text-sm text-muted-foreground">Tip: {tip}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
