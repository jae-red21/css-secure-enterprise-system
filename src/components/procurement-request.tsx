"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

interface PurchaseOrder {
  id: string
  itemName: string
  vendor: string
  amount: number
  status: "Pending" | "Approved" | "Rejected"
  requestedBy: string
  requestedAt: string
  requiresApproval: boolean
}

const mockPendingApprovals: PurchaseOrder[] = [
  {
    id: "PO-1001",
    itemName: "Enterprise Software License",
    vendor: "Microsoft Corp",
    amount: 12500,
    status: "Pending",
    requestedBy: "John Smith",
    requestedAt: "2024-01-15",
    requiresApproval: true,
  },
  {
    id: "PO-1002",
    itemName: "Office Furniture Set",
    vendor: "IKEA Business",
    amount: 3200,
    status: "Pending",
    requestedBy: "Sarah Johnson",
    requestedAt: "2024-01-14",
    requiresApproval: false,
  },
  {
    id: "PO-1003",
    itemName: "Cloud Infrastructure Annual Plan",
    vendor: "AWS",
    amount: 48000,
    status: "Pending",
    requestedBy: "Mike Chen",
    requestedAt: "2024-01-13",
    requiresApproval: true,
  },
]

export function ProcurementRequest() {
  const [itemName, setItemName] = useState("")
  const [vendor, setVendor] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [pendingOrders, setPendingOrders] = useState<PurchaseOrder[]>([])
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    // Mock GET /api/procurement/pending-approvals
    setPendingOrders(mockPendingApprovals)
  }, [])

  const requiresApproval = Number.parseFloat(amount) > 5000

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock POST /api/procurement/purchase-orders
    const newOrder: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      itemName,
      vendor,
      amount: Number.parseFloat(amount),
      status: "Pending",
      requestedBy: "Current User",
      requestedAt: new Date().toISOString().split("T")[0],
      requiresApproval,
    }

    console.log("Creating purchase order:", newOrder)

    setPendingOrders([newOrder, ...pendingOrders])

    setSubmitSuccess(true)
    setTimeout(() => setSubmitSuccess(false), 3000)

    // Reset form
    setItemName("")
    setVendor("")
    setAmount("")
    setDescription("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20"
      case "Rejected":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Procurement Request & Approval</h2>
        <p className="text-muted-foreground">Submit purchase orders and track approval status</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Purchase Order Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Purchase Order</CardTitle>
            <CardDescription>Fill out the form to request a new purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input
                  id="item-name"
                  placeholder="e.g., Dell Laptop Computers"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor *</Label>
                <Input
                  id="vendor"
                  placeholder="e.g., Dell Inc."
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount ($) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional details about the purchase..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Rule-Based Validation Notice */}
              {requiresApproval && (
                <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-500 text-sm">High-Value Request</p>
                    <p className="text-sm text-amber-500/90 mt-1">
                      This purchase requires Senior Manager Approval (Amount {">"} $5,000)
                    </p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                Submit Purchase Order
              </Button>

              {submitSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-green-500 font-medium">Purchase order submitted successfully</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Pending Approvals List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Track the status of purchase order requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{order.itemName}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.vendor}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Order ID:</span>
                      <p className="font-medium text-foreground">{order.id}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium text-foreground">${order.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Requested By:</span>
                      <p className="font-medium text-foreground">{order.requestedBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium text-foreground">{order.requestedAt}</p>
                    </div>
                  </div>

                  {order.requiresApproval && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-amber-500">
                      <Clock className="w-3 h-3" />
                      <span>Awaiting senior manager approval</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProcurementRequest