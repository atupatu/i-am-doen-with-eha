"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { uploadReport } from "@/lib/therapist-actions"

interface UploadReportFormProps {
  appointmentId?: number
  clientName?: string
  onSuccess?: () => void
}

export default function UploadReportForm({ appointmentId, clientName, onSuccess }: UploadReportFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [reportType, setReportType] = useState("session")
  const [isDraft, setIsDraft] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      await uploadReport({
        appointmentId,
        title,
        content,
        reportType,
        isDraft,
        file,
      })

      // Reset form
      setTitle("")
      setContent("")
      setReportType("session")
      setIsDraft(false)
      setFile(null)

      // Call success callback
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error uploading report:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Report Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Session Report - ${clientName || "Client"}`}
          className="rounded-xl"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="report-type" className="rounded-xl">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="session">Session Report</SelectItem>
              <SelectItem value="progress">Progress Report</SelectItem>
              <SelectItem value="assessment">Assessment Report</SelectItem>
              <SelectItem value="treatment">Treatment Plan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Attach File (Optional)</Label>
          <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Report Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the report content here..."
          className="rounded-xl min-h-[200px]"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="draft" checked={isDraft} onCheckedChange={setIsDraft} />
        <Label htmlFor="draft">Save as draft</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4]" disabled={isUploading}>
          {isUploading ? "Uploading..." : isDraft ? "Save Draft" : "Upload Report"}
        </Button>
      </div>
    </form>
  )
}
