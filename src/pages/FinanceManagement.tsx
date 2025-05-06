
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { expenseCategories, expenses } from "@/data/mockData";
import { 
  Plus, FileDown, FileText, PieChart, Calendar, 
  DollarSign, Search, Filter, ArrowDown, ArrowUp 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FinanceManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort expenses
  const filteredExpenses = [...expenses]
    .filter(expense => {
      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          expense.name.toLowerCase().includes(searchLower) ||
          expense.notes.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(expense => {
      // Filter by category
      if (categoryFilter) {
        return expense.categoryId === parseInt(categoryFilter);
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

  // Calculate total
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Handle add expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "費用已新增",
      description: "新費用項目已成功新增",
    });
  };

  return (
    <Page
      title="財務管理"
      subtitle="管理收入與支出"
      action={
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                新增費用
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增費用</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-category">費用類別</Label>
                  <Select>
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="選擇費用類別" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expense-name">費用名稱</Label>
                  <Input id="expense-name" placeholder="輸入費用名稱" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expense-amount">金額</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="expense-amount" 
                      type="number" 
                      placeholder="輸入金額" 
                      className="pl-10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expense-date">日期</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="expense-date" 
                      type="date" 
                      className="pl-10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expense-notes">備註</Label>
                  <Input id="expense-notes" placeholder="輸入備註" />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="submit">新增費用</Button>
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
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="expenses">費用管理</TabsTrigger>
          <TabsTrigger value="income">收入管理</TabsTrigger>
          <TabsTrigger value="reports">財務報表</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-0 space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋費用..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={categoryFilter || "all"}
              onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px] shrink-0">
                <SelectValue placeholder="費用類別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有類別</SelectItem>
                {expenseCategories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1"></div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter(null);
              }}
            >
              清除篩選
            </Button>
          </div>

          {/* Expense Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="w-[180px] cursor-pointer"
                      onClick={() => toggleSort("date")}
                    >
                      日期
                      {sortField === "date" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="ml-1 inline h-3 w-3" /> :
                          <ArrowDown className="ml-1 inline h-3 w-3" />
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("name")}
                    >
                      費用名稱
                      {sortField === "name" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="ml-1 inline h-3 w-3" /> :
                          <ArrowDown className="ml-1 inline h-3 w-3" />
                      )}
                    </TableHead>
                    <TableHead>類別</TableHead>
                    <TableHead 
                      className="text-right cursor-pointer"
                      onClick={() => toggleSort("amount")}
                    >
                      金額
                      {sortField === "amount" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="ml-1 inline h-3 w-3" /> :
                          <ArrowDown className="ml-1 inline h-3 w-3" />
                      )}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map(expense => {
                    const category = expenseCategories.find(c => c.id === expense.categoryId);
                    return (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell className="font-medium">
                          {expense.name}
                          {expense.notes && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {expense.notes}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {category?.icon} {category?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          NT$ {expense.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {filteredExpenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        沒有找到符合條件的費用記錄
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {filteredExpenses.length > 0 && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">總計</TableCell>
                      <TableCell className="text-right font-bold">
                        NT$ {totalAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="mt-0">
          <div className="grid place-items-center py-12 text-center">
            <div className="max-w-md space-y-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">收入數據自動整合</h3>
              <p className="text-muted-foreground">
                收入數據已從點餐系統自動匯入，無需手動輸入。
                您可以在財務報表中查看詳細的收入分析。
              </p>
              <Button variant="outline" className="mt-4">
                <PieChart className="h-4 w-4 mr-2" />
                查看財務報表
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>快速報表</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  當月損益表
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  上月損益表
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  年度損益表
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  食材成本分析
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  人事成本分析
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>自訂報表</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">報表類型</Label>
                  <Select>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="選擇報表類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profit-loss">損益表</SelectItem>
                      <SelectItem value="expense-breakdown">支出明細</SelectItem>
                      <SelectItem value="income-summary">收入摘要</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">開始日期</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">結束日期</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>

                <Button className="w-full mt-4">
                  生成報表
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default FinanceManagement;
