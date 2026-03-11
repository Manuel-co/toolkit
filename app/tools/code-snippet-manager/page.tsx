"use client"

import { useState, useEffect } from "react"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Search, Code, Save, Trash2, Plus, X, Sparkles, FileCode, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

interface CodeSnippet {
  id: string
  title: string
  code: string
  language: string
  tags: string[]
  description: string
  createdAt: string
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
]

export default function CodeSnippetManagerPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null)
  
  const [newSnippet, setNewSnippet] = useState<Partial<CodeSnippet>>({
    title: "",
    code: "",
    language: "javascript",
    tags: [],
    description: "",
  })

  // Load snippets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('codeSnippets')
    if (saved) {
      const loadedSnippets = JSON.parse(saved)
      setSnippets(loadedSnippets)
      if (loadedSnippets.length > 0) {
        setSelectedSnippetId(loadedSnippets[0].id)
      }
    }
    setIsLoading(false)
  }, [])

  // Save snippets to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('codeSnippets', JSON.stringify(snippets))
    }
  }, [snippets, isLoading])

  // Filter snippets
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesLanguage = selectedLanguage === "all" || snippet.language === selectedLanguage
    return matchesSearch && matchesLanguage
  })

  // Get selected snippet
  const selectedSnippet = snippets.find(s => s.id === selectedSnippetId)

  // Add new snippet
  const addSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) {
      toast.error("Please fill in title and code")
      return
    }

    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title,
      code: newSnippet.code,
      language: newSnippet.language || "javascript",
      tags: newSnippet.tags || [],
      description: newSnippet.description || "",
      createdAt: new Date().toISOString(),
    }

    setSnippets([snippet, ...snippets])
    setSelectedSnippetId(snippet.id)
    setNewSnippet({
      title: "",
      code: "",
      language: "javascript",
      tags: [],
      description: "",
    })
    setIsDialogOpen(false)
    toast.success("Snippet saved successfully!")
  }

  // Copy snippet to clipboard
  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(selectedSnippetId)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Delete snippet
  const deleteSnippet = (id: string) => {
    const index = snippets.findIndex(s => s.id === id)
    setSnippets(snippets.filter(snippet => snippet.id !== id))
    
    // Select next snippet or previous
    if (snippets.length > 1) {
      const nextSnippet = snippets[index + 1] || snippets[index - 1]
      setSelectedSnippetId(nextSnippet?.id || null)
    } else {
      setSelectedSnippetId(null)
    }
    
    toast.success("Snippet deleted")
  }

  // Add tag
  const addTag = () => {
    if (!tagInput.trim()) return
    if (newSnippet.tags?.includes(tagInput.trim())) {
      toast.error("Tag already exists")
      return
    }
    setNewSnippet({
      ...newSnippet,
      tags: [...(newSnippet.tags || []), tagInput.trim()]
    })
    setTagInput("")
  }

  // Remove tag
  const removeTag = (index: number) => {
    setNewSnippet({
      ...newSnippet,
      tags: newSnippet.tags?.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-2">
          <Code className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Code Snippet Manager</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Store, organize, and share your code snippets. Perfect for saving reusable code, examples, and solutions.
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <Sparkles className="h-5 w-5 text-primary" />
        <AlertTitle className="text-base">Free & Private</AlertTitle>
        <AlertDescription className="text-sm">
          All snippets are saved locally in your browser. No account required, completely free, and your code stays private.
        </AlertDescription>
      </Alert>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Snippet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Snippet</DialogTitle>
              <DialogDescription>
                Create a new code snippet with title, code, and tags.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newSnippet.title}
                  onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                  placeholder="e.g., Array sorting function"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={newSnippet.language} 
                  onValueChange={(value) => setNewSnippet({ ...newSnippet, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Textarea
                  id="code"
                  value={newSnippet.code}
                  onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                  placeholder="Paste your code here..."
                  className="font-mono text-sm"
                  rows={12}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newSnippet.description}
                  onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
                  placeholder="Describe what this code does..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newSnippet.tags && newSnippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newSnippet.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addSnippet}>
                <Save className="mr-2 h-4 w-4" />
                Save Snippet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar */}
        <Card className="lg:sticky lg:top-6 h-fit max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Snippets</CardTitle>
            <div className="space-y-2 pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
              
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : filteredSnippets.length > 0 ? (
              <div className="space-y-1 p-2">
                {filteredSnippets.map((snippet) => (
                  <button
                    key={snippet.id}
                    onClick={() => setSelectedSnippetId(snippet.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSnippetId === snippet.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium text-sm truncate">{snippet.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={selectedSnippetId === snippet.id ? "secondary" : "outline"} 
                        className="text-xs"
                      >
                        {LANGUAGES.find(l => l.value === snippet.language)?.label || snippet.language}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {searchQuery || selectedLanguage !== "all" 
                  ? "No snippets found" 
                  : "No snippets yet"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div>
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4" />
                <p className="text-muted-foreground">Loading snippets...</p>
              </CardContent>
            </Card>
          ) : selectedSnippet ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-2xl">{selectedSnippet.title}</CardTitle>
                      <Badge variant="outline" className="font-mono">
                        {LANGUAGES.find(l => l.value === selectedSnippet.language)?.label || selectedSnippet.language}
                      </Badge>
                    </div>
                    {selectedSnippet.description && (
                      <CardDescription className="text-base">{selectedSnippet.description}</CardDescription>
                    )}
                    {selectedSnippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedSnippet.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copySnippet(selectedSnippet.code)}
                    >
                      {copiedId === selectedSnippet.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => deleteSnippet(selectedSnippet.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-6 rounded-lg overflow-x-auto border-2 whitespace-pre-wrap break-words">
                    <code className="text-sm font-mono">{selectedSnippet.code}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <FileCode className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No snippet selected</h3>
                <p className="text-muted-foreground mb-4">
                  {snippets.length === 0 
                    ? "Start by adding your first code snippet" 
                    : "Select a snippet from the sidebar"}
                </p>
                {snippets.length === 0 && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Snippet
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tips for Using Code Snippets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use descriptive titles and tags to make snippets easy to find</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Add comments in your code to explain complex logic</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Organize snippets by language or purpose using tags</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Keep snippets focused and single-purpose for better reusability</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use the search function to quickly find relevant code</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <RelatedTools currentTool="code-snippet-manager" />
    </div>
  )
}
