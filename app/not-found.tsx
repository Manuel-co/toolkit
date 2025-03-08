import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-6">
      <div className="space-y-2">
        <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
        </p>
      </div>

      <div className="space-y-2">
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Error 404
        </p>
      </div>
    </div>
  )
} 