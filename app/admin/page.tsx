"use client"

import { useState } from "react"
import { ArrowUpRight, Calendar, CreditCard, DollarSign, Phone, Users } from "lucide-react"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Revenue data for the revenue chart
const revenueData = [
  { name: "Jan", revenue: 4000, expenses: 2400 },
  { name: "Feb", revenue: 3000, expenses: 1398 },
  { name: "Mar", revenue: 9800, expenses: 2000 },
  { name: "Apr", revenue: 3908, expenses: 2780 },
  { name: "May", revenue: 4800, expenses: 1890 },
  { name: "Jun", revenue: 3800, expenses: 2390 },
  { name: "Jul", revenue: 5000, expenses: 3490 },
]

// Session data for the sessions chart
const sessionData = [
  { name: "Mon", sessions: 12 },
  { name: "Tue", sessions: 18 },
  { name: "Wed", sessions: 15 },
  { name: "Thu", sessions: 20 },
  { name: "Fri", sessions: 25 },
  { name: "Sat", sessions: 10 },
  { name: "Sun", sessions: 5 },
]

// Client data for the client growth chart
const clientData = [
  { name: "Jan", active: 40, new: 24 },
  { name: "Feb", active: 30, new: 13 },
  { name: "Mar", active: 45, new: 20 },
  { name: "Apr", active: 50, new: 27 },
  { name: "May", active: 55, new: 18 },
  { name: "Jun", active: 60, new: 23 },
  { name: "Jul", active: 65, new: 34 },
]

// Session type data for the pie chart
const sessionTypeData = [
  { name: "Individual", value: 65, color: "#a98cc8" },
  { name: "Group", value: 15, color: "#82ca9d" },
  { name: "Family", value: 10, color: "#8884d8" },
  { name: "Couples", value: 10, color: "#ffc658" },
]

// Call requests data
const callRequestsData = [
  {
    id: "CR-1001",
    client: {
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "pending",
    requestTime: "10:30 AM",
    reason: "Discuss therapy progress",
    timeAgo: "5 min ago",
  },
  {
    id: "CR-1002",
    client: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "scheduled",
    requestTime: "2:15 PM",
    reason: "Billing question",
    timeAgo: "15 min ago",
  },
  {
    id: "CR-1003",
    client: {
      name: "Grace Lee",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "completed",
    requestTime: "11:45 AM",
    reason: "Schedule change request",
    timeAgo: "30 min ago",
  },
  {
    id: "CR-1004",
    client: {
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "pending",
    requestTime: "10:20 AM",
    reason: "New session inquiry",
    timeAgo: "45 min ago",
  },
]

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

export default function AdminDashboard() {
  const [period, setPeriod] = useState("weekly")

  return (
    <div className="h-full flex flex-col bg-[#fef6f9]/30">
      <AdminHeader title="Dashboard" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-[#a98cc8]">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="weekly" className="w-[300px]" onValueChange={setPeriod}>
              <TabsList className="bg-[#f5e8f2]">
                <TabsTrigger value="daily" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="yearly" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
                  Yearly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-t-4 border-t-[#a98cc8] shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#fef6f9]/50">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#a98cc8]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-[#a98cc8] shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#fef6f9]/50">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-[#a98cc8]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+12.4% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-[#a98cc8] shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#fef6f9]/50">
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-[#a98cc8]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+1,234</div>
              <p className="text-xs text-muted-foreground">+19.2% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-[#a98cc8] shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#fef6f9]/50">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-[#a98cc8]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$6,354.12</div>
              <p className="text-xs text-muted-foreground">-4.5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 shadow-md">
            <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
              <CardTitle className="text-[#a98cc8]">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{
                      top: 10,
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
                      activeDot={{ r: 8 }}
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
          <Card className="col-span-3 shadow-md">
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
                        <Cell key={`cell-${index}`} fill={entry.color} />
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3 shadow-md">
            <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
              <CardTitle className="text-[#a98cc8]">Weekly Sessions</CardTitle>
              <CardDescription>Number of sessions conducted this week</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionData}>
                    <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a98cc8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#a98cc8" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="sessions"
                      name="Sessions"
                      fill="url(#colorSessions)"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-4 shadow-md">
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
        </div>

        {/* Call Requests Section */}
        <Card className="shadow-md">
          <CardHeader className="bg-[#fef6f9]/50 border-b border-[#a98cc8]/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#a98cc8]">Recent Call Requests</CardTitle>
                <CardDescription>Latest client call requests</CardDescription>
              </div>
              <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
                <Phone className="mr-2 h-4 w-4" />
                View All Requests
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {callRequestsData.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-[#fef6f9]/30"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.client.avatar || "/placeholder.svg"} alt={request.client.name} />
                      <AvatarFallback>
                        {request.client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{request.client.name}</div>
                      <div className="text-sm text-muted-foreground">{request.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{request.requestTime}</div>
                      <div className="text-xs text-muted-foreground">{request.timeAgo}</div>
                    </div>
                    <Badge
                      variant={
                        request.status === "completed"
                          ? "default"
                          : request.status === "pending"
                            ? "outline"
                            : "secondary"
                      }
                      className={
                        request.status === "completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                    {request.status === "pending" && (
                      <Button size="sm" className="bg-[#a98cc8] hover:bg-[#9678b4]">
                        <Phone className="h-3 w-3 mr-1" /> Call
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" className="gap-1 text-[#a98cc8] hover:bg-[#fef6f9] hover:text-[#8a6da7]">
                View all call requests
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
