
import React, { useState } from "react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { staff, staffSchedules } from "@/data/mockData";
import { 
  Plus, FileDown, Search, Phone, Mail, Calendar,
  CheckCircle, XCircle, Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StaffManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("staff");

  // Unique positions
  const positions = [...new Set(staff.map(employee => employee.position))];

  // Filter staff members
  const filteredStaff = staff.filter(employee => {
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        employee.name.toLowerCase().includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower) ||
        employee.contactNumber.includes(searchQuery) ||
        employee.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }).filter(employee => {
    // Filter by position
    if (positionFilter) {
      return employee.position === positionFilter;
    }
    return true;
  });

  // Current day of week (0: Sunday, 1: Monday, ...)
  const dayOfWeek = new Date().getDay();
  const daysOfWeek = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  const currentDay = daysOfWeek[dayOfWeek];

  // Today's schedule
  const todaySchedule = staffSchedules.filter(schedule => schedule.day === currentDay);

  // Staff on duty today
  const onDutyStaff = todaySchedule.map(schedule => {
    const employee = staff.find(s => s.staffId === schedule.staffId);
    return {
      ...schedule,
      employee
    };
  });

  // Handle add staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "員工已新增",
      description: "新員工資料已成功新增",
    });
  };

  // Handle approve leave
  const handleApproveLeave = () => {
    toast({
      title: "請假已批准",
      description: "員工請假申請已批准",
    });
  };

  // Handle reject leave
  const handleRejectLeave = () => {
    toast({
      title: "請假已拒絕",
      description: "員工請假申請已拒絕",
    });
  };

  return (
    <Page
      title="員工管理"
      subtitle="管理員工、班表和請假申請"
      action={
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                新增員工
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增員工</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStaff} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="staff-name">姓名</Label>
                  <Input id="staff-name" placeholder="輸入員工姓名" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="staff-position">職位</Label>
                  <Select>
                    <SelectTrigger id="staff-position">
                      <SelectValue placeholder="選擇職位" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(position => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourly-rate">時薪 (NT$)</Label>
                    <Input id="hourly-rate" type="number" placeholder="輸入時薪" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-salary">月薪 (NT$)</Label>
                    <Input id="monthly-salary" type="number" placeholder="輸入月薪" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-number">聯絡電話</Label>
                  <Input id="contact-number" placeholder="輸入聯絡電話" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">電子郵件</Label>
                  <Input id="email" type="email" placeholder="輸入電子郵件" />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="submit">新增員工</Button>
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
      <Tabs defaultValue="staff" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="staff">員工名單</TabsTrigger>
          <TabsTrigger value="schedule">班表管理</TabsTrigger>
          <TabsTrigger value="leave">請假審核</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-0 space-y-6">
          {/* Today's Staff */}
          {activeTab === "staff" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>今日在班（{currentDay}）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {onDutyStaff.length > 0 ? (
                    onDutyStaff.map((schedule, index) => {
                      const employee = staff.find(s => s.id === schedule.staffId);
                      if (!employee) return null;
                      
                      return (
                        <div key={index} className="flex items-center p-3 border rounded-lg">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary mr-4">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.position}</div>
                            <div className="text-xs mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      今日沒有員工排班
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋員工..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={positionFilter || ""}
              onValueChange={(value) => setPositionFilter(value || null)}
            >
              <SelectTrigger className="w-[180px] shrink-0">
                <SelectValue placeholder="職位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">所有職位</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>
                    {position}
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
                setPositionFilter(null);
              }}
            >
              清除篩選
            </Button>
          </div>

          {/* Staff Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>職位</TableHead>
                    <TableHead>薪資</TableHead>
                    <TableHead>聯絡資訊</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map(employee => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {employee.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {employee.monthlySalary ? (
                          <div>NT$ {employee.monthlySalary.toLocaleString()} / 月</div>
                        ) : (
                          <div>NT$ {employee.hourlyRate} / 小時</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                            {employee.contactNumber}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                            {employee.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            編輯
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            排班
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredStaff.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        沒有找到符合條件的員工
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>本週班表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">員工</TableHead>
                      <TableHead className="min-w-[100px]">週一</TableHead>
                      <TableHead className="min-w-[100px]">週二</TableHead>
                      <TableHead className="min-w-[100px]">週三</TableHead>
                      <TableHead className="min-w-[100px]">週四</TableHead>
                      <TableHead className="min-w-[100px]">週五</TableHead>
                      <TableHead className="min-w-[100px]">週六</TableHead>
                      <TableHead className="min-w-[100px]">週日</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map(employee => {
                      // Get schedules for this employee
                      const employeeSchedules = staffSchedules.filter(s => s.staffId === employee.id);
                      
                      // Create a map of day to schedule
                      const scheduleByDay = employeeSchedules.reduce((acc, schedule) => {
                        acc[schedule.day] = schedule;
                        return acc;
                      }, {} as Record<string, typeof staffSchedules[0]>);
                      
                      return (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>
                            {scheduleByDay['週一'] ? (
                              <div className="text-xs">
                                {scheduleByDay['週一'].startTime} - {scheduleByDay['週一'].endTime}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">休息</div>
                            )}
                          </TableCell>
                          <TableCell>
                            {scheduleByDay['週二'] ? (
                              <div className="text-xs">
                                {scheduleByDay['週二'].startTime} - {scheduleByDay['週二'].endTime}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">休息</div>
                            )}
                          </TableCell>
                          <TableCell>
                            {scheduleByDay['週三'] ? (
                              <div className="text-xs">
                                {scheduleByDay['週三'].startTime} - {scheduleByDay['週三'].endTime}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">休息</div>
                            )}
                          </TableCell>
                          <TableCell>
                            {scheduleByDay['週四'] ? (
                              <div className="text-xs">
                                {scheduleByDay['週四'].startTime} - {scheduleByDay['週四'].endTime}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">休息</div>
                            )}
                          </TableCell>
                          <TableCell>
                            {scheduleByDay['週五'] ? (
                              <div className="text-xs">
                                {scheduleByDay['週五'].startTime} - {scheduleByDay['週五'].endTime}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">休息</div>
                            )}
                          </TableCell>
                          <TableCell>
                            {scheduleByDay['週六'] ? (
                              <div className="text-xs">
                                {scheduleByDay['週六'].startTime} - {scheduleByDay['週六'].endTime}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">休息</div>
                            )}
                          </TableCell>
                          <TableCell>
                            {scheduleByDay['週日'] ? (
                              <div className="text-xs">
                                {scheduleByDay['週日'].startTime} - {scheduleByDay['週日'].endTime}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">休息</div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  編輯班表
                </Button>
                <Button variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  匯出班表
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>請假申請</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>員工</TableHead>
                    <TableHead>請假類型</TableHead>
                    <TableHead>請假日期</TableHead>
                    <TableHead>請假時間</TableHead>
                    <TableHead>申請日期</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">李小華</TableCell>
                    <TableCell>
                      <Badge>事假</Badge>
                    </TableCell>
                    <TableCell>2023-05-15</TableCell>
                    <TableCell>全天</TableCell>
                    <TableCell>2023-05-10</TableCell>
                    <TableCell>家中有事</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-500 hover:text-green-500"
                          onClick={handleApproveLeave}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          批准
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-500"
                          onClick={handleRejectLeave}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          拒絕
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">陳小明</TableCell>
                    <TableCell>
                      <Badge>病假</Badge>
                    </TableCell>
                    <TableCell>2023-05-18</TableCell>
                    <TableCell>全天</TableCell>
                    <TableCell>2023-05-12</TableCell>
                    <TableCell>感冒發燒</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-500 hover:text-green-500"
                          onClick={handleApproveLeave}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          批准
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-500"
                          onClick={handleRejectLeave}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          拒絕
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="mt-4 space-y-4">
                <h3 className="font-semibold">已審核請假</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>員工</TableHead>
                      <TableHead>請假類型</TableHead>
                      <TableHead>請假日期</TableHead>
                      <TableHead>請假時間</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead>審核日期</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">王大明</TableCell>
                      <TableCell>
                        <Badge>特休</Badge>
                      </TableCell>
                      <TableCell>2023-05-05</TableCell>
                      <TableCell>全天</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">已批准</Badge>
                      </TableCell>
                      <TableCell>2023-05-01</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">林美玲</TableCell>
                      <TableCell>
                        <Badge>事假</Badge>
                      </TableCell>
                      <TableCell>2023-05-08</TableCell>
                      <TableCell>下午</TableCell>
                      <TableCell>
                        <Badge className="bg-red-500">已拒絕</Badge>
                      </TableCell>
                      <TableCell>2023-05-06</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default StaffManagement;
