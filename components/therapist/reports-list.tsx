"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Download, Edit, Eye, Calendar, User } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface ReportProps {
  id: number
  title: string
  clientName: string
  clientId: number
  date: string
  type: "session" | "progress" | "assessment" | "treatment"
  status: "draft" | "published"
  content: string
  fileUrl?: string
}

interface ReportsListProps {
  reports: ReportProps[]
}

export default function ReportsList({ reports }: ReportsListProps) {
  const [selectedReport, setSelectedReport] = useState<ReportProps | null>(null)
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false)

  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reports found</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
            <div className="bg-[#fef6f9] p-3 rounded-full">
              <FileText className="h-5 w-5 text-[#a98cc8]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{report.title}</h4>
                <Badge
                  variant={report.status === "published" ? "default" : "outline"}
                  className={report.status === "published" ? "bg-green-500" : "border-yellow-500 text-yellow-500"}
                >
                  {report.status}
                </Badge>
                <Badge variant="outline" className="border-[#a98cc8] text-[#a98cc8]">
                  {report.type}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{report.clientName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(report.date)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-[#a98cc8] border-[#a98cc8] hover:bg-[#a98cc8]/10"
                onClick={() => {
                  setSelectedReport(report)
                  setReportDetailsOpen(true)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {report.status === "draft" && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                  asChild
                >
                  <a href={`/therapist/reports/${report.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {report.fileUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
                  asChild
                >
                  <a href={report.fileUrl} download>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog open={reportDetailsOpen} onOpenChange={setReportDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedReport.title}</DialogTitle>
              <DialogDescription>
                {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)} report for{" "}
                {selectedReport.clientName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedReport.date)}</span>
                </div>
                <Badge
                  variant={selectedReport.status === "published" ? "default" : "outline"}
                  className={
                    selectedReport.status === "published" ? "bg-green-500" : "border-yellow-500 text-yellow-500"
                  }
                >
                  {selectedReport.status}
                </Badge>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
                <p className="whitespace-pre-line">{selectedReport.content}</p>
              </div>

              <div className="flex justify-end gap-2">
                {selectedReport.status === "draft" && (
                  <Button variant="outline" asChild>
                    <a href={`/therapist/reports/${selectedReport.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Report
                    </a>
                  </Button>
                )}
                {selectedReport.fileUrl && (
                  <Button variant="outline" asChild>
                    <a href={selectedReport.fileUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                )}
                <Button className="bg-[#a98cc8] hover:bg-[#9678b4]" asChild>
                  <a href={`/therapist/clients/${selectedReport.clientId}`}>View Client</a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
