import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex gap-x-4">
        <Button size="icon">
          <PlusIcon />
        </Button>
        <Button size="sm">Button Primary</Button>
        <Button>Button Primary</Button>
        <Button size="lg">Button Primary</Button>
        <Button size="xl">Button Primary</Button>
      </div>
      <div className="flex gap-x-4">
        <Button variant="secondary" size="icon">
          <PlusIcon />
        </Button>
        <Button variant="secondary" size="sm">
          Button Primary
        </Button>
        <Button variant="secondary">Button Primary</Button>
        <Button variant="secondary" size="lg">
          Button Primary
        </Button>
        <Button variant="secondary" size="xl">
          Button Primary
        </Button>
      </div>
      <div className="flex gap-x-4">
        <Button variant="destructive" size="icon">
          <PlusIcon />
        </Button>
        <Button variant="destructive" size="sm">
          Button Primary
        </Button>
        <Button variant="destructive">Button Primary</Button>
        <Button variant="destructive" size="lg">
          Button Primary
        </Button>
        <Button variant="destructive" size="xl">
          Button Primary
        </Button>
      </div>
      <div className="flex gap-x-4">
        <Button variant="outline" size="icon">
          <PlusIcon />
        </Button>
        <Button variant="outline" size="sm">
          Button Primary
        </Button>
        <Button variant="outline">Button Primary</Button>
        <Button variant="outline" size="lg">
          Button Primary
        </Button>
        <Button variant="outline" size="xl">
          Button Primary
        </Button>
      </div>
      <div className="flex gap-x-4">
        <Button variant="link" size="icon">
          <PlusIcon />
        </Button>
        <Button variant="link" size="sm">
          Button Primary
        </Button>
        <Button variant="link">Button Primary</Button>
        <Button variant="link" size="lg">
          Button Primary
        </Button>
        <Button variant="link" size="xl">
          Button Primary
        </Button>
      </div>
    </div>
  )
}
