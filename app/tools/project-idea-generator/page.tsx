"use client"

import { useState } from "react"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Lightbulb, Info, Copy, Check, RefreshCw, Bookmark } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProjectIdeaGeneratorPage() {
  const [skillLevel, setSkillLevel] = useState("intermediate")
  const [projectType, setProjectType] = useState("application")
  const [technologies, setTechnologies] = useState<string[]>(["react", "tailwind"])
  const [generatedIdea, setGeneratedIdea] = useState<ProjectIdea | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedIdeas, setSavedIdeas] = useState<ProjectIdea[]>([])
  const [copied, setCopied] = useState(false)

  // Handle technology selection
  const handleTechnologyChange = (technology: string, checked: boolean) => {
    if (checked) {
      setTechnologies([...technologies, technology])
    } else {
      setTechnologies(technologies.filter((t) => t !== technology))
    }
  }

  // Generate a project idea based on selected parameters
  const generateIdea = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      // Filter ideas based on skill level
      const skillLevelIdeas = projectIdeas.filter((idea) => idea.skillLevel === skillLevel)

      // Filter by project type
      const projectTypeIdeas = skillLevelIdeas.filter((idea) => idea.projectType === projectType)

      // Find ideas that use at least one of the selected technologies
      const techFilteredIdeas = projectTypeIdeas.filter((idea) =>
        technologies.some((tech) => idea.technologies.includes(tech)),
      )

      // If no ideas match all criteria, fall back to skill level only
      const eligibleIdeas = techFilteredIdeas.length > 0 ? techFilteredIdeas : skillLevelIdeas

      // Select a random idea from the filtered list
      const randomIdea = eligibleIdeas[Math.floor(Math.random() * eligibleIdeas.length)]

      // Add some randomness to the features
      const randomFeatures = [...randomIdea.features]
      if (randomFeatures.length > 4) {
        // Randomly remove 1-2 features to create variation
        const removeCount = Math.floor(Math.random() * 2) + 1
        for (let i = 0; i < removeCount; i++) {
          const indexToRemove = Math.floor(Math.random() * randomFeatures.length)
          randomFeatures.splice(indexToRemove, 1)
        }
      }

      // Create a copy of the idea with potentially modified features
      const generatedIdea = {
        ...randomIdea,
        features: randomFeatures,
        id: Date.now().toString(), // Add a unique ID for saving
      }

      setGeneratedIdea(generatedIdea)
      setIsGenerating(false)
    }, 1500)
  }

  // Save the current idea
  const saveIdea = () => {
    if (generatedIdea && !savedIdeas.some((idea) => idea.id === generatedIdea.id)) {
      setSavedIdeas([...savedIdeas, generatedIdea])
    }
  }

  // Copy idea to clipboard
  const copyIdea = () => {
    if (!generatedIdea) return

    const ideaText = `
# ${generatedIdea.title}

## Description
${generatedIdea.description}

## Skill Level
${generatedIdea.skillLevel.charAt(0).toUpperCase() + generatedIdea.skillLevel.slice(1)}

## Technologies
${generatedIdea.technologies.map((t) => `- ${t.charAt(0).toUpperCase() + t.slice(1)}`).join("\n")}

## Features
${generatedIdea.features.map((f) => `- ${f}`).join("\n")}

## Learning Outcomes
${generatedIdea.learningOutcomes.map((o) => `- ${o}`).join("\n")}
    `

    navigator.clipboard.writeText(ideaText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Remove a saved idea
  const removeSavedIdea = (id: string) => {
    setSavedIdeas(savedIdeas.filter((idea) => idea.id !== id))
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Front-end Project Ideas Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate creative project ideas for front-end development. Perfect for portfolio building, skill practice, or
          overcoming developer's block.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Free to use</AlertTitle>
        <AlertDescription>
          This tool is completely free to use with no login required. Generate unlimited project ideas to inspire your
          next development journey.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Project Parameters</h2>

            <div className="space-y-2">
              <Label>Skill Level</Label>
              <RadioGroup defaultValue="intermediate" value={skillLevel} onValueChange={setSkillLevel}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Project Type</Label>
              <RadioGroup defaultValue="application" value={projectType} onValueChange={setProjectType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="application" id="application" />
                  <Label htmlFor="application">Application</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="game" id="game" />
                  <Label htmlFor="game">Game</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dashboard" id="dashboard" />
                  <Label htmlFor="dashboard">Dashboard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ecommerce" id="ecommerce" />
                  <Label htmlFor="ecommerce">E-commerce</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Technologies (select at least one)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="react"
                    checked={technologies.includes("react")}
                    onCheckedChange={(checked) => handleTechnologyChange("react", checked as boolean)}
                  />
                  <Label htmlFor="react">React</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vue"
                    checked={technologies.includes("vue")}
                    onCheckedChange={(checked) => handleTechnologyChange("vue", checked as boolean)}
                  />
                  <Label htmlFor="vue">Vue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="angular"
                    checked={technologies.includes("angular")}
                    onCheckedChange={(checked) => handleTechnologyChange("angular", checked as boolean)}
                  />
                  <Label htmlFor="angular">Angular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vanilla"
                    checked={technologies.includes("vanilla")}
                    onCheckedChange={(checked) => handleTechnologyChange("vanilla", checked as boolean)}
                  />
                  <Label htmlFor="vanilla">Vanilla JS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tailwind"
                    checked={technologies.includes("tailwind")}
                    onCheckedChange={(checked) => handleTechnologyChange("tailwind", checked as boolean)}
                  />
                  <Label htmlFor="tailwind">Tailwind CSS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="typescript"
                    checked={technologies.includes("typescript")}
                    onCheckedChange={(checked) => handleTechnologyChange("typescript", checked as boolean)}
                  />
                  <Label htmlFor="typescript">TypeScript</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nextjs"
                    checked={technologies.includes("nextjs")}
                    onCheckedChange={(checked) => handleTechnologyChange("nextjs", checked as boolean)}
                  />
                  <Label htmlFor="nextjs">Next.js</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="api"
                    checked={technologies.includes("api")}
                    onCheckedChange={(checked) => handleTechnologyChange("api", checked as boolean)}
                  />
                  <Label htmlFor="api">API Integration</Label>
                </div>
              </div>
            </div>

            <Button onClick={generateIdea} className="w-full" disabled={technologies.length === 0 || isGenerating}>
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate Project Idea
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Tabs defaultValue="idea">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="idea">Generated Idea</TabsTrigger>
              <TabsTrigger value="saved">Saved Ideas ({savedIdeas.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="idea" className="space-y-4 pt-4">
              {generatedIdea ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{generatedIdea.title}</CardTitle>
                        <CardDescription className="mt-2">{generatedIdea.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyIdea}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={saveIdea}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{generatedIdea.skillLevel}</Badge>
                      <Badge variant="outline">{generatedIdea.projectType}</Badge>
                      {generatedIdea.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Features</h3>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {generatedIdea.features.map((feature, index) => (
                          <li key={index} className="text-sm">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Learning Outcomes</h3>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {generatedIdea.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="text-sm">
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={generateIdea} variant="outline" className="w-full" disabled={isGenerating}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate Another Idea
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Select your parameters and click "Generate Project Idea" to get started.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-4 pt-4">
              {savedIdeas.length > 0 ? (
                <div className="space-y-4">
                  {savedIdeas.map((idea) => (
                    <Card key={idea.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{idea.title}</CardTitle>
                          <Button size="sm" variant="ghost" onClick={() => removeSavedIdea(idea.id)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-x"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </Button>
                        </div>
                        <CardDescription className="mt-2">{idea.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{idea.skillLevel}</Badge>
                          {idea.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    You haven't saved any ideas yet. Generate an idea and click the bookmark icon to save it.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to Use This Generator</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Select your skill level to get appropriately challenging projects.</li>
          <li>Choose a project type that interests you or matches your portfolio needs.</li>
          <li>Select the technologies you want to practice or learn.</li>
          <li>Click "Generate Project Idea" to get a customized project suggestion.</li>
          <li>Save interesting ideas for later or generate new ones until you find inspiration.</li>
          <li>Use the generated features list as a starting point - feel free to add your own creative touches!</li>
        </ol>
      </div>

      <RelatedTools currentTool="project-idea-generator" />
    </div>
  )
}

// Types
interface ProjectIdea {
  id: string
  title: string
  description: string
  skillLevel: string
  projectType: string
  technologies: string[]
  features: string[]
  learningOutcomes: string[]
}

// Sample project ideas database
const projectIdeas: Omit<ProjectIdea, "id">[] = [
  {
    title: "Weather Dashboard",
    description:
      "Create an interactive weather dashboard that displays current weather and forecasts for multiple locations.",
    skillLevel: "beginner",
    projectType: "dashboard",
    technologies: ["react", "api", "tailwind"],
    features: [
      "Search for cities and save favorites",
      "Display current temperature, humidity, and wind speed",
      "Show 5-day forecast with icons",
      "Toggle between Celsius and Fahrenheit",
      "Responsive design for mobile and desktop",
      "Geolocation to detect user's current location",
    ],
    learningOutcomes: [
      "Working with third-party APIs",
      "State management in React",
      "Responsive design principles",
      "Handling user location data",
      "Data visualization basics",
    ],
  },
  {
    title: "Task Management Application",
    description: "Build a Kanban-style task management app with drag-and-drop functionality.",
    skillLevel: "intermediate",
    projectType: "application",
    technologies: ["react", "typescript", "tailwind"],
    features: [
      "Create, edit, and delete tasks",
      "Drag and drop tasks between columns (To Do, In Progress, Done)",
      "Filter and search tasks",
      "Set due dates and priority levels",
      "Local storage to persist data",
      "Dark/light mode toggle",
    ],
    learningOutcomes: [
      "Advanced state management",
      "Drag and drop implementation",
      "TypeScript with React",
      "Local storage and data persistence",
      "UI/UX design principles",
    ],
  },
  {
    title: "E-commerce Product Page",
    description: "Create a detailed product page with gallery, variants, and cart functionality.",
    skillLevel: "intermediate",
    projectType: "ecommerce",
    technologies: ["vue", "tailwind", "api"],
    features: [
      "Image gallery with zoom functionality",
      "Product variants (size, color, etc.)",
      "Add to cart and quantity selector",
      "Product reviews and ratings",
      "Related products carousel",
      "Stock availability indicator",
    ],
    learningOutcomes: [
      "Vue component architecture",
      "State management in Vue",
      "E-commerce UX best practices",
      "Image handling and optimization",
      "Form validation techniques",
    ],
  },
  {
    title: "Memory Card Game",
    description: "Build a memory card matching game with different difficulty levels and themes.",
    skillLevel: "beginner",
    projectType: "game",
    technologies: ["vanilla", "tailwind"],
    features: [
      "Grid of cards that can be flipped",
      "Match pairs of cards to remove them",
      "Timer and move counter",
      "Multiple difficulty levels",
      "Different card themes (animals, colors, etc.)",
      "Victory animation and score tracking",
    ],
    learningOutcomes: [
      "DOM manipulation",
      "CSS animations and transitions",
      "Game logic implementation",
      "Randomization algorithms",
      "Vanilla JavaScript best practices",
    ],
  },
  {
    title: "Real-time Chat Application",
    description: "Create a real-time chat application with rooms and user presence indicators.",
    skillLevel: "advanced",
    projectType: "application",
    technologies: ["react", "nextjs", "typescript"],
    features: [
      "Real-time messaging",
      "Create and join different chat rooms",
      "User authentication",
      "Online/offline status indicators",
      "Message read receipts",
      "File and image sharing",
      "Message search functionality",
    ],
    learningOutcomes: [
      "Real-time data handling",
      "WebSocket implementation",
      "Authentication and authorization",
      "Advanced React patterns",
      "Server-side rendering with Next.js",
    ],
  },
  {
    title: "Interactive Data Visualization Dashboard",
    description: "Build a dashboard with interactive charts and filters to visualize complex datasets.",
    skillLevel: "advanced",
    projectType: "dashboard",
    technologies: ["react", "typescript", "api"],
    features: [
      "Multiple chart types (bar, line, pie, etc.)",
      "Interactive filters and date ranges",
      "Data export functionality",
      "Responsive design for all devices",
      "Dark/light mode toggle",
      "Drill-down capabilities for detailed analysis",
      "Save and share report configurations",
    ],
    learningOutcomes: [
      "Data visualization libraries",
      "Complex state management",
      "Performance optimization for large datasets",
      "Advanced filtering and data manipulation",
      "Accessibility in data visualization",
    ],
  },
  {
    title: "Recipe Finder Application",
    description: "Create an app that helps users find recipes based on ingredients they have.",
    skillLevel: "intermediate",
    projectType: "application",
    technologies: ["vue", "api", "tailwind"],
    features: [
      "Search by ingredient, cuisine, or diet",
      "Filter by cooking time and difficulty",
      "Save favorite recipes",
      "Generate shopping lists",
      "Responsive design for mobile use in the kitchen",
      "Nutrition information display",
    ],
    learningOutcomes: [
      "Complex API integration",
      "Search and filter functionality",
      "Vue composition API",
      "Form handling and validation",
      "Mobile-first design approach",
    ],
  },
  {
    title: "Personal Finance Tracker",
    description: "Build an application to track personal expenses, income, and savings goals.",
    skillLevel: "intermediate",
    projectType: "dashboard",
    technologies: ["react", "typescript", "tailwind"],
    features: [
      "Add and categorize expenses and income",
      "Visualize spending patterns with charts",
      "Set and track savings goals",
      "Monthly budget planning",
      "Export reports as PDF or CSV",
      "Recurring transactions setup",
    ],
    learningOutcomes: [
      "Form handling and validation",
      "Data visualization",
      "Local storage or database integration",
      "Financial calculations",
      "Data export functionality",
    ],
  },
  {
    title: "Multiplayer Tic-Tac-Toe Game",
    description: "Create a real-time multiplayer tic-tac-toe game with matchmaking.",
    skillLevel: "intermediate",
    projectType: "game",
    technologies: ["react", "nextjs", "api"],
    features: [
      "Real-time gameplay",
      "Player matchmaking",
      "Game history and statistics",
      "Chat functionality",
      "Customizable game tokens",
      "Responsive design for mobile play",
    ],
    learningOutcomes: [
      "Real-time communication",
      "Game state management",
      "Multiplayer game logic",
      "User authentication",
      "Optimistic UI updates",
    ],
  },
  {
    title: "E-commerce Shopping Cart",
    description: "Build a fully functional shopping cart system with product catalog.",
    skillLevel: "intermediate",
    projectType: "ecommerce",
    technologies: ["react", "typescript", "tailwind"],
    features: [
      "Product listing with filters",
      "Add/remove items from cart",
      "Quantity adjustments",
      "Cart persistence across sessions",
      "Checkout process with form validation",
      "Order summary with tax calculation",
    ],
    learningOutcomes: [
      "Complex state management",
      "Local storage for cart persistence",
      "Form validation and user input",
      "Price and tax calculations",
      "Responsive e-commerce design patterns",
    ],
  },
  {
    title: "Interactive Quiz Application",
    description: "Create a quiz app with multiple categories, difficulty levels, and scoring.",
    skillLevel: "beginner",
    projectType: "application",
    technologies: ["vanilla", "api"],
    features: [
      "Multiple choice questions from various categories",
      "Timer for each question",
      "Score tracking and high scores",
      "Difficulty selection",
      "Results page with correct answers",
      "Share results on social media",
    ],
    learningOutcomes: [
      "DOM manipulation",
      "API integration for quiz questions",
      "Timer functionality",
      "Score calculation algorithms",
      "Form handling for quiz answers",
    ],
  },
  {
    title: "Markdown Note Taking App",
    description: "Build a note-taking application with markdown support and organization features.",
    skillLevel: "intermediate",
    projectType: "application",
    technologies: ["react", "typescript", "tailwind"],
    features: [
      "Markdown editor with preview",
      "Note organization with folders and tags",
      "Search functionality",
      "Dark/light mode toggle",
      "Export notes as PDF or markdown files",
      "Keyboard shortcuts for power users",
    ],
    learningOutcomes: [
      "Markdown parsing and rendering",
      "File system-like organization in frontend",
      "Search algorithm implementation",
      "Local storage or database integration",
      "Keyboard event handling",
    ],
  },
  {
    title: "Social Media Dashboard",
    description: "Create a dashboard to track and analyze social media metrics across platforms.",
    skillLevel: "advanced",
    projectType: "dashboard",
    technologies: ["react", "nextjs", "typescript", "api"],
    features: [
      "Integration with multiple social platforms",
      "Real-time follower and engagement metrics",
      "Historical data visualization",
      "Scheduled post planning",
      "Content performance analysis",
      "Custom report generation",
    ],
    learningOutcomes: [
      "OAuth and API integration",
      "Real-time data updates",
      "Complex data visualization",
      "Date handling and time zones",
      "Report generation and export",
    ],
  },
  {
    title: "2D Platformer Game",
    description: "Build a simple 2D platformer game with physics, collectibles, and levels.",
    skillLevel: "advanced",
    projectType: "game",
    technologies: ["vanilla", "typescript"],
    features: [
      "Character movement and jumping",
      "Collision detection",
      "Collectible items and scoring",
      "Multiple levels with increasing difficulty",
      "Enemy characters with basic AI",
      "Sound effects and background music",
    ],
    learningOutcomes: [
      "Game physics implementation",
      "Canvas API for rendering",
      "Game loop and animation frames",
      "Audio handling in browsers",
      "Level design principles",
    ],
  },
  {
    title: "E-commerce Product Catalog",
    description: "Create a responsive product catalog with filtering, sorting, and search capabilities.",
    skillLevel: "beginner",
    projectType: "ecommerce",
    technologies: ["vue", "tailwind", "api"],
    features: [
      "Grid and list view options",
      "Filter by category, price, and attributes",
      "Sort by relevance, price, and popularity",
      "Search with autocomplete",
      "Pagination or infinite scroll",
      "Quick view product modal",
    ],
    learningOutcomes: [
      "Data filtering and sorting algorithms",
      "Search functionality implementation",
      "Responsive grid layouts",
      "Vue component composition",
      "API integration for product data",
    ],
  },
  {
    title: "Habit Tracker Application",
    description: "Build an application to track daily habits and visualize progress over time.",
    skillLevel: "intermediate",
    projectType: "application",
    technologies: ["react", "tailwind", "typescript"],
    features: [
      "Create and track daily, weekly, or monthly habits",
      "Streak counting and visualization",
      "Calendar view of completed habits",
      "Progress statistics and charts",
      "Reminder notifications",
      "Goal setting for habit formation",
    ],
    learningOutcomes: [
      "Complex state management",
      "Date manipulation and calculations",
      "Data visualization for progress",
      "Local storage or database integration",
      "Notification API usage",
    ],
  },
  {
    title: "Real Estate Listing Website",
    description: "Create a property listing website with search, filters, and interactive maps.",
    skillLevel: "advanced",
    projectType: "application",
    technologies: ["react", "nextjs", "api", "typescript"],
    features: [
      "Property search with multiple filters",
      "Interactive map with property markers",
      "Property details page with image gallery",
      "Save favorite properties",
      "Contact forms for inquiries",
      "Mortgage calculator",
      "Similar properties recommendation",
    ],
    learningOutcomes: [
      "Map API integration",
      "Complex filtering and search",
      "Image gallery implementation",
      "Form handling and validation",
      "SEO optimization for listings",
    ],
  },
  {
    title: "Pomodoro Timer Application",
    description: "Build a customizable Pomodoro timer with task tracking and statistics.",
    skillLevel: "beginner",
    projectType: "application",
    technologies: ["vanilla", "tailwind"],
    features: [
      "Customizable work and break intervals",
      "Task list integration",
      "Sound notifications",
      "Session statistics and history",
      "Dark/light mode toggle",
      "Desktop notifications",
    ],
    learningOutcomes: [
      "Timer implementation in JavaScript",
      "Local storage for settings and history",
      "Notification API usage",
      "Audio API for alerts",
      "Data visualization for statistics",
    ],
  },
  {
    title: "Interactive Story Game",
    description: "Create a text-based adventure game with branching storylines and choices.",
    skillLevel: "intermediate",
    projectType: "game",
    technologies: ["react", "tailwind"],
    features: [
      "Branching narrative with player choices",
      "Character stats and inventory system",
      "Save and load game progress",
      "Atmospheric sound effects and music",
      "Animated transitions between scenes",
      "Multiple endings based on choices",
    ],
    learningOutcomes: [
      "State management for complex game states",
      "Story tree data structures",
      "Save state persistence",
      "CSS animations and transitions",
      "Audio management in web applications",
    ],
  },
]

