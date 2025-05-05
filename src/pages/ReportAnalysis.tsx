
import React, { useState } from "react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell, TableFooter 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area 
} from 'recharts';
import { financialData, expenseCategories, menuItems, menuCategories } from '@/data/mockData';
import { 
  FileDown, FileText, Calendar, ChevronDown, 
  ArrowUp, ArrowDown, TrendingUp, TrendingDown, Percent
} from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#808080'];

const ReportAnalysis = () => {
  const [dateRange, setDateRange] = useState("month");

  // Menu sales data (mock data)
  const menuSalesData = menuItems.map(item => {
    const category = menuCategories.find(c => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      category: category?.name || '',
      price: item.price,
      quantity: Math.floor(Math.random() * 100) + 20, // Random quantity between 20-120
      revenue: 0 // Will be calculated
    };
  }).map(item => ({
    ...item,
    revenue: item.price * item.quantity
  })).sort((a, b) => b.revenue - a.revenue); // Sort by revenue (highest first)

  // Category sales data
  const categorySalesData = menuCategories.map(category => {
    const categoryItems = menuSalesData.filter(item => item.category === category.name);
    const totalRevenue = categoryItems.reduce((sum, item) => sum + item.revenue, 0);
    const totalQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      revenue: totalRevenue,
      quantity: totalQuantity,
      percentage: 0 // Will be calculated
    };
  });

  // Calculate percentage of total revenue
  const totalRevenue = categorySalesData.reduce((sum, cat) => sum + cat.revenue, 0);
  const categorySalesWithPercentage = categorySalesData.map(cat => ({
    ...cat,
    percentage: Math.round((cat.revenue / totalRevenue) * 100)
  }));

  // Revenue by hour (mock data)
  const revenueByHour = [
    { hour: '10:00', revenue: 5000 },
    { hour: '11:00', revenue: 8000 },
    { hour: '12:00', revenue: 15000 },
    { hour: '13:00', revenue: 18000 },
    { hour: '14:00', revenue: 12000 },
    { hour: '15:00', revenue: 7000 },
    { hour: '16:00', revenue: 5000 },
    { hour: '17:00', revenue: 9000 },
    { hour: '18:00', revenue: 16000 },
    { hour: '19:00', revenue: 20000 },
    { hour: '20:00', revenue: 17000 },
    { hour: '21:00', revenue: 10000 },
  ];

  // KPIs data
  const kpiData = {
    revenue: financialData.monthlyRevenue[5].revenue,
    prevRevenue: financialData.monthlyRevenue[4].revenue,
    revenueChange: ((financialData.monthlyRevenue[5].revenue - financialData.monthlyRevenue[4].revenue) / financialData.monthlyRevenue[4].revenue) * 100,
    
    profit: financialData.profitTrend[5].profit,
    prevProfit: financialData.profitTrend[4].profit,
    profitChange: ((financialData.profitTrend[5].profit - financialData.profitTrend[4].profit) / financialData.profitTrend[4].profit) * 100,
    
    foodCostRatio: financialData.keyMetrics.foodCostRatio,
    prevFoodCostRatio: financialData.keyMetrics.foodCostRatio + 1.5, // Mock previous month's ratio
    foodCostRatioChange: -1.5, // Mock change
    
    orderCount: financialData.keyMetrics.ordersPerDay * 30,
    prevOrderCount: financialData.keyMetrics.ordersPerDay * 28,
    orderCountChange: ((financialData.keyMetrics.ordersPerDay * 30 - financialData.keyMetrics.ordersPerDay * 28) / (financialData.keyMetrics.ordersPerDay * 28)) * 100,
  };

  return (
    <Page
      title="報表分析"
      subtitle="分析銷售和業績數據"
      action={
        <div className="flex items-center gap-2">
          <Select defaultValue="month" onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="選擇時間區間" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">今日</SelectItem>
              <SelectItem value="week">本週</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            匯出報表
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">整體概覽</TabsTrigger>
          <TabsTrigger value="sales">銷售分析</TabsTrigger>
          <TabsTrigger value="finances">財務分析</TabsTrigger>
          <TabsTrigger value="profit-loss">損益報表</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">營業額</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">NT$ {kpiData.revenue.toLocaleString()}</div>
                <div className="flex items-center text-xs mt-1">
                  {kpiData.revenueChange >= 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">{kpiData.revenueChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">{Math.abs(kpiData.revenueChange).toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground ml-1">較上月</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">淨利潤</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">NT$ {kpiData.profit.toLocaleString()}</div>
                <div className="flex items-center text-xs mt-1">
                  {kpiData.profitChange >= 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">{kpiData.profitChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">{Math.abs(kpiData.profitChange).toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground ml-1">較上月</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">食材成本率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.foodCostRatio}%</div>
                <div className="flex items-center text-xs mt-1">
                  {kpiData.foodCostRatioChange <= 0 ? (
                    <>
                      <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">{Math.abs(kpiData.foodCostRatioChange).toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">{kpiData.foodCostRatioChange.toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground ml-1">較上月</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">訂單數量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.orderCount}</div>
                <div className="flex items-center text-xs mt-1">
                  {kpiData.orderCountChange >= 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">{kpiData.orderCountChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">{Math.abs(kpiData.orderCountChange).toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground ml-1">較上月</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>收入與支出趨勢</CardTitle>
                <CardDescription>過去 6 個月的數據</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={financialData.profitTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`NT$ ${value.toLocaleString()}`, '']}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" fill="#2563eb" stroke="#2563eb" name="營收" />
                      <Bar dataKey="expense" fill="#ef4444" name="支出" />
                      <Line type="monotone" dataKey="profit" stroke="#16a34a" name="利潤" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>支出分類佔比</CardTitle>
                <CardDescription>本月支出分類佔比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financialData.expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        nameKey="category"
                        label={({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                          const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                          return (
                            <text 
                              x={x} 
                              y={y} 
                              fill="#fff" 
                              textAnchor={x > cx ? 'start' : 'end'} 
                              dominantBaseline="central"
                            >
                              {`${financialData.expenseBreakdown[index].category} ${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                      >
                        {financialData.expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`NT$ ${value.toLocaleString()}`, '金額']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>每日營收時段分析</CardTitle>
                <CardDescription>按時段的營收分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByHour}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`NT$ ${value.toLocaleString()}`, '營收']}
                      />
                      <Bar dataKey="revenue" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>類別銷售佔比</CardTitle>
                <CardDescription>各類別銷售佔總銷售的比例</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySalesWithPercentage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                        nameKey="name"
                        label={({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                          const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                          return (
                            <text 
                              x={x} 
                              y={y} 
                              fill="#fff" 
                              textAnchor={x > cx ? 'start' : 'end'} 
                              dominantBaseline="central"
                            >
                              {`${categorySalesWithPercentage[index].name} ${categorySalesWithPercentage[index].percentage}%`}
                            </text>
                          );
                        }}
                      >
                        {categorySalesWithPercentage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`NT$ ${value.toLocaleString()}`, '銷售額']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>熱銷菜品排行</CardTitle>
                <CardDescription>按銷售額排序的熱門菜品</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名稱</TableHead>
                      <TableHead>類別</TableHead>
                      <TableHead className="text-right">售出數量</TableHead>
                      <TableHead className="text-right">單價</TableHead>
                      <TableHead className="text-right">銷售額</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menuSalesData.slice(0, 5).map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">NT$ {item.price}</TableCell>
                        <TableCell className="text-right">NT$ {item.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>銷售分類分析</CardTitle>
                <CardDescription>按類別的銷售分析</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>類別</TableHead>
                      <TableHead className="text-right">售出數量</TableHead>
                      <TableHead className="text-right">銷售額</TableHead>
                      <TableHead className="text-right">佔比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorySalesWithPercentage.map(category => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.icon} {category.name}
                        </TableCell>
                        <TableCell className="text-right">{category.quantity}</TableCell>
                        <TableCell className="text-right">NT$ {category.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{category.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">總計</TableCell>
                      <TableCell className="text-right font-bold">
                        {categorySalesWithPercentage.reduce((sum, cat) => sum + cat.quantity, 0)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        NT$ {totalRevenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">100%</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>時段銷售分析</CardTitle>
              <CardDescription>一天中不同時段的銷售情況</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`NT$ ${value.toLocaleString()}`, '營收']}
                    />
                    <Bar dataKey="revenue" fill="#2563eb">
                      {revenueByHour.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.revenue >= 15000 ? '#16a34a' : 
                            entry.revenue >= 10000 ? '#2563eb' : 
                            '#94a3b8'
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>從時段分析可看出，中午 (12:00-14:00) 和晚餐 (18:00-20:00) 是營業高峰期，建議在這些時段加強人力配置。</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>成本比率分析</CardTitle>
                <CardDescription>主要成本佔收入的比例</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>食材成本</span>
                      <span className="flex items-center">
                        {financialData.keyMetrics.foodCostRatio}% 
                        <Percent className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${financialData.keyMetrics.foodCostRatio}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>理想: 30-40%</span>
                      {financialData.keyMetrics.foodCostRatio <= 40 ? (
                        <span className="text-green-500">良好</span>
                      ) : (
                        <span className="text-red-500">偏高</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>人事成本</span>
                      <span className="flex items-center">
                        {financialData.keyMetrics.laborCostRatio}% 
                        <Percent className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${financialData.keyMetrics.laborCostRatio}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>理想: 25-30%</span>
                      {financialData.keyMetrics.laborCostRatio <= 30 ? (
                        <span className="text-green-500">良好</span>
                      ) : (
                        <span className="text-red-500">偏高</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>場地與水電</span>
                      <span className="flex items-center">
                        15% 
                        <Percent className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `15%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>理想: 10-20%</span>
                      <span className="text-green-500">良好</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>其他支出</span>
                      <span className="flex items-center">
                        10% 
                        <Percent className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `10%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between font-medium">
                    <span>凈利潤率</span>
                    <span className="flex items-center">
                      {financialData.keyMetrics.profitMargin}% 
                      <Percent className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${financialData.keyMetrics.profitMargin}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between mt-1">
                    <span>理想: &gt;20%</span>
                    {financialData.keyMetrics.profitMargin >= 20 ? (
                      <span className="text-green-500">良好</span>
                    ) : (
                      <span className="text-red-500">偏低</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>收支與利潤趨勢</CardTitle>
                <CardDescription>過去 6 個月的趨勢</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={financialData.profitTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`NT$ ${value.toLocaleString()}`, '']}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#2563eb" name="營收" />
                      <Line type="monotone" dataKey="expense" stroke="#ef4444" name="支出" />
                      <Line type="monotone" dataKey="profit" stroke="#16a34a" name="利潤" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">營收成長</div>
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-medium">6.3%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">支出成長</div>
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                      <span className="font-medium">4.2%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">利潤成長</div>
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-medium">12.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>支出明細分析</CardTitle>
                <CardDescription>本月支出類別明細</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                匯出
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>支出類別</TableHead>
                    <TableHead>類型</TableHead>
                    <TableHead className="text-right">金額</TableHead>
                    <TableHead className="text-right">佔總支出比例</TableHead>
                    <TableHead className="text-right">佔營收比例</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.slice(0, 6).map((category, index) => {
                    // Mock data for expense details
                    const amount = financialData.expenseBreakdown[index % financialData.expenseBreakdown.length].amount;
                    const expensePercentage = (amount / financialData.profitTrend[5].expense * 100).toFixed(1);
                    const revenuePercentage = (amount / financialData.profitTrend[5].revenue * 100).toFixed(1);
                    
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.icon} {category.name}
                        </TableCell>
                        <TableCell>
                          {category.type === 'direct' ? '直接成本' : '間接成本'}
                        </TableCell>
                        <TableCell className="text-right">
                          NT$ {amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {expensePercentage}%
                        </TableCell>
                        <TableCell className="text-right">
                          {revenuePercentage}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">總計</TableCell>
                    <TableCell className="text-right font-bold">
                      NT$ {financialData.profitTrend[5].expense.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">100%</TableCell>
                    <TableCell className="text-right font-bold">
                      {(financialData.profitTrend[5].expense / financialData.profitTrend[5].revenue * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-loss" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>損益表</CardTitle>
                <CardDescription>
                  {dateRange === 'month' && '2023年5月'}
                  {dateRange === 'quarter' && '2023年第2季'}
                  {dateRange === 'year' && '2023年度'}
                  {dateRange === 'week' && '2023年第20週'}
                  {dateRange === 'today' && '2023年5月15日'}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  選擇日期
                </Button>
              </div>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default ReportAnalysis;
