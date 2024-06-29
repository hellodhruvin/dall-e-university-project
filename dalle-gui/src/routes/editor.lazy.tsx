import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/editor')({
  component: Editor,
})

function Editor() {
  return <div className="p-2">Hello from Editor!</div>
}
