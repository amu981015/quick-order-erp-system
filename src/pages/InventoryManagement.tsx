
import React, { useState } from "react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell, TableFooter 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inventoryItems } from "@/data/mockData";
import { 
  Plus, FileDown, Package, Search, Filter, 
  AlertTriangle, ArrowDown, ArrowUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InventoryManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [stockWarningFilter, setStockWarningFilter] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Unique categories
  const categories = [...new Set(inventoryItems.map(item => item.category))];

  // Filter and sort inventory items
  const filteredItems = [...inventoryItems]
    .filter(item => {
      // Filter by search query
      if (searchQuery) {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(item => {
      // Filter by category
      if (categoryFilter) {
        return item.category === categoryFilter;
      }
      return true;
    })
    .filter(item => {
      // Filter by stock warning
      if (stockWarningFilter) {
        return item.quantity <= item.threshold;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === "quantity") {
        return sortDirection === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity;
      } else if (sortField === "cost") {
        return sortDirection === "asc" ? a.cost - b.cost : b.cost - a.cost;
      }
      return 0;
    });

  // Low stock items
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.threshold);

  // Total inventory value
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  // Handle add inventory
  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "庫存已新增",
      description: "新庫存項目已成功新增",
    });
  };

  // Handle restock
  const handleRestock = (itemId: number) => {
    toast({
      title: "庫存入庫",
      description: `項目ID #${itemId} 的庫存已更新`,
    });
  };

  return (
    <Page
      title="庫存管理"
      subtitle="管理所有庫存和消耗品"
      action={
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                新增庫存
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增庫存項目</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddInventory} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">項目名稱</Label>
                  <Input id="item-name" placeholder="輸入庫存項目名稱" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-category">類別</Label>
                  <Select>
                    <SelectTrigger id="item-category">
                      <SelectValue placeholder="選擇類別" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-quantity">數量</Label>
                    <Input id="item-quantity" type="number" placeholder="輸入數量" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-unit">單位</Label>
                    <Input id="item-unit" placeholder="例如：公斤、個" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-cost">單價 (NT$)</Label>
                    <Input id="item-cost" type="number" placeholder="輸入單價" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-threshold">警戒值</Label>
                    <Input id="item-threshold" type="number" placeholder="低於此值發出警告" />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="submit">新增項目</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            匯出
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">庫存清單</TabsTrigger>
          <TabsTrigger value="low-stock">庫存警告</TabsTrigger>
          <TabsTrigger value="history">入庫記錄</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-0 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">總庫存項目</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryItems.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">庫存總價值</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">NT$ {totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">低庫存警告</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">{lowStockItems.length}</div>
                  {lowStockItems.length > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      需要補貨
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋項目..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={categoryFilter || ""}
              onValueChange={(value) => setCategoryFilter(value || null)}
            >
              <SelectTrigger className="w-[180px] shrink-0">
                <SelectValue placeholder="類別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">所有類別</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="stock-warning"
                className="mr-2"
                checked={stockWarningFilter}
                onChange={() => setStockWarningFilter(!stockWarningFilter)}
              />
              <Label htmlFor="stock-warning" className="text-sm cursor-pointer">
                僅顯示低庫存
              </Label>
            </div>
            
            <div className="flex-1"></div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter(null);
                setStockWarningFilter(false);
              }}
            >
              清除篩選
            </Button>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("name")}
                    >
                      項目名稱
                      {sortField === "name" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="ml-1 inline h-3 w-3" /> :
                          <ArrowDown className="ml-1 inline h-3 w-3" />
                      )}
                    </TableHead>
                    <TableHead>類別</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("quantity")}
                    >
                      現有庫存
                      {sortField === "quantity" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="ml-1 inline h-3 w-3" /> :
                          <ArrowDown className="ml-1 inline h-3 w-3" />
                      )}
                    </TableHead>
                    <TableHead>單位</TableHead>
                    <TableHead 
                      className="text-right cursor-pointer"
                      onClick={() => toggleSort("cost")}
                    >
                      單價
                      {sortField === "cost" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="ml-1 inline h-3 w-3" /> :
                          <ArrowDown className="ml-1 inline h-3 w-3" />
                      )}
                    </TableHead>
                    <TableHead className="text-right">總價值</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(item => {
                    const isLowStock = item.quantity <= item.threshold;
                    const stockLevel = Math.min(Math.max((item.quantity / (item.threshold * 2)) * 100, 0), 100);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                          {isLowStock && <AlertTriangle className="inline ml-2 h-4 w-4 text-yellow-500" />}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-24">
                              <Progress value={stockLevel} className="h-2" />
                            </div>
                            <span className={isLowStock ? "text-red-500 font-medium" : ""}>
                              {item.quantity} {isLowStock && `(低於 ${item.threshold})`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right">
                          NT$ {item.cost}
                        </TableCell>
                        <TableCell className="text-right">
                          NT$ {(item.quantity * item.cost).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {}}
                              >
                                入庫
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>庫存入庫 - {item.name}</DialogTitle>
                              </DialogHeader>
                              <form 
                                className="space-y-4 mt-4" 
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleRestock(item.id);
                                }}
                              >
                                <div className="space-y-2">
                                  <Label htmlFor="quantity">入庫數量</Label>
                                  <Input 
                                    id="quantity" 
                                    type="number" 
                                    placeholder={`輸入入庫數量 (${item.unit})`} 
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="cost">單價 (NT$)</Label>
                                  <Input 
                                    id="cost" 
                                    type="number" 
                                    placeholder="輸入單價" 
                                    defaultValue={item.cost}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="notes">備註</Label>
                                  <Input id="notes" placeholder="輸入備註" />
                                </div>
                                
                                <div className="flex justify-end gap-2 pt-4">
                                  <Button type="submit">確認入庫</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        沒有找到符合條件的庫存項目
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {filteredItems.length > 0 && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={5} className="text-right font-bold">總價值</TableCell>
                      <TableCell className="text-right font-bold">
                        NT$ {filteredItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock" className="mt-0">
          {lowStockItems.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>低庫存警告</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>項目名稱</TableHead>
                      <TableHead>類別</TableHead>
                      <TableHead>現有庫存</TableHead>
                      <TableHead>警戒值</TableHead>
                      <TableHead>單位</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                          <AlertTriangle className="inline ml-2 h-4 w-4 text-yellow-500" />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-red-500 font-medium">
                          {item.quantity}
                        </TableCell>
                        <TableCell>{item.threshold}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRestock(item.id)}
                          >
                            入庫
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">庫存充足</h3>
              <p className="text-muted-foreground max-w-md">
                目前所有庫存項目都高於警戒值，無需補貨。
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>入庫記錄</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>項目名稱</TableHead>
                    <TableHead>數量</TableHead>
                    <TableHead>單位</TableHead>
                    <TableHead>單價</TableHead>
                    <TableHead>總金額</TableHead>
                    <TableHead>操作人員</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-05-01</TableCell>
                    <TableCell>牛肉</TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>公斤</TableCell>
                    <TableCell>NT$ 350</TableCell>
                    <TableCell>NT$ 17,500</TableCell>
                    <TableCell>王大明</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-05-01</TableCell>
                    <TableCell>雞肉</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>公斤</TableCell>
                    <TableCell>NT$ 200</TableCell>
                    <TableCell>NT$ 6,000</TableCell>
                    <TableCell>王大明</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-05-02</TableCell>
                    <TableCell>白米</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>公斤</TableCell>
                    <TableCell>NT$ 80</TableCell>
                    <TableCell>NT$ 8,000</TableCell>
                    <TableCell>李小華</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-05-02</TableCell>
                    <TableCell>外帶餐盒</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>個</TableCell>
                    <TableCell>NT$ 5</TableCell>
                    <TableCell>NT$ 2,500</TableCell>
                    <TableCell>李小華</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-05-03</TableCell>
                    <TableCell>茶葉</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>公斤</TableCell>
                    <TableCell>NT$ 500</TableCell>
                    <TableCell>NT$ 2,500</TableCell>
                    <TableCell>王大明</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default InventoryManagement;
