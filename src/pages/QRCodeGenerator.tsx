
import React, { useState } from "react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { tables } from "@/data/mockData";
import { QrCode, Printer, Download, Link, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QRCodeGenerator = () => {
  const { toast } = useToast();
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [baseUrl, setBaseUrl] = useState("https://quickorder.example.com/table/");

  // Handle table selection
  const toggleTableSelection = (tableId: number) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter(id => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  // Handle select all tables
  const toggleSelectAll = () => {
    if (selectedTables.length === tables.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables(tables.map(table => table.id));
    }
  };

  // Handle copy URL
  const copyUrl = (tableId: number) => {
    const url = `${baseUrl}${tableId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "已複製連結",
      description: url,
    });
  };

  // Handle print QR codes
  const printQRCodes = () => {
    toast({
      title: "準備列印 QR 碼",
      description: `正在準備列印 ${selectedTables.length} 個 QR 碼`,
    });
  };

  // Handle download QR codes
  const downloadQRCodes = () => {
    toast({
      title: "正在下載 QR 碼",
      description: `下載 ${selectedTables.length} 個 QR 碼`,
    });
  };

  return (
    <Page
      title="QR 碼產生器"
      subtitle="為餐桌產生點餐 QR 碼"
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={selectedTables.length === 0}
            onClick={downloadQRCodes}
          >
            <Download className="w-4 h-4 mr-2" />
            下載 QR 碼
          </Button>
          <Button
            disabled={selectedTables.length === 0}
            onClick={printQRCodes}
          >
            <Printer className="w-4 h-4 mr-2" />
            列印 QR 碼
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-url">基本網址</Label>
                <div className="flex">
                  <Input
                    id="base-url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="輸入點餐系統的基本網址"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  桌號將自動添加到此基本網址之後，例如：{baseUrl}1
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>選擇餐桌</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                已選擇 {selectedTables.length} / {tables.length} 個餐桌
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
              >
                {selectedTables.length === tables.length ? "取消全選" : "全選"}
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedTables.length === tables.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>桌號</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>容納人數</TableHead>
                    <TableHead>QR 碼預覽</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.id} className={selectedTables.includes(table.id) ? "bg-muted/30" : ""}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedTables.includes(table.id)}
                          onChange={() => toggleTableSelection(table.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        桌號 {table.tableNumber}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            table.status === "available"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : table.status === "occupied"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {table.status === "available"
                            ? "空閒"
                            : table.status === "occupied"
                            ? "使用中"
                            : "已預訂"}
                        </Badge>
                      </TableCell>
                      <TableCell>{table.capacity} 人</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <div className="border p-2 inline-flex items-center justify-center">
                            <QrCode className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyUrl(table.tableNumber)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            複製
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.open(`${baseUrl}${table.tableNumber}`, '_blank');
                            }}
                          >
                            <Link className="h-4 w-4 mr-1" />
                            開啟
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default QRCodeGenerator;
