  "use client"

  import { useEffect, useRef } from "react"
  import Link from "next/link"
  import Image from "next/image"
  import gsap from "gsap"
  import { ScrollTrigger } from "gsap/ScrollTrigger"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { ThemeToggle } from "@/components/theme-toggle"
  import {
    Paintbrush,
    Crop,
    Palette,
    FileText,
    QrCode,
    Layers,
    ArrowRight,
    Zap,
    Cloud,
    Download,
    Shield,
    Sparkles,
    Code,
    Lightbulb,
  } from "lucide-react"

  gsap.registerPlugin(ScrollTrigger)

  interface Tool {
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    slug: string
    badge?: string
    category: string
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
    const heroRef = useRef<HTMLElement>(null)
    const statsRef = useRef<HTMLElement>(null)
    const toolsRef = useRef<HTMLElement>(null)
    const featuresRef = useRef<HTMLElement>(null)
    const faqRef = useRef<HTMLElement>(null)
    const ctaRef = useRef<HTMLElement>(null)

    useEffect(() => {
      // Hero animations
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('.hero-content > *'), {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        })
      }

      // Stats animation
      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll('.stat-item'), {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
        })
      }

      // Tools animation
      if (toolsRef.current) {
        gsap.from(toolsRef.current.querySelectorAll('.tool-card'), {
          scrollTrigger: {
            trigger: toolsRef.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
        })
      }

      // Features animation
      if (featuresRef.current) {
        gsap.from(featuresRef.current.querySelectorAll('.feature-card'), {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          },
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          stagger: 0.1,
        })
      }

      // FAQ animation
      if (faqRef.current) {
        gsap.from(faqRef.current.querySelectorAll('.faq-item'), {
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 80%",
          },
          opacity: 0,
          x: -20,
          duration: 0.6,
          stagger: 0.1,
        })
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current.querySelectorAll('.cta-content > *'), {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.15,
        })
      }
    }, [])

    return (
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ToolKit</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="#tools" className="text-sm font-medium transition-colors hover:text-primary">
                Tools
              </Link>
              <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/tools">
                <Button size="lg">
                  Browse Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          {/* Hero Section */}
          <section 
            ref={heroRef}
            className="relative w-full py-12 md:py-24 lg:py-32 xl:py-40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
            
            <div className="container relative px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="hero-content flex flex-col justify-center space-y-6">
                  <Badge className="w-fit" variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Free Forever • No Login Required
                  </Badge>
                  
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                      Powerful Tools for
                      <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Creative Professionals</span>
                    </h1>
                    <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                      Streamline your workflow with our suite of powerful online tools. Remove backgrounds, generate ideas,
                      manage code snippets, and more—all in your browser.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 min-[400px]:flex-row">
                    <Link href="/tools">
                      <Button size="lg" className="h-12 px-8 text-base">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="#features">
                      <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-muted-foreground">100% Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm text-muted-foreground">Lightning Fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-muted-foreground">Cloud Powered</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl" />
                    <Image
                      src="/hero.png"
                      alt="ToolKit Hero"
                      fill
                      className="relative object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section 
            ref={statsRef}
            className="w-full py-12 border-y bg-muted/50"
          >
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="stat-item text-center">
                  <div className="text-4xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground mt-1">Tools Available</div>
                </div>
                <div className="stat-item text-center">
                  <div className="text-4xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Free Forever</div>
                </div>
                <div className="stat-item text-center">
                  <div className="text-4xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground mt-1">Login Required</div>
                </div>
                <div className="stat-item text-center">
                  <div className="text-4xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground mt-1">Usage Limit</div>
                </div>
              </div>
            </div>
          </section>

          {/* Tools Section */}
          <section 
            id="tools"
            ref={toolsRef}
            className="w-full py-12 md:py-24 lg:py-32"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <Badge variant="outline">
                  Popular Tools
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need in One Place
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  A comprehensive suite of tools designed to enhance your productivity and creativity.
                </p>
              </div>
              
              <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map((tool) => (
                  <Card key={tool.name} className="tool-card group relative overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary/50 h-full">
                    <CardHeader className="pb-4">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-transform group-hover:scale-110">
                        <tool.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          {tool.badge && (
                            <Badge className="shrink-0 text-xs" variant={tool.badge === "New" ? "default" : "secondary"}>
                              {tool.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm">{tool.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-3 pt-4 border-t">
                      <div className="flex w-full items-center justify-between">
                        <Badge variant="outline" className="text-xs font-normal">
                          {tool.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-normal text-green-600 dark:text-green-400">
                          Free
                        </Badge>
                      </div>
                      <Link href={`/tools/${tool.slug}`} className="w-full">
                        <Button size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                          Try Now
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-center mt-12">
                <Link href="/tools">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    View All {tools.length} Tools
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section 
            id="features"
            ref={featuresRef}
            className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <Badge variant="outline">
                  Why Choose Us
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Built for Modern Workflows
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our platform is designed with your workflow in mind, offering features that save time and enhance
                  productivity.
                </p>
              </div>
              
              <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <Card key={feature.name} className="feature-card h-full border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                    <CardHeader className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section 
            id="faq"
            ref={faqRef}
            className="w-full py-12 md:py-24 lg:py-32"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <Badge variant="outline">
                  FAQ
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Find answers to common questions about our tools and services.
                </p>
              </div>
              
              <div className="mx-auto grid max-w-3xl gap-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="faq-item border-2 hover:border-primary/50 transition-all">
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

          {/* CTA Section */}
          <section 
            ref={ctaRef}
            className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background"
          >
            <div className="container px-4 md:px-6">
              <div className="cta-content flex flex-col items-center justify-center space-y-6 text-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Get Started?
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    All tools are completely free to use with no login required. Start creating today.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/tools">
                    <Button size="lg" className="h-12 px-8 text-base">
                      Try Our Tools Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="w-full border-t py-6 md:py-0 bg-muted/50">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ToolKit</span>
            </div>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} ToolKit. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
                Terms
              </Link>
              <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  const tools: Tool[] = [
    {
      name: "Background Remover",
      description: "Remove backgrounds from images with AI",
      icon: Paintbrush,
      badge: "Popular",
      slug: "background-remover",
      category: "Image",
    },
    {
      name: "Code Snippet Manager",
      description: "Store and organize your code snippets",
      icon: Code,
      badge: "New",
      slug: "code-snippet-manager",
      category: "Developer",
    },
    {
      name: "Project Idea Generator",
      description: "Generate creative project ideas with AI",
      icon: Lightbulb,
      badge: "New",
      slug: "project-idea-generator",
      category: "Developer",
    },
    {
      name: "Image Cropper",
      description: "Crop and resize images precisely",
      icon: Crop,
      slug: "image-cropper",
      category: "Image",
    },
    {
      name: "Color Extractor",
      description: "Extract color palettes from images",
      icon: Palette,
      slug: "color-extractor",
      category: "Design",
    },
    {
      name: "QR Code Generator",
      description: "Generate QR codes instantly",
      icon: QrCode,
      slug: "qr-code-generator",
      category: "Utility",
    },
    {
      name: "Image Converter",
      description: "Convert images between formats",
      icon: Layers,
      slug: "image-converter",
      category: "Image",
    },
    {
      name: "Text Extractor",
      description: "Extract text from various files",
      icon: FileText,
      slug: "text-extractor",
      category: "Text",
    },
  ]

  const features: Feature[] = [
    {
      name: "Lightning Fast",
      description: "All tools are optimized for speed and efficiency with instant processing",
      icon: Zap,
    },
    {
      name: "100% Secure",
      description: "Your files are processed locally in your browser and never stored on our servers",
      icon: Shield,
    },
    {
      name: "No Installation",
      description: "All tools run in your browser, no software to download or install",
      icon: Download,
    },
    {
      name: "Always Free",
      description: "All features are completely free with no hidden costs or premium tiers",
      icon: Sparkles,
    },
    {
      name: "No Login Required",
      description: "Start using any tool immediately without creating an account",
      icon: Cloud,
    },
    {
      name: "Regular Updates",
      description: "New tools and features added regularly based on user feedback",
      icon: Layers,
    },
  ]

  const faqs: FAQ[] = [
    {
      question: "Are these tools really free?",
      answer:
        "Yes! All our tools are completely free to use with no hidden costs, premium tiers, or usage limits. We believe in providing value to the community.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No account required! You can start using any tool immediately without signing up or providing any personal information.",
    },
    {
      question: "Can I use these tools for commercial projects?",
      answer:
        "Absolutely! All our tools can be used for both personal and commercial projects without any restrictions.",
    },
    {
      question: "Are my files stored on your servers?",
      answer:
        "No. Most tools process files directly in your browser for maximum privacy and security. Your files never leave your device.",
    },
    {
      question: "Is there a limit to how many files I can process?",
      answer:
        "There are no limits! You can process as many files as you need, whenever you need them.",
    },
  ]
