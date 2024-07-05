import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <main className="flex justify-center items-center">
        <div className="flex flex-col">
          <div className="py-16">
            <h1 className="text-4xl text-center font-black">
              Unleash Imagination with DALL&ndash;E: Transforming Words into
              Stunning Visuals
            </h1>
          </div>

          <div>
            <img src="hero-image-home.png" alt="display-image" />
          </div>

          <div className="flex justify-center items-center pt-8">
            <Link to="/generate">
              <Button className="h-18 px-8 py-4 text-2xl rounded-full">
                {" "}
                Start Generating{" "}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
