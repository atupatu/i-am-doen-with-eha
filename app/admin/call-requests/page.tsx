"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Filter,
  Phone,
  Search,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  call_request_status: "pending" | "completed" | "none";
  created_at: string;
}

export default function CallRequestsPage() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchCallRequests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/callreq");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch call requests");
        }
        setUsers(data.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch call requests",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallRequests();
  }, [toast]);

  const filteredUsers = users.filter((user) => {
    if (filterStatus !== "all" && user.call_request_status !== filterStatus) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleCallClick = (user: User) => {
    setSelectedUser(user);
    setIsCallDialogOpen(true);
  };

  const markAsCompleted = async (uid: string) => {
    if (!uid || uid.trim() === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid user ID. Cannot update call request status.",
      });
      return;
    }

    try {
      setIsUpdating(uid);
      const response = await fetch(`/api/users/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ call_request_status: "completed" }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(
          responseData.error || "Failed to update call request status"
        );
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === uid
            ? { ...user, call_request_status: "completed" }
            : user
        )
      );

      toast({
        title: "Success",
        description: "Call request marked as completed",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update call request status",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handlePlaceCallAndComplete = async () => {
    if (!selectedUser?.uid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No user selected or invalid user ID.",
      });
      return;
    }

    await markAsCompleted(selectedUser.uid);
    setIsCallDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Call Requests" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Client Call Requests
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Requests
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle>Call Request List</CardTitle>
            <CardDescription>
              {filterStatus === "all"
                ? "Showing all call requests"
                : `Showing ${filterStatus} requests only`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Request Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No call requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.call_request_status === "completed"
                              ? "default"
                              : "outline"
                          }
                          className={
                            user.call_request_status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {user.call_request_status === "completed" ? (
                            <>
                              <Check className="mr-1 h-3 w-3" /> Completed
                            </>
                          ) : (
                            "Pending"
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.call_request_status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                onClick={() => handleCallClick(user)}
                                disabled={isUpdating === user.uid}
                              >
                                <Phone className="h-4 w-4" />
                                <span className="sr-only">Call client</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => markAsCompleted(user.uid)}
                                disabled={isUpdating === user.uid}
                              >
                                {isUpdating === user.uid ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  Mark as completed
                                </span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedUser && (
        <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Call Client</DialogTitle>
              <DialogDescription>
                You are about to call {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`/placeholder.svg?height=80&width=80`}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="text-xl">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.phone}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    UID: {selectedUser.uid}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCallDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 gap-2"
                onClick={handlePlaceCallAndComplete}
                disabled={isUpdating === selectedUser.uid}
              >
                {isUpdating === selectedUser.uid ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}
                Place Call & Mark Complete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}