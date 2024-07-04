import { Toaster } from "@/components/ui/toaster";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <main className="h-screen">
        <div className="flex bg-primary w-full py-2 text-primary-foreground items-center justify-between">
          {/*
            Just made it so that clicking either the name or logo both goes
            to home page, if need only image then uncomment the div and remove
            className from Link and enclose only the image in Link with the h1
            immedieately after
          */}
          {/*<div className="flex space-x-8 items-center first:pl-4">*/}
          <Link to="/" className="flex space-x-8 items-center first:pl-4">
            <img src="/gsfc-logo-white.png" className="h-12 w-auto" />
            <h1 className="text-xl font-bold">Social Media Image Generator</h1>
          </Link>
          {/*</div>*/}
          {/*
            This is literally the same image here but it's invisible so that
            the text is properly centered. Hack but need to get things
            working quick.

            Hack may no longer be needed.
          */}
          {/*<img src="/gsfc-logo-white.png" className="h-12 w-auto invisible" />*/}
          <div className="flex space-x-8 items-center last:pr-8">
            <Link
              to="/generate"
              className="[&.active]:font-bold [&.active]:underline"
            >
              Generate
            </Link>
            <Link
              to="/editor"
              className="[&.active]:font-bold [&.active]:underline"
            >
              Editor
            </Link>
          </div>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />

        <Toaster />
      </main>
    </>
  ),
});
