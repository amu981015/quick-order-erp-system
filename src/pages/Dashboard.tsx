
import React from "react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ResponsiveContainer 
} from 'recharts';
import { financialData, orders, inventoryItems, staff } from '@/data/mockData';

const Dashboard = () => {
  // Low stock items
  const lowStockItems = inventoryItems
    .filter(item => item.quantity <= item.threshold)
    .slice(0, 5);

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#808080'];

  return (
    <Page title="主頁儀表板" subtitle="歡迎使用快速點餐系統">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月營業額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NT$ {financialData.monthlyRevenue[5].revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              較上月
              <span className="text-green-500 ml-1">+{(
                (financialData.monthlyRevenue[5].revenue - financialData.monthlyRevenue[4].revenue) / 
                financialData.monthlyRevenue[4].revenue * 100
              ).toFixed(1)}%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">食材成本率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.keyMetrics.foodCostRatio}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              理想範圍: 30-40%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">淨利潤</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NT$ {financialData.profitTrend[5].profit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              利潤率
              <span className="text-green-500 ml-1">{financialData.keyMetrics.profitMargin}%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">訂單數量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.keyMetrics.ordersPerDay * 30}</div>
            <p className="text-xs text-muted-foreground mt-1">
              平均每日
              <span className="font-medium ml-1">{financialData.keyMetrics.ordersPerDay} 筆</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>月營收趨勢</CardTitle>
            <CardDescription>最近六個月營收數據</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>支出分類</CardTitle>
            <CardDescription>本月支出分類比例</CardDescription>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>收支與利潤趨勢</CardTitle>
            <CardDescription>最近六個月收支數據</CardDescription>
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {/* Low Stock Warning */}
          <Card>
            <CardHeader>
              <CardTitle>庫存警告</CardTitle>
              <CardDescription>庫存量低於警戒值的項目</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="space-y-4">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-sm">
                        剩餘: <span className="font-bold text-red-500">{item.quantity}</span> {item.unit}
                        <span className="text-muted-foreground ml-2">(低於 {item.threshold})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  目前沒有庫存警告
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>最近訂單</CardTitle>
              <CardDescription>最近5筆訂單</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">桌號 {order.tableNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('zh-TW')} {new Date(order.createdAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">NT$ {order.finalTotal}</div>
                      <div className={`text-xs status-${order.status}`}>
                        {order.status === 'pending' ? '待處理' : 
                         order.status === 'processing' ? '製作中' : 
                         order.status === 'completed' ? '已出餐' : '已取消'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's staff */}
      <Card>
        <CardHeader>
          <CardTitle>今日班表</CardTitle>
          <CardDescription>在班員工</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.slice(0, 3).map(employee => (
              <div key={employee.id} className="flex items-center p-3 border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold mr-4">
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.position}</div>
                  <div className="text-xs">11:00 - 20:00</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default Dashboard;
