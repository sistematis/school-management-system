"use client";

import { useState } from "react";

import {
  AlertCircle,
  Calendar,
  DollarSign,
  Download,
  Filter,
  MapPin,
  MoreVertical,
  Package,
  Plus,
  Search,
  Settings,
  User,
  Wrench,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock assets data
const mockAssets = [
  {
    id: "AST-2024-001",
    name: "Dell OptiPlex Desktop Computer",
    category: "Electronics",
    type: "electronic" as const,
    description: "High-performance desktop computer for computer lab",
    serialNumber: "DELL-OP-2024-001",
    model: "OptiPlex 7090",
    manufacturer: "Dell Inc.",
    purchaseDate: "2024-08-15",
    purchasePrice: 12000000,
    currentValue: 10000000,
    condition: "excellent" as const,
    location: "Computer Lab A",
    assignedTo: "Computer Lab",
    assignedToName: "Computer Lab",
    warranty: {
      provider: "Dell Warranty Services",
      expiryDate: "2027-08-15",
      coverage: "Parts and Labor",
    },
  },
  {
    id: "AST-2024-015",
    name: "HP LaserJet Pro Printer",
    category: "Electronics",
    type: "electronic" as const,
    description: "Network printer for administration office",
    serialNumber: "HP-LJ-2024-015",
    model: "LaserJet Pro M404dn",
    manufacturer: "HP Inc.",
    purchaseDate: "2024-09-10",
    purchasePrice: 4500000,
    currentValue: 3800000,
    condition: "good" as const,
    location: "Admin Office",
    assignedTo: "Administration",
    assignedToName: "Administration",
    warranty: {
      provider: "HP Indonesia",
      expiryDate: "2026-09-10",
      coverage: "On-site Service",
    },
  },
  {
    id: "AST-2023-089",
    name: "Student Desk & Chair Set",
    category: "Furniture",
    type: "furniture" as const,
    description: "Ergonomic student desk with chair",
    serialNumber: "FURN-2023-089",
    model: "Student-Ergo-200",
    manufacturer: "EduFurniture Co.",
    purchaseDate: "2023-07-01",
    purchasePrice: 1500000,
    currentValue: 1200000,
    condition: "good" as const,
    location: "Classroom 10-A",
    assignedTo: "Classroom 10-A",
    assignedToName: "Classroom 10-A",
  },
  {
    id: "AST-2024-045",
    name: "Epson Projector EB-2250U",
    category: "Electronics",
    type: "electronic" as const,
    description: "High-brightness projector for presentations",
    serialNumber: "EPS-EB-2024-045",
    model: "EB-2250U",
    manufacturer: "Epson Indonesia",
    purchaseDate: "2024-10-20",
    purchasePrice: 8500000,
    currentValue: 8000000,
    condition: "excellent" as const,
    location: "Auditorium",
    assignedTo: "Audio Visual Team",
    assignedToName: "Audio Visual Team",
    warranty: {
      provider: "Epson Indonesia",
      expiryDate: "2027-10-20",
      coverage: "Projector Warranty",
    },
  },
  {
    id: "AST-2024-032",
    name: "Chemistry Lab Equipment Set",
    category: "Equipment",
    type: "other" as const,
    description: "Complete chemistry laboratory equipment set",
    serialNumber: "CHEM-LAB-2024-032",
    model: "ChemSet-Pro",
    manufacturer: "LabTech Solutions",
    purchaseDate: "2024-06-15",
    purchasePrice: 25000000,
    currentValue: 23000000,
    condition: "excellent" as const,
    location: "Chemistry Lab",
    assignedTo: "Science Department",
    assignedToName: "Science Department",
  },
  {
    id: "AST-2023-112",
    name: 'Whiteboard Interactive 85"',
    category: "Electronics",
    type: "electronic" as const,
    description: "Interactive smart whiteboard with touch display",
    serialNumber: "SMART-2023-112",
    model: "Interactive-85",
    manufacturer: "SmartTech Inc.",
    purchaseDate: "2023-08-30",
    purchasePrice: 15000000,
    currentValue: 11000000,
    condition: "fair" as const,
    location: "Room 201",
    assignedTo: "Mathematics Department",
    assignedToName: "Mathematics Department",
    warranty: {
      provider: "SmartTech Inc.",
      expiryDate: "2024-08-30",
      coverage: "Limited Warranty",
    },
  },
];

type AssetCondition = "excellent" | "good" | "fair" | "poor" | "needs repair" | "retired";
type AssetCategory = "Electronics" | "Furniture" | "Equipment" | "Vehicles" | "Other";

const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

const getConditionColor = (condition: AssetCondition) => {
  switch (condition) {
    case "excellent":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "good":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "fair":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "poor":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "needs repair":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "retired":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const _getCategoryColor = (category: AssetCategory) => {
  switch (category) {
    case "Electronics":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "Furniture":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    case "Equipment":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
    case "Vehicles":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    case "Other":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWarrantyStatus = (expiryDate: string | undefined) => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return { status: "Expired", color: "text-red-600" };
  if (daysUntilExpiry < 30) return { status: "Expiring Soon", color: "text-orange-600" };
  return { status: "Valid", color: "text-green-600" };
};

const stats = [
  { label: "Total Assets", value: "6", icon: Package, color: "text-blue-600" },
  { label: "Electronics", value: "4", icon: Settings, color: "text-purple-600" },
  { label: "Needs Repair", value: "0", icon: Wrench, color: "text-orange-600" },
  { label: "Total Value", value: "Rp 66.500.000", icon: DollarSign, color: "text-green-600" },
];

export default function AssetManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [conditionFilter, _setConditionFilter] = useState<string>("all");

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter;
    const matchesCondition = conditionFilter === "all" || asset.condition === conditionFilter;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Asset Management</h1>
          <p className="mt-2 text-muted-foreground">Inventory of school property and equipment</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Add Asset
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
            <p className="font-bold text-3xl">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by asset name, ID, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Vehicles">Vehicles</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredAssets.length === 0 ? (
          <Card className="col-span-3 p-12">
            <div className="flex flex-col items-center justify-center">
              <Package className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="font-semibold text-lg">No assets found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search query</p>
            </div>
          </Card>
        ) : (
          filteredAssets.map((asset) => {
            const warrantyStatus = getWarrantyStatus(asset.warranty?.expiryDate);
            return (
              <Card key={asset.id} className="p-4 transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-start gap-3">
                  <Avatar className="h-12 w-12 bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-xs">{asset.id}</p>
                    <h4 className="truncate font-semibold">{asset.name}</h4>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{asset.location}</span>
                  </div>
                  {asset.assignedTo && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Assigned to: {asset.assignedToName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Purchase Date</span>
                    <span className="font-medium">{formatDate(asset.purchaseDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Value</span>
                    <span className="font-medium">{formatCurrency(asset.currentValue)}</span>
                  </div>
                  {asset.warranty && (
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>Warranty: </span>
                      {warrantyStatus ? (
                        <span className={warrantyStatus.color}>
                          {warrantyStatus.status} until {formatDate(asset.warranty.expiryDate)}
                        </span>
                      ) : (
                        <span>Valid until {formatDate(asset.warranty.expiryDate)}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge className={getConditionColor(asset.condition)}>
                    {asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Quick Actions</h3>
            <p className="text-muted-foreground text-sm">Common asset management operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Package className="h-4 w-4" />
              Audit Assets
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Wrench className="h-4 w-4" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-orange-600 hover:text-orange-700">
              <AlertCircle className="h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
