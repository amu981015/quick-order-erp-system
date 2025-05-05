
import React, { useState } from "react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { orders, OrderStatus, orderStatusMap, tables } from "@/data/mockData";
import { Search, Filter, Printer, CheckCircle, Clock, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderStatusIcon = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case OrderStatus.PROCESSING:
      return <Clock className="w-4 h-4 text-blue-500" />;
    case OrderStatus.COMPLETED:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case OrderStatus.CANCELLED:
      return <Ban className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const OrderManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTableFilter, setSelectedTableFilter] = useState<number | null>(null);

  // Filter orders based on tab, search query, and table filter
  const filteredOrders = orders.filter(order => {
    // Filter by tab (status)
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }

    // Filter by table number if selected
    if (selectedTableFilter !== null && order.tableNumber !== selectedTableFilter) {
      return false;
    }

    // Filter by search query (order ID or table number)
    if (searchQuery) {
      return (
        order.id.toString().includes(searchQuery) ||
        order.tableNumber.toString().includes(searchQuery)
      );
    }

    return true;
  });

  // Group orders by table number
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.tableNumber]) {
      acc[order.tableNumber] = [];
    }
    acc[order.tableNumber].push(order);
    return acc;
  }, {} as Record<number, typeof orders>);

  // Handle order status change
  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    toast({
      title: "訂單狀態已更新",
      description: `訂單 #${orderId} 狀態已更新為 ${orderStatusMap[newStatus]}`,
    });
  };

  // Handle print receipt
  const handlePrintReceipt = (tableNumber: number) => {
    toast({
      title: "收據列印中",
      description: `桌號 ${tableNumber} 的收據正在列印`,
    });
  };

  // Handle checkout
  const handleCheckout = (tableNumber: number) => {
    toast({
      title: "結帳成功",
      description: `桌號 ${tableNumber} 已完成結帳`,
    });
  };

  return (
    <Page
      title="訂單管理"
      subtitle="管理和處理所有訂單"
      action={
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜尋訂單編號或桌號..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部訂單</TabsTrigger>
          <TabsTrigger value={OrderStatus.PENDING}>待處理</TabsTrigger>
          <TabsTrigger value={OrderStatus.PROCESSING}>製作中</TabsTrigger>
          <TabsTrigger value={OrderStatus.COMPLETED}>已出餐</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {/* Table filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedTableFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTableFilter(null)}
            >
              全部桌號
            </Button>
            {tables.slice(0, 10).map((table) => (
              <Button
                key={table.id}
                variant={selectedTableFilter === table.tableNumber ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTableFilter(table.tableNumber)}
              >
                桌號 {table.tableNumber}
              </Button>
            ))}
            <Button variant="outline" size="sm">
              更多...
            </Button>
          </div>

          {/* Orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(groupedOrders).map((tableNumber) => {
              const tableOrders = groupedOrders[parseInt(tableNumber)];
              return (
                <Card key={tableNumber} className="overflow-hidden">
                  <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
                    <h3 className="font-medium">桌號 {tableNumber}</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handlePrintReceipt(parseInt(tableNumber))}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        收據
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleCheckout(parseInt(tableNumber))}
                      >
                        結帳
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    {tableOrders.map((order, index) => (
                      <div key={order.id} className="p-4">
                        {index > 0 && <Separator className="mb-4" />}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <OrderStatusIcon status={order.status} />
                              <span className="font-medium">
                                訂單 #{order.id}
                              </span>
                              <Badge variant="outline" className="ml-2">
                                {orderStatusMap[order.status]}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('zh-TW')} {new Date(order.createdAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">NT$ {order.finalTotal}</div>
                            {order.discount > 0 && (
                              <div className="text-xs text-green-600">
                                折扣: NT$ {order.discount}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <div>
                                {item.name} x{item.quantity}
                              </div>
                              <div>NT$ {item.price * item.quantity}</div>
                            </div>
                          ))}
                        </div>

                        {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                          <div className="flex gap-2 mt-3">
                            {order.status === OrderStatus.PENDING && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleStatusChange(order.id, OrderStatus.PROCESSING)}
                              >
                                開始製作
                              </Button>
                            )}
                            {order.status === OrderStatus.PROCESSING && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleStatusChange(order.id, OrderStatus.COMPLETED)}
                              >
                                完成出餐
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-red-500 hover:text-red-500"
                              onClick={() => handleStatusChange(order.id, OrderStatus.CANCELLED)}
                            >
                              取消訂單
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}

            {Object.keys(groupedOrders).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-10 text-center">
                <div className="text-muted-foreground mb-2">沒有找到符合條件的訂單</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTableFilter(null);
                    setActiveTab("all");
                  }}
                >
                  清除篩選條件
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default OrderManagement;
