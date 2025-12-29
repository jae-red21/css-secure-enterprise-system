"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Share2, User, Clock } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
}

interface AccessLog {
  id: string
  userId: string
  userName: string
  permission: string
  grantedAt: string
  action: string
}

const mockItems: InventoryItem[] = [
  { id: "1", name: "Dell Latitude 7420", category: "Laptop" },
  { id: "2", name: 'MacBook Pro 16"', category: "Laptop" },
  { id: "3", name: "Cisco Router 2900", category: "Network" },
  { id: "4", name: "Annual Revenue Report", category: "Document" },
]

const mockAccessLogs: { [key: string]: AccessLog[] } = {
  "1": [
    {
      id: "log1",
      userId: "user123",
      userName: "John Smith",
      permission: "Read",
      grantedAt: "2024-01-15 10:30",
      action: "Viewed item",
    },
    {
      id: "log2",
      userId: "user456",
      userName: "Sarah Johnson",
      permission: "Write",
      grantedAt: "2024-01-14 14:20",
      action: "Updated quantity",
    },
  ],
  "2": [
    {
      id: "log3",
      userId: "user789",
      userName: "Mike Chen",
      permission: "Manage",
      grantedAt: "2024-01-13 09:15",
      action: "Granted access to user234",
    },
  ],
  "3": [],
  "4": [
    {
      id: "log4",
      userId: "user234",
      userName: "Emily Davis",
      permission: "Read",
      grantedAt: "2024-01-16 16:45",
      action: "Downloaded document",
    },
  ],
}

export function ResourceManagement() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [userId, setUserId] = useState("")
  const [permission, setPermission] = useState<"Read" | "Write" | "Manage">("Read")
  const [shareSuccess, setShareSuccess] = useState(false)

  const handleShare = (itemId: string) => {
    if (!userId) return

    // Mock POST /api/inventory/share
    console.log(`Sharing item ${itemId} with user ${userId} - Permission: ${permission}`)

    const newLog: AccessLog = {
      id: `log-${Date.now()}`,
      userId: userId,
      userName: `User ${userId}`,
      permission: permission,
      grantedAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      action: "Access granted",
    }

    setAccessLogs([newLog, ...accessLogs])

    setShareSuccess(true)
    setTimeout(() => setShareSuccess(false), 3000)
    setUserId("")
  }

  const loadAccessLogs = (itemId: string) => {
    // Mock GET /api/inventory/permissions-log/{item_id}
    setAccessLogs(mockAccessLogs[itemId] || [])
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Resource Management & Sharing</h2>
        <p className="text-muted-foreground">Manage discretionary access control for inventory items</p>
      </div>

      <div className="grid gap-4">
        {mockItems.map((item) => (
          <Card key={item.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">Category: {item.category}</p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedItem(item.id)
                        loadAccessLogs(item.id)
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Permission Manager</DialogTitle>
                      <DialogDescription>
                        Grant access permissions for: <strong>{item.name}</strong>
                      </DialogDescription>
                    </DialogHeader>

                    {/* Permission Grant Form */}
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-id">User ID</Label>
                        <Input
                          id="user-id"
                          placeholder="Enter user ID (e.g., user123)"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="permission">Permission Level</Label>
                        <Select value={permission} onValueChange={(value: any) => setPermission(value)}>
                          <SelectTrigger id="permission">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Read">Read - View only access</SelectItem>
                            <SelectItem value="Write">Write - Edit and update access</SelectItem>
                            <SelectItem value="Manage">Manage - Full control including sharing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={() => handleShare(item.id)} className="w-full" disabled={!userId}>
                        Grant Access
                      </Button>

                      {shareSuccess && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                          <p className="text-sm text-green-500 font-medium">✓ Access granted successfully</p>
                        </div>
                      )}
                    </div>

                    {/* Access Logs */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Access Logs
                      </h4>

                      {accessLogs.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No access logs available</p>
                      ) : (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {accessLogs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-md text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-foreground">{log.userName}</p>
                                  <p className="text-muted-foreground text-xs">{log.action}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline">{log.permission}</Badge>
                                <p className="text-xs text-muted-foreground mt-1">{log.grantedAt}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ResourceManagement