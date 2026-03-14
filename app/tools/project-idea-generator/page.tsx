"use client"

import { useState, useEffect } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Lightbulb, Copy, Check, RefreshCw, Bookmark, X } from "lucide-react"
import { toast } from "sonner"

interface ProjectIdea {
  id: string; title: string; description: string; skillLevel: string
  projectType: string; technologies: string[]; features: string[]; learningOutcomes: string[]
}

const SKILL_LEVELS = ["beginner", "intermediate", "advanced"]
const PROJECT_TYPES = ["application", "game", "dashboard", "ecommerce"]
const TECH_OPTIONS = [
  { value: "react", label: "React" }, { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" }, { value: "vanilla", label: "Vanilla JS" },
  { value: "tailwind", label: "Tailwind CSS" }, { value: "typescript", label: "TypeScript" },
  { value: "nextjs", label: "Next.js" }, { value: "api", label: "API Integration" },
]

export default function ProjectIdeaGeneratorPage() {
  const [skillLevel, setSkillLevel] = useState("intermediate")
  const [projectType, setProjectType] = useState("application")
  const [technologies, setTechnologies] = useState<string[]>(["react", "tailwind"])
  const [idea, setIdea] = useState<ProjectIdea | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedIdeas, setSavedIdeas] = useState<ProjectIdea[]>([])
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"idea" | "saved">("idea")

  useEffect(() => {
    const saved = localStorage.getItem("savedProjectIdeas")
    if (saved) setSavedIdeas(JSON.parse(saved))
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) localStorage.setItem("savedProjectIdeas", JSON.stringify(savedIdeas))
  }, [savedIdeas, isLoading])

  const toggleTech = (t: string) => setTechnologies(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])

  const generateIdea = () => {
    setIsGenerating(true)
    const bySkill = allProjectIdeas.filter(i => i.skillLevel === skillLevel)
    const byType = bySkill.filter(i => i.projectType === projectType)
    const byTech = byType.filter(i => technologies.some(t => i.technologies.includes(t)))
    const pool = byTech.length > 0 ? byTech : bySkill
    const base = pool[Math.floor(Math.random() * pool.length)]
    const features = [...base.features]
    if (features.length > 4) features.splice(Math.floor(Math.random() * features.length), Math.floor(Math.random() * 2) + 1)
    setIdea({ ...base, features, id: Date.now().toString() })
    setIsGenerating(false)
    setActiveTab("idea")
  }

  const saveIdea = () => {
    if (!idea || savedIdeas.some(s => s.id === idea.id)) return
    setSavedIdeas(p => [...p, idea]); toast.success("Idea saved!")
  }

  const copyIdea = () => {
    if (!idea) return
    const text = `# ${idea.title}\n\n${idea.description}\n\n## Technologies\n${idea.technologies.map(t => `- ${t}`).join("\n")}\n\n## Features\n${idea.features.map(f => `- ${f}`).join("\n")}\n\n## Learning Outcomes\n${idea.learningOutcomes.map(o => `- ${o}`).join("\n")}`
    navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const tabClass = (active: boolean) => `flex-1 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md transition-all ${active ? "bg-white text-black" : "text-[#A0A0A0] hover:text-white"}`
  const pillClass = (active: boolean) => `rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all cursor-pointer ${active ? "border-[#4D9FFF]/40 bg-[#4D9FFF]/[0.06] text-white" : "border-white/[0.08] text-[#A0A0A0] hover:border-white/20 hover:text-white"}`

  return (
    <div className="space-y-8">
      <ToolHeader icon={Lightbulb} label="Developer" title="Project Idea Generator" description="Generate creative front-end project ideas based on your skill level, project type, and preferred technologies." />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-5">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-5">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Skill Level</p>
              <div className="flex gap-2 flex-wrap">
                {SKILL_LEVELS.map(s => (
                  <button key={s} onClick={() => setSkillLevel(s)} className={pillClass(skillLevel === s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Project Type</p>
              <div className="flex gap-2 flex-wrap">
                {PROJECT_TYPES.map(t => (
                  <button key={t} onClick={() => setProjectType(t)} className={pillClass(projectType === t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Technologies</p>
              <div className="grid grid-cols-2 gap-2">
                {TECH_OPTIONS.map(({ value, label }) => (
                  <label key={value} className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-sm transition-all ${technologies.includes(value) ? "border-[#4D9FFF]/40 bg-[#4D9FFF]/[0.06] text-white" : "border-white/[0.08] text-[#A0A0A0] hover:border-white/20"}`}>
                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-all ${technologies.includes(value) ? "border-[#4D9FFF] bg-[#4D9FFF]" : "border-white/20 bg-transparent"}`}>
                      {technologies.includes(value) && <Check className="h-2.5 w-2.5 text-black" />}
                    </div>
                    <input type="checkbox" className="sr-only" checked={technologies.includes(value)} onChange={() => toggleTech(value)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button onClick={generateIdea} disabled={technologies.length === 0 || isGenerating}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Lightbulb className="h-4 w-4" />{isGenerating ? "Generating…" : "Generate Project Idea"}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
            <button onClick={() => setActiveTab("idea")} className={tabClass(activeTab === "idea")}>Generated Idea</button>
            <button onClick={() => setActiveTab("saved")} className={tabClass(activeTab === "saved")}>Saved ({savedIdeas.length})</button>
          </div>

          {activeTab === "idea" && (
            idea ? (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">{idea.title}</h2>
                    <p className="text-sm text-[#A0A0A0] mt-1">{idea.description}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={copyIdea} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#A0A0A0] hover:text-white transition-all">
                      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={saveIdea} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#A0A0A0] hover:text-white transition-all">
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-[#A0A0A0]">{idea.skillLevel}</span>
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-[#A0A0A0]">{idea.projectType}</span>
                  {idea.technologies.map(t => <span key={t} className="rounded-md border border-[#4D9FFF]/20 bg-[#4D9FFF]/[0.06] px-2 py-0.5 text-[10px] text-[#4D9FFF]">{t}</span>)}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Features</p>
                  <ul className="space-y-1">
                    {idea.features.map((f, i) => <li key={i} className="text-sm text-[#A0A0A0] flex gap-2"><span className="text-[#4D9FFF] shrink-0">•</span>{f}</li>)}
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Learning Outcomes</p>
                  <ul className="space-y-1">
                    {idea.learningOutcomes.map((o, i) => <li key={i} className="text-sm text-[#A0A0A0] flex gap-2"><span className="text-white/30 shrink-0">→</span>{o}</li>)}
                  </ul>
                </div>
                <button onClick={generateIdea} disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white disabled:opacity-30">
                  <RefreshCw className="h-4 w-4" />Generate Another
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-10 text-center space-y-2">
                <Lightbulb className="h-10 w-10 text-white/10 mx-auto" />
                <p className="text-sm text-[#A0A0A0]">Select your parameters and generate an idea</p>
              </div>
            )
          )}

          {activeTab === "saved" && (
            isLoading ? (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-white/20 border-t-white rounded-full" />
              </div>
            ) : savedIdeas.length > 0 ? (
              <div className="space-y-3">
                {savedIdeas.map(s => (
                  <div key={s.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-white">{s.title}</p>
                        <p className="text-xs text-[#A0A0A0] mt-0.5 line-clamp-2">{s.description}</p>
                      </div>
                      <button onClick={() => setSavedIdeas(p => p.filter(x => x.id !== s.id))} className="text-[#A0A0A0] hover:text-white transition-colors shrink-0">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="rounded-md border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-[#A0A0A0]">{s.skillLevel}</span>
                      {s.technologies.slice(0, 3).map(t => <span key={t} className="rounded-md border border-[#4D9FFF]/20 bg-[#4D9FFF]/[0.06] px-1.5 py-0.5 text-[10px] text-[#4D9FFF]">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-10 text-center space-y-2">
                <Bookmark className="h-10 w-10 text-white/10 mx-auto" />
                <p className="text-sm text-[#A0A0A0]">No saved ideas yet</p>
              </div>
            )
          )}
        </div>
      </div>

      <RelatedTools currentTool="project-idea-generator" />
    </div>
  )
}

// ── Data ─────────────────────────────────────────────────────────────────────

const projectIdeas: Omit<ProjectIdea, "id">[] = [
  { title: "Weather Dashboard", description: "Create an interactive weather dashboard that displays current weather and forecasts for multiple locations.", skillLevel: "beginner", projectType: "dashboard", technologies: ["react", "api", "tailwind"], features: ["Search for cities and save favorites", "Display current temperature, humidity, and wind speed", "Show 5-day forecast with icons", "Toggle between Celsius and Fahrenheit", "Responsive design for mobile and desktop"], learningOutcomes: ["Working with third-party APIs", "State management in React", "Responsive design principles", "Handling user location data"] },
  { title: "Task Management Application", description: "Build a Kanban-style task management app with drag-and-drop functionality.", skillLevel: "intermediate", projectType: "application", technologies: ["react", "typescript", "tailwind"], features: ["Create, edit, and delete tasks", "Drag and drop tasks between columns", "Filter and search tasks", "Set due dates and priority levels", "Local storage to persist data"], learningOutcomes: ["Advanced state management", "Drag and drop implementation", "TypeScript with React", "Local storage and data persistence"] },
  { title: "E-commerce Product Page", description: "Create a detailed product page with gallery, variants, and cart functionality.", skillLevel: "intermediate", projectType: "ecommerce", technologies: ["vue", "tailwind", "api"], features: ["Image gallery with zoom functionality", "Product variants (size, color, etc.)", "Add to cart and quantity selector", "Product reviews and ratings", "Related products carousel"], learningOutcomes: ["Vue component architecture", "State management in Vue", "E-commerce UX best practices", "Image handling and optimization"] },
  { title: "Memory Card Game", description: "Build a memory card matching game with different difficulty levels and themes.", skillLevel: "beginner", projectType: "game", technologies: ["vanilla", "tailwind"], features: ["Grid of cards that can be flipped", "Match pairs of cards to remove them", "Timer and move counter", "Multiple difficulty levels", "Victory animation and score tracking"], learningOutcomes: ["DOM manipulation", "CSS animations and transitions", "Game logic implementation", "Randomization algorithms"] },
  { title: "Real-time Chat Application", description: "Create a real-time chat application with rooms and user presence indicators.", skillLevel: "advanced", projectType: "application", technologies: ["react", "nextjs", "typescript"], features: ["Real-time messaging", "Create and join different chat rooms", "User authentication", "Online/offline status indicators", "Message read receipts"], learningOutcomes: ["Real-time data handling", "WebSocket implementation", "Authentication and authorization", "Advanced React patterns"] },
  { title: "Interactive Data Visualization Dashboard", description: "Build a dashboard with interactive charts and filters to visualize complex datasets.", skillLevel: "advanced", projectType: "dashboard", technologies: ["react", "typescript", "api"], features: ["Multiple chart types (bar, line, pie, etc.)", "Interactive filters and date ranges", "Data export functionality", "Responsive design for all devices", "Drill-down capabilities for detailed analysis"], learningOutcomes: ["Data visualization libraries", "Complex state management", "Performance optimization for large datasets", "Advanced filtering and data manipulation"] },
  { title: "Recipe Finder Application", description: "Create an app that helps users find recipes based on ingredients they have.", skillLevel: "intermediate", projectType: "application", technologies: ["vue", "api", "tailwind"], features: ["Search by ingredient, cuisine, or diet", "Filter by cooking time and difficulty", "Save favorite recipes", "Generate shopping lists", "Nutrition information display"], learningOutcomes: ["Complex API integration", "Search and filter functionality", "Vue composition API", "Form handling and validation"] },
  { title: "Personal Finance Tracker", description: "Build an application to track personal expenses, income, and savings goals.", skillLevel: "intermediate", projectType: "dashboard", technologies: ["react", "typescript", "tailwind"], features: ["Add and categorize expenses and income", "Visualize spending patterns with charts", "Set and track savings goals", "Monthly budget planning", "Export reports as PDF or CSV"], learningOutcomes: ["Form handling and validation", "Data visualization", "Local storage or database integration", "Financial calculations"] },
  { title: "Multiplayer Tic-Tac-Toe Game", description: "Create a real-time multiplayer tic-tac-toe game with matchmaking.", skillLevel: "intermediate", projectType: "game", technologies: ["react", "nextjs", "api"], features: ["Real-time gameplay", "Player matchmaking", "Game history and statistics", "Chat functionality", "Customizable game tokens"], learningOutcomes: ["Real-time communication", "Game state management", "Multiplayer game logic", "User authentication"] },
  { title: "E-commerce Shopping Cart", description: "Build a fully functional shopping cart system with product catalog.", skillLevel: "intermediate", projectType: "ecommerce", technologies: ["react", "typescript", "tailwind"], features: ["Product listing with filters", "Add/remove items from cart", "Quantity adjustments", "Cart persistence across sessions", "Checkout process with form validation"], learningOutcomes: ["Complex state management", "Local storage for cart persistence", "Form validation and user input", "Price and tax calculations"] },
  { title: "Interactive Quiz Application", description: "Create a quiz app with multiple categories, difficulty levels, and scoring.", skillLevel: "beginner", projectType: "application", technologies: ["vanilla", "api"], features: ["Multiple choice questions from various categories", "Timer for each question", "Score tracking and high scores", "Difficulty selection", "Results page with correct answers"], learningOutcomes: ["DOM manipulation", "API integration for quiz questions", "Timer functionality", "Score calculation algorithms"] },
  { title: "Markdown Note Taking App", description: "Build a note-taking application with markdown support and organization features.", skillLevel: "intermediate", projectType: "application", technologies: ["react", "typescript", "tailwind"], features: ["Markdown editor with preview", "Note organization with folders and tags", "Search functionality", "Dark/light mode toggle", "Export notes as PDF or markdown files"], learningOutcomes: ["Markdown parsing and rendering", "File system-like organization in frontend", "Search algorithm implementation", "Local storage or database integration"] },
  { title: "Social Media Dashboard", description: "Create a dashboard to track and analyze social media metrics across platforms.", skillLevel: "advanced", projectType: "dashboard", technologies: ["react", "nextjs", "typescript", "api"], features: ["Integration with multiple social platforms", "Real-time follower and engagement metrics", "Historical data visualization", "Scheduled post planning", "Custom report generation"], learningOutcomes: ["OAuth and API integration", "Real-time data updates", "Complex data visualization", "Date handling and time zones"] },
  { title: "2D Platformer Game", description: "Build a simple 2D platformer game with physics, collectibles, and levels.", skillLevel: "advanced", projectType: "game", technologies: ["vanilla", "typescript"], features: ["Character movement and jumping", "Collision detection", "Collectible items and scoring", "Multiple levels with increasing difficulty", "Enemy characters with basic AI"], learningOutcomes: ["Game physics implementation", "Canvas API for rendering", "Game loop and animation frames", "Audio handling in browsers"] },
  { title: "E-commerce Product Catalog", description: "Create a responsive product catalog with filtering, sorting, and search capabilities.", skillLevel: "beginner", projectType: "ecommerce", technologies: ["vue", "tailwind", "api"], features: ["Grid and list view options", "Filter by category, price, and attributes", "Sort by relevance, price, and popularity", "Search with autocomplete", "Pagination or infinite scroll"], learningOutcomes: ["Data filtering and sorting algorithms", "Search functionality implementation", "Responsive grid layouts", "Vue component composition"] },
  { title: "Habit Tracker Application", description: "Build an application to track daily habits and visualize progress over time.", skillLevel: "intermediate", projectType: "application", technologies: ["react", "tailwind", "typescript"], features: ["Create and track daily, weekly, or monthly habits", "Streak counting and visualization", "Calendar view of completed habits", "Progress statistics and charts", "Goal setting for habit formation"], learningOutcomes: ["Complex state management", "Date manipulation and calculations", "Data visualization for progress", "Local storage or database integration"] },
  { title: "Pomodoro Timer Application", description: "Build a customizable Pomodoro timer with task tracking and statistics.", skillLevel: "beginner", projectType: "application", technologies: ["vanilla", "tailwind"], features: ["Customizable work and break intervals", "Task list integration", "Sound notifications", "Session statistics and history", "Desktop notifications"], learningOutcomes: ["Timer implementation in JavaScript", "Local storage for settings and history", "Notification API usage", "Audio API for alerts"] },
  { title: "Interactive Story Game", description: "Create a text-based adventure game with branching storylines and choices.", skillLevel: "intermediate", projectType: "game", technologies: ["react", "tailwind"], features: ["Branching narrative with player choices", "Character stats and inventory system", "Save and load game progress", "Animated transitions between scenes", "Multiple endings based on choices"], learningOutcomes: ["State management for complex game states", "Story tree data structures", "Save state persistence", "CSS animations and transitions"] },
  { title: "AI Image Generator", description: "Create a web application that generates images using AI models.", skillLevel: "advanced", projectType: "application", technologies: ["react", "nextjs", "api", "typescript"], features: ["Text-to-image generation", "Image customization options", "Gallery of generated images", "Share and download functionality", "Advanced prompt builder"], learningOutcomes: ["AI API integration", "Image processing and manipulation", "Advanced state management", "Performance optimization for large files"] },
  { title: "Code Snippet Manager", description: "Build a tool for developers to store, organize, and share code snippets.", skillLevel: "intermediate", projectType: "application", technologies: ["react", "typescript", "tailwind"], features: ["Syntax highlighting for multiple languages", "Tags and categories for organization", "Search and filter functionality", "Copy to clipboard with one click", "Import/export functionality"], learningOutcomes: ["Code syntax highlighting libraries", "Search and filtering algorithms", "Data organization patterns", "User authentication and authorization"] },
  { title: "Fitness Workout Builder", description: "Create a tool for designing and tracking custom workout routines.", skillLevel: "intermediate", projectType: "application", technologies: ["react", "typescript", "tailwind"], features: ["Exercise library with animations", "Workout plan builder", "Progress tracking", "Timer and rest periods", "Custom exercise creation"], learningOutcomes: ["Animation implementation", "Timer functionality", "Data visualization", "Complex form handling"] },
  { title: "Meditation Timer", description: "Build a customizable meditation and mindfulness app.", skillLevel: "beginner", projectType: "application", technologies: ["react", "typescript", "tailwind"], features: ["Custom timer settings", "Ambient sound mixer", "Guided meditation scripts", "Progress tracking", "Statistics dashboard"], learningOutcomes: ["Audio manipulation", "Timer implementation", "State management", "Data visualization"] },
  { title: "Budget Travel Planner", description: "Create a travel planning tool that helps users find budget-friendly trips.", skillLevel: "intermediate", projectType: "application", technologies: ["react", "typescript", "api"], features: ["Flight and hotel price tracking", "Budget optimization", "Itinerary builder", "Cost splitting calculator", "Local attractions finder"], learningOutcomes: ["Third-party API integration", "Price tracking algorithms", "Geolocation services", "Data aggregation"] },
  { title: "Personal Knowledge Base", description: "Build a tool for organizing and connecting personal knowledge and notes.", skillLevel: "intermediate", projectType: "application", technologies: ["react", "typescript", "tailwind"], features: ["Rich text editor", "Knowledge graph visualization", "Tag system", "Quick capture widget", "Cross-reference linking"], learningOutcomes: ["Graph visualization", "Text editor implementation", "Data relationships", "Search algorithms"] },
]

const allProjectIdeas = projectIdeas
