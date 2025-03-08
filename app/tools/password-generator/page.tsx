"use client"

import { useState } from "react"
import { ToolResult } from "@/components/tool-result"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Key, Check, Copy } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState<string>("")
  const [length, setLength] = useState<number>(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })

  const generatePassword = () => {
    const charset = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    }

    let characters = ""
    if (options.uppercase) characters += charset.uppercase
    if (options.lowercase) characters += charset.lowercase
    if (options.numbers) characters += charset.numbers
    if (options.symbols) characters += charset.symbols

    if (characters === "") {
      toast.error("Please select at least one character type")
      return
    }

    let result = ""
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    setPassword(result)
    toast.success("Password generated successfully!")
  }

  const handleCopy = async () => {
    if (!password) {
      toast.error("Generate a password first")
      return
    }

    try {
      await navigator.clipboard.writeText(password)
      toast.success("Password copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy password")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Key className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Password Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate strong, secure passwords with customizable options. Perfect for creating unique passwords for your accounts.
        </p>
      </div>

      <Alert>
        <Check className="h-4 w-4" />
        <AlertTitle>Secure Generation</AlertTitle>
        <AlertDescription>
          All passwords are generated locally in your browser. Nothing is stored or transmitted over the internet.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Password Length</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Length: {length} characters</Label>
              </div>
              <Slider
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                min={8}
                max={32}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Character Types</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, uppercase: checked === true }))
                  }
                />
                <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, lowercase: checked === true }))
                  }
                />
                <Label htmlFor="lowercase">Lowercase (a-z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, numbers: checked === true }))
                  }
                />
                <Label htmlFor="numbers">Numbers (0-9)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, symbols: checked === true }))
                  }
                />
                <Label htmlFor="symbols">Symbols (!@#$...)</Label>
              </div>
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full">
            Generate Password
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Result</h2>
          {password ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg font-mono break-all">
                {password}
              </div>
              <Button onClick={handleCopy} className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Click "Generate Password" to create a new password.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to use</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Adjust the password length using the slider (8-32 characters)</li>
          <li>Select the types of characters to include</li>
          <li>Click "Generate Password" to create a new password</li>
          <li>Click "Copy to Clipboard" to copy the generated password</li>
          <li>Generate as many passwords as you need</li>
        </ol>
      </div>

      <RelatedTools currentTool="password-generator" />
    </div>
  )
}