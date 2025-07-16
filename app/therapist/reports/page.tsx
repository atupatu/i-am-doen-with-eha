import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Filter, Upload, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import ReportsList from "@/components/therapist/reports-list"
import UploadReportForm from "@/components/therapist/upload-report-form"
import { getTherapistReports } from "@/lib/therapist-data"

export const metadata: Metadata = {
  title: "Reports - Therapist Portal",
  description: "Manage client reports and documentation",
}

export default async function TherapistReportsPage() {
  const { reports, draftReports } = await getTherapistReports()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
        <p className="text-gray-600">Manage client reports and documentation</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search reports..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="bg-[#a98cc8] hover:bg-[#9678b4] flex items-center gap-1">
            <Upload className="h-4 w-4" />
            Upload Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Reports</CardTitle>
          <CardDescription>View and manage all client reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="published" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger
                value="published"
                className="rounded-l-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
              >
                Published Reports
              </TabsTrigger>
              <TabsTrigger
                value="drafts"
                className="rounded-r-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
              >
                Draft Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="published" className="space-y-4">
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <ReportsList reports={reports} />
              </Suspense>
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <ReportsList reports={draftReports} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-[#a98cc8]" />
            Upload New Report
          </CardTitle>
          <CardDescription>Create and upload a new client report</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadReportForm />
        </CardContent>
      </Card>
    </div>
  )
}
