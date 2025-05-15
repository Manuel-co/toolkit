"use client"

import { useState, useEffect } from "react"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Plus, Search, Tag, Code, Save, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface CodeSnippet {
  id: string
  title: string
  code: string
  language: string
  tags: string[]
  description: string
  createdAt: string
}

export default function CodeSnippetManagerPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [copied, setCopied] = useState(false)
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
      setSnippets(JSON.parse(saved))
    }
    setIsLoading(false)
  }, [])

  // Save snippets to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('codeSnippets', JSON.stringify(snippets))
    }
  }, [snippets, isLoading])

  // Filter snippets based on search and language
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesLanguage = selectedLanguage === "all" || snippet.language === selectedLanguage
    return matchesSearch && matchesLanguage
  })

  // Add new snippet
  const addSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) return

    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title,
      code: newSnippet.code,
      language: newSnippet.language || "javascript",
      tags: newSnippet.tags || [],
      description: newSnippet.description || "",
      createdAt: new Date().toISOString(),
    }

    setSnippets([...snippets, snippet])
    setNewSnippet({
      title: "",
      code: "",
      language: "javascript",
      tags: [],
      description: "",
    })
  }

  // Copy snippet to clipboard
  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Delete snippet
  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id))
  }

  // Add tag to new snippet
  const addTag = (tag: string) => {
    if (!tag.trim()) return
    setNewSnippet({
      ...newSnippet,
      tags: [...(newSnippet.tags || []), tag.trim()]
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Code className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Code Snippet Manager</h1>
        </div>
        <p className="text-muted-foreground">
          Store, organize, and share your code snippets. Perfect for saving reusable code, examples, and solutions.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Free to use</AlertTitle>
        <AlertDescription>
          This tool is completely free to use with no login required. Your snippets are saved locally in your browser.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Snippet</CardTitle>
              <CardDescription>Create a new code snippet with title, code, and tags.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newSnippet.title}
                  onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                  placeholder="Enter snippet title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="w-full p-2 border rounded-md"
                  value={newSnippet.language}
                  onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Textarea
                  id="code"
                  value={newSnippet.code}
                  onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                  placeholder="Enter your code here"
                  className="font-mono"
                  rows={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSnippet.description}
                  onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
                  placeholder="Describe what this code does"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tags (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newSnippet.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => {
                          setNewSnippet({
                            ...newSnippet,
                            tags: newSnippet.tags?.filter((_, i) => i !== index)
                          })
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addSnippet} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Snippet
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              className="p-2 border rounded-md"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="all">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          {isLoading ? (
            <div className="border rounded-lg p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading snippets...</p>
            </div>
          ) : filteredSnippets.length > 0 ? (
            <div className="space-y-4">
              {filteredSnippets.map((snippet) => (
                <Card key={snippet.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{snippet.title}</CardTitle>
                        <CardDescription className="mt-2">{snippet.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => copySnippet(snippet.code)}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteSnippet(snippet.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{snippet.language}</Badge>
                      {snippet.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{snippet.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery ? "No snippets found matching your search." : "No snippets saved yet. Add your first snippet!"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Tips for Using Code Snippets</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Use descriptive titles and tags to make snippets easy to find.</li>
          <li>Add comments in your code to explain complex logic.</li>
          <li>Organize snippets by language or purpose using tags.</li>
          <li>Keep snippets focused and single-purpose for better reusability.</li>
          <li>Regularly review and update your snippets to keep them current.</li>
          <li>Use the search function to quickly find relevant code.</li>
        </ul>
      </div>

      <RelatedTools currentTool="code-snippet-manager" />
    </div>
  )
} 