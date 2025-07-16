"use client"

import { useState } from "react"
import { Calendar, Download } from "lucide-react"
import { AdminHeader } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  Legend,
  CartesianGrid,
  RadialBar,
  RadialBarChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

// Mock data for statistics
const sessionData = [
  { name: "Week 1", sessions: 45 },
  { name: "Week 2", sessions: 52 },
  { name: "Week 3", sessions: 48 },
  { name: "Week 4", sessions: 61 },
  { name: "Week 5", sessions: 55 },
]

const clientData = [
  { name: "Week 1", active: 120, new: 15 },
  { name: "Week 2", active: 125, new: 12 },
  { name: "Week 3", active: 130, new: 18 },
  { name: "Week 4", active: 140, new: 22 },
  { name: "Week 5", active: 150, new: 20 },
]

const revenueData = [
  { name: "Week 1", revenue: 5400, expenses: 3200 },
  { name: "Week 2", revenue: 6240, expenses: 3500 },
  { name: "Week 3", revenue: 5760, expenses: 3300 },
  { name: "Week 4", revenue: 7320, expenses: 3800 },
  { name: "Week 5", revenue: 6600, expenses: 3600 },
]

const therapistEarningsData = [
  { name: "Dr. Sarah Williams", earnings: 4500 },
  { name: "Dr. Michael Brown", earnings: 3600 },
  { name: "Dr. James Taylor", earnings: 3000 },
  { name: "Dr. Emily Johnson", earnings: 2400 },
  { name: "Dr. Robert Davis", earnings: 4200 },
]

const sessionTypeData = [
  { name: "Individual", value: 65 },
  { name: "Group", value: 15 },
  { name: "Family", value: 10 },
  { name: "Couples", value: 10 },
]

const therapistPerformanceData = [
  {
    subject: "Client Satisfaction",
    "Dr. Sarah Williams": 90,
    "Dr. Michael Brown": 85,
    "Dr. James Taylor": 88,
    fullMark: 100,
  },
  {
    subject: "Session Completion",
    "Dr. Sarah Williams": 95,
    "Dr. Michael Brown": 92,
    "Dr. James Taylor": 90,
    fullMark: 100,
  },
  {
    subject: "Documentation",
    "Dr. Sarah Williams": 85,
    "Dr. Michael Brown": 90,
    "Dr. James Taylor": 88,
    fullMark: 100,
  },
  {
    subject: "Client Progress",
    "Dr. Sarah Williams": 88,
    "Dr. Michael Brown": 82,
    "Dr. James Taylor": 85,
    fullMark: 100,
  },
  {
    subject: "Punctuality",
    "Dr. Sarah Williams": 92,
    "Dr. Michael Brown": 95,
    "Dr. James Taylor": 90,
    fullMark: 100,
  },
]

const clientRetentionData = [
  { name: "0-3 months", value: 20 },
  { name: "3-6 months", value: 25 },
  { name: "6-12 months", value: 35 },
  { name: "1-2 years", value: 15 },
  { name: "2+ years", value: 5 },
]

const COLORS = ["#a98cc8", "#82ca9d", "#8884d8", "#ffc658", "#ff8042"]

// Define the proper types for the tooltip props
interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      dataKey?: string;
      name?: string;
      value?: number | string;
      color?: string;
    }>;
    label?: string;
  }
  
  // Updated CustomTooltip with proper React TypeScript types
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps): React.ReactElement | null => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <div className="font-medium">{label}</div>
          {payload.map((entry, index) => {
            const dataKey = entry.dataKey || "value";
            return (
              <div key={`item-${index}`} className="flex items-center text-sm">
                <span 
                  className="mr-1 h-2 w-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span>
                  {entry.name}: {["revenue", "expenses"].includes(dataKey) ? "$" : ""}
                  {entry.value}
                  {dataKey === "sessions" ? " sessions" : ""}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

export default function StatisticsPage() {
  const [period, setPeriod] = useState("weekly")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="h-full flex flex-col bg-[#fef6f9]/30">
      <AdminHeader title="Statistics & Reports" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-[#a98cc8]">Statistics</h2>
          <div className="flex items-center gap-2">
            <Select defaultValue={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px] border-[#a98cc8]/30">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 border-[#a98cc8]/30">
              <Calendar className="h-4 w-4 text-[#a98cc8]" />
              Date Range
            </Button>
            <Button variant="outline" className="gap-2 border-[#a98cc8]/30">
              <Download className="h-4 w-4 text-[#a98cc8]" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-[#f5e8f2]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
              Clients
            </TabsTrigger>
            <TabsTrigger value="finances" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
              Finances
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-t-4 border-t-[#a98cc8] shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#fef6f9]/50">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">261</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-[#a98cc8] shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#fef6f9]/50">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">150</div>
                  <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-[#a98cc8] shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#fef6f9]/50">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$31,320.00</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-[#a98cc8] shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#fef6f9]/50">
                  <CardTitle className="text-sm font-medium">Therapist Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$17,700.00</div>
                  <p className="text-xs text-muted-foreground">+10.8% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="shadow-md">
                <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                  <CardTitle className="text-[#a98cc8]">Sessions Overview</CardTitle>
                  <CardDescription>Number of sessions conducted per week</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sessionData}>
                        <defs>
                          <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a98cc8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a98cc8" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="sessions" name="Sessions" fill="url(#colorSessions)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                  <CardTitle className="text-[#a98cc8]">Revenue Overview</CardTitle>
                  <CardDescription>Revenue and expenses per week</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a98cc8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a98cc8" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke="#a98cc8"
                          fill="url(#colorRevenue)"
                        />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          name="Expenses"
                          stroke="#82ca9d"
                          fill="url(#colorExpenses)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="shadow-md">
                <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                  <CardTitle className="text-[#a98cc8]">Sessions by Week</CardTitle>
                  <CardDescription>Number of sessions conducted per week</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sessionData}>
                        <defs>
                          <linearGradient id="colorSessionLine" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a98cc8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a98cc8" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sessions"
                          name="Sessions"
                          stroke="#a98cc8"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#a98cc8" }}
                          activeDot={{ r: 6, fill: "#a98cc8" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                  <CardTitle className="text-[#a98cc8]">Session Types</CardTitle>
                  <CardDescription>Distribution of session types</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sessionTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {sessionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="shadow-md">
              <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                <CardTitle className="text-[#a98cc8]">Therapist Performance</CardTitle>
                <CardDescription>Performance metrics for top therapists</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} width={730} height={400} data={therapistPerformanceData}>
                      <PolarGrid stroke="#e0e0e0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#666" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Dr. Sarah Williams"
                        dataKey="Dr. Sarah Williams"
                        stroke="#a98cc8"
                        fill="#a98cc8"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Dr. Michael Brown"
                        dataKey="Dr. Michael Brown"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Dr. James Taylor"
                        dataKey="Dr. James Taylor"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.5}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="shadow-md">
                <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                  <CardTitle className="text-[#a98cc8]">Client Growth</CardTitle>
                  <CardDescription>Active and new clients over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={clientData}>
                        <defs>
                          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a98cc8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a98cc8" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="active"
                          name="Active Clients"
                          stroke="#a98cc8"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#a98cc8" }}
                          activeDot={{ r: 6, fill: "#a98cc8" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="new"
                          name="New Clients"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#82ca9d" }}
                          activeDot={{ r: 6, fill: "#82ca9d" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                  <CardTitle className="text-[#a98cc8]">Client Retention</CardTitle>
                  <CardDescription>Client retention by duration</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="20%"
                        outerRadius="80%"
                        barSize={20}
                        data={clientRetentionData}
                      >
                        <RadialBar
                          minAngle={15}
                          label={{ position: "insideStart", fill: "#fff" }}
                          background
                          clockWise
                          dataKey="value"
                        >
                          {clientRetentionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </RadialBar>
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                        <Tooltip />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="shadow-md">
              <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                <CardTitle className="text-[#a98cc8]">Client Demographics</CardTitle>
                <CardDescription>Age distribution of clients</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { age: "60-65", count: 35 },
                        { age: "65-70", count: 45 },
                        { age: "70-75", count: 40 },
                        { age: "75-80", count: 25 },
                        { age: "80-85", count: 15 },
                        { age: "85+", count: 10 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a98cc8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#a98cc8" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="count" name="Clients" fill="url(#colorAge)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finances" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="shadow-md">
                <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                  <CardTitle className="text-[#a98cc8]">Revenue & Expenses</CardTitle>
                  <CardDescription>Revenue and expenses over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient id="colorRevFinance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a98cc8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a98cc8" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="colorExpFinance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke="#a98cc8"
                          fill="url(#colorRevFinance)"
                        />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          name="Expenses"
                          stroke="#82ca9d"
                          fill="url(#colorExpFinance)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
                  <CardTitle className="text-[#a98cc8]">Therapist Earnings</CardTitle>
                  <CardDescription>Earnings by therapist</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={therapistEarningsData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="5%" stopColor="#a98cc8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a98cc8" stopOpacity={0.4} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="earnings" name="Earnings" fill="url(#colorEarnings)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
