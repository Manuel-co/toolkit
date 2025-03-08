import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ImageIcon,
  Paintbrush,
  FileImage,
  Crop,
  Palette,
  FileText,
  QrCode,
  Layers,
  ArrowRight,
  Zap,
  Cloud,
  Download,
} from "lucide-react"

interface Tool {
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  slug: string
  badge?: string
}

interface Feature {
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface FAQ {
  question: string
  answer: string
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-xl font-bold">ToolKit</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#tools" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Tools
            </Link>
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Features
            </Link>
            <Link href="#faq" className="text-sm font-medium transition-colors hover:text-foreground/80">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/tools">
              <Button>All Tools</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Powerful Tools for Creative Professionals
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline your workflow with our suite of powerful online tools. Remove backgrounds, convert images
                    to favicons, and more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/tools">
                    <Button size="lg">
                      Try for Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px]">
                  <div className="absolute inset-0  " />
                  <Image
                    src="/hero.png"
                    alt="Hero Image"
                    fill
                    className=""
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tools" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Tools</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  A comprehensive suite of tools designed to enhance your productivity and creativity.
                </p>
              </div>
            </div>
            <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
              {tools.map((tool) => (
                <Card key={tool.name} className="overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className="pb-0">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={`/placeholder.svg?height=180&width=320&text=${encodeURIComponent(tool.name)}`}
                        alt={tool.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    {tool.badge && (
                      <Badge className="absolute top-4 right-4" variant="secondary">
                        {tool.badge}
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline" className="text-xs">
                      Free • No Login
                    </Badge>
                    <Link href={`/tools/${tool.slug}`}>
                      <Button size="sm">
                        Try Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/tools">
                <Button size="lg">
                  View All Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our platform is designed with your workflow in mind, offering features that save time and enhance
                  productivity.
                </p>
              </div>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-8 mt-8">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.name}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Find answers to common questions about our tools and services.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 mt-8">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  All tools are completely free to use with no login required.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/tools">
                  <Button size="lg">
                    Try Our Tools Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-xl font-bold">ToolKit</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} ToolKit. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const tools: Tool[] = [
  // {
  //   name: "Background Remover",
  //   description: "Remove backgrounds from images with a single click",
  //   icon: Paintbrush,
  //   badge: "Popular",
  //   slug: "background-remover",
  // },
  // {
  //   name: "Image to Favicon",
  //   description: "Convert any image to a favicon for your website",
  //   icon: FileImage,
  //   slug: "image-to-favicon",
  // },
  {
    name: "Image Cropper",
    description: "Crop and resize images to your desired dimensions",
    icon: Crop,
    slug: "image-cropper",
  },
  {
    name: "Color Extractor",
    description: "Extract color palettes from any image",
    icon: Palette,
    slug: "color-extractor",
  },
  // {
  //   name: "Image Compressor",
  //   description: "Compress images without losing quality",
  //   icon: ImageIcon,
  //   badge: "New",
  //   slug: "image-compressor",
  // },
  // {
  //   name: "Text Extractor",
  //   description: "Extract text from images using OCR technology",
  //   icon: FileText,
  //   slug: "text-extractor",
  // },
  {
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, and more",
    icon: QrCode,
    slug: "qr-code-generator",
  },
  {
    name: "Image Converter",
    description: "Convert images between different formats",
    icon: Layers,
    slug: "image-converter",
  },
]

const features: Feature[] = [
  {
    name: "Fast Processing",
    description: "All tools are optimized for speed and efficiency",
    icon: Zap,
  },
  {
    name: "Batch Processing",
    description: "Process multiple files at once to save time",
    icon: Layers,
  },
  {
    name: "No Downloads",
    description: "All tools run in your browser, no software to install",
    icon: Download,
  },
]

const faqs: FAQ[] = [
  // {
  //   question: "How does the background remover work?",
  //   answer:
  //     "Our background remover uses advanced AI to detect and remove backgrounds from images automatically. Simply upload your image and our tool will do the rest.",
  // },
  {
    question: "Can I use these tools for commercial projects?",
    answer:
      "Yes, all our tools can be used for both personal and commercial projects.",
  },
  {
    question: "Is there a limit to how many files I can process?",
    answer:
      "All tools are free to use with no processing limits.",
  },
  // {
  //   question: "Are my files stored on your servers?",
  //   answer:
  //     "We do not permanently store your files. They are processed in real-time and then deleted from our servers.",
  // },
]

