"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Laptop, DollarSign, Edit, Trash2 } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  sensitivity: "Confidential" | "Internal" | "Public"
  department: string
  lastUpdated: string
}

const mockInventoryData: InventoryItem[] = [
  {
    id: "1",
    name: "Dell Latitude 7420",
    category: "Laptop",
    quantity: 25,
    sensitivity: "Internal",
    department: "IT",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: 'MacBook Pro 16"',
    category: "Laptop",
    quantity: 15,
    sensitivity: "Internal",
    department: "IT",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    name: "Cisco Router 2900",
    category: "Network",
    quantity: 8,
    sensitivity: "Confidential",
    department: "IT",
    lastUpdated: "2024-01-10",
  },
  {
    id: "4",
    name: "Office Supplies Budget",
    category: "Budget",
    quantity: 1,
    sensitivity: "Internal",
    department: "Finance",
    lastUpdated: "2024-01-12",
  },
  {
    id: "5",
    name: "Annual Revenue Report",
    category: "Document",
    quantity: 1,
    sensitivity: "Confidential",
    department: "Finance",
    lastUpdated: "2024-01-08",
  },
  {
    id: "6",
    name: "Marketing Campaign Fund",
    category: "Budget",
    quantity: 1,
    sensitivity: "Internal",
    department: "Finance",
    lastUpdated: "2024-01-05",
  },
]

function InventoryDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [department, setDepartment] = useState<"IT" | "Finance">("IT")
  const [afterHours, setAfterHours] = useState(false)

  useEffect(() => {
    // Mock API call
    const filteredItems = mockInventoryData.filter((item) => item.department === department)
    setItems(filteredItems)
  }, [department])

  const handleEdit = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      const newName = prompt("Edit item name:", item.name)
      if (newName && newName.trim()) {
        setItems(items.map((i) => (i.id === itemId ? { ...i, name: newName } : i)))
      }
    }
  }

  const handleDelete = (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((i) => i.id !== itemId))
    }
  }

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case "Confidential":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
      case "Internal":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20"
      case "Public":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Adaptive Inventory Dashboard</h2>
        <p className="text-muted-foreground">View and manage inventory items with role-based access controls</p>
      </div>

      {/* ABAC & RuBAC Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Access Control Settings</CardTitle>
          <CardDescription>Configure department filter and working hours simulation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* ABAC: Department Filter */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="department-toggle" className="text-sm font-medium">
                Department Filter:
              </Label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${department === "IT" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                >
                  IT
                </span>
                <Switch
                  id="department-toggle"
                  checked={department === "Finance"}
                  onCheckedChange={(checked) => setDepartment(checked ? "Finance" : "IT")}
                />
                <span
                  className={`text-sm ${department === "Finance" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                >
                  Finance
                </span>
              </div>
            </div>

            {/* RuBAC: After Hours Simulation */}
            <div className="flex items-center space-x-4">
              <Checkbox
                id="after-hours"
                checked={afterHours}
                onCheckedChange={(checked) => setAfterHours(checked as boolean)}
              />
              <Label htmlFor="after-hours" className="text-sm font-medium cursor-pointer">
                Simulate After Hours (Read-Only Mode)
              </Label>
            </div>
          </div>

          {afterHours && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
              <p className="text-sm text-amber-500 font-medium">
                🔒 Read-Only Mode Active: Editing is disabled outside working hours
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Items Grid */}
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {department === "IT" ? (
                      <Laptop className="w-6 h-6 text-primary" />
                    ) : (
                      <DollarSign className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                      <Badge className={getSensitivityColor(item.sensitivity)}>{item.sensitivity}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="font-medium text-foreground">{item.category}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <p className="font-medium text-foreground">{item.quantity}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Department:</span>
                        <p className="font-medium text-foreground">{item.department}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Updated:</span>
                        <p className="font-medium text-foreground">{item.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!afterHours && (
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default InventoryDashboard