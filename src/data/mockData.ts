
// Mock data for the restaurant ordering system

// Menu categories
export const menuCategories = [
  { id: 1, name: '主菜', icon: '🍲' },
  { id: 2, name: '飲料', icon: '🥤' },
  { id: 3, name: '甜點', icon: '🍰' },
  { id: 4, name: '小吃', icon: '🍟' },
  { id: 5, name: '湯品', icon: '🍜' },
];

// Menu items
export const menuItems = [
  { id: 1, categoryId: 1, name: '牛肉飯', description: '澳洲進口牛肉，搭配特調醬汁', price: 180, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 2, categoryId: 1, name: '雞肉飯', description: '台灣本地雞肉，鮮嫩多汁', price: 150, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 3, categoryId: 1, name: '豬肉飯', description: '台灣本地豬肉，香氣四溢', price: 160, image: 'https://images.unsplash.com/photo-1625938144067-b1fd645a8935?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 4, categoryId: 2, name: '珍珠奶茶', description: '新鮮台灣茶葉，波霸來自台南', price: 60, image: 'https://images.unsplash.com/photo-1558857563-c0c6ee4ff84f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 5, categoryId: 2, name: '檸檬綠茶', description: '台灣高山茶，新鮮檸檬', price: 50, image: 'https://images.unsplash.com/photo-1556680080-3a20e09269cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 6, categoryId: 3, name: '芒果冰', description: '台南愛文芒果，綿密冰沙', price: 120, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 7, categoryId: 3, name: '紅豆湯圓', description: '手工湯圓，台南紅豆', price: 90, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 8, categoryId: 4, name: '炸雞塊', description: '台灣本地雞肉，特調醬料', price: 100, image: 'https://images.unsplash.com/photo-1562967915-92ae0c330dde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 9, categoryId: 4, name: '薯條', description: '美國進口馬鈴薯，酥脆可口', price: 80, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
  { id: 10, categoryId: 5, name: '味噌湯', description: '日本進口味噌，蔬菜豐富', price: 70, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' },
];

// Promotions
export const promotions = [
  { id: 1, name: '全單8折', description: '全部品項享8折優惠', type: 'discount', value: 0.8, startDate: '2023-05-01', endDate: '2023-05-31', active: true },
  { id: 2, name: '主菜+飲料省20元', description: '任一主菜搭配飲料省20元', type: 'combo', value: 20, startDate: '2023-05-01', endDate: '2023-05-31', active: true },
  { id: 3, name: '買一送一', description: '指定飲料買一送一', type: 'buyOneGetOne', value: 0, startDate: '2023-05-01', endDate: '2023-05-31', active: false },
];

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Order statuses in Chinese
export const orderStatusMap = {
  [OrderStatus.PENDING]: '待處理',
  [OrderStatus.PROCESSING]: '製作中',
  [OrderStatus.COMPLETED]: '已出餐',
  [OrderStatus.CANCELLED]: '已取消',
};

// Orders
export const orders = [
  {
    id: 1001,
    tableNumber: 5,
    status: OrderStatus.COMPLETED,
    items: [
      { id: 1, menuItemId: 1, name: '牛肉飯', price: 180, quantity: 2 },
      { id: 2, menuItemId: 4, name: '珍珠奶茶', price: 60, quantity: 2 },
    ],
    total: 480,
    discount: 0,
    finalTotal: 480,
    createdAt: '2023-05-10T12:30:00',
    completedAt: '2023-05-10T13:00:00',
  },
  {
    id: 1002,
    tableNumber: 8,
    status: OrderStatus.PROCESSING,
    items: [
      { id: 1, menuItemId: 2, name: '雞肉飯', price: 150, quantity: 1 },
      { id: 2, menuItemId: 5, name: '檸檬綠茶', price: 50, quantity: 1 },
      { id: 3, menuItemId: 8, name: '炸雞塊', price: 100, quantity: 1 },
    ],
    total: 300,
    discount: 20,
    finalTotal: 280,
    createdAt: '2023-05-10T12:45:00',
  },
  {
    id: 1003,
    tableNumber: 3,
    status: OrderStatus.PENDING,
    items: [
      { id: 1, menuItemId: 3, name: '豬肉飯', price: 160, quantity: 3 },
      { id: 2, menuItemId: 9, name: '薯條', price: 80, quantity: 2 },
      { id: 3, menuItemId: 4, name: '珍珠奶茶', price: 60, quantity: 3 },
    ],
    total: 660,
    discount: 0,
    finalTotal: 660,
    createdAt: '2023-05-10T13:00:00',
  },
  {
    id: 1004,
    tableNumber: 12,
    status: OrderStatus.PENDING,
    items: [
      { id: 1, menuItemId: 1, name: '牛肉飯', price: 180, quantity: 1 },
      { id: 2, menuItemId: 10, name: '味噌湯', price: 70, quantity: 1 },
    ],
    total: 250,
    discount: 0,
    finalTotal: 250,
    createdAt: '2023-05-10T13:15:00',
  },
  {
    id: 1005,
    tableNumber: 7,
    status: OrderStatus.PROCESSING,
    items: [
      { id: 1, menuItemId: 6, name: '芒果冰', price: 120, quantity: 2 },
      { id: 2, menuItemId: 7, name: '紅豆湯圓', price: 90, quantity: 1 },
    ],
    total: 330,
    discount: 0,
    finalTotal: 330,
    createdAt: '2023-05-10T13:30:00',
  },
];

// Tables
export const tables = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  tableNumber: index + 1,
  status: index % 5 === 0 ? 'occupied' : index % 3 === 0 ? 'reserved' : 'available',
  capacity: 4,
  order: index % 5 === 0 ? orders.find(o => o.tableNumber === index + 1) : null,
}));

// Expenses Categories
export const expenseCategories = [
  { id: 1, name: '食材', icon: '🥩', type: 'direct' },
  { id: 2, name: '包裝材料', icon: '📦', type: 'direct' },
  { id: 3, name: '清潔用品', icon: '🧼', type: 'indirect' },
  { id: 4, name: '水電瓦斯', icon: '💡', type: 'indirect' },
  { id: 5, name: '房租', icon: '🏠', type: 'indirect' },
  { id: 6, name: '人事成本', icon: '👥', type: 'indirect' },
  { id: 7, name: '行銷', icon: '📢', type: 'indirect' },
  { id: 8, name: '設備維修', icon: '🔧', type: 'indirect' },
  { id: 9, name: '稅金', icon: '📝', type: 'indirect' },
  { id: 10, name: '其他', icon: '🔹', type: 'indirect' },
];

// Expenses
export const expenses = [
  { id: 1, categoryId: 1, name: '牛肉', amount: 5000, date: '2023-05-01', notes: '澳洲進口牛肉 50公斤' },
  { id: 2, categoryId: 1, name: '雞肉', amount: 3000, date: '2023-05-01', notes: '台灣本地雞肉 30公斤' },
  { id: 3, categoryId: 1, name: '豬肉', amount: 2500, date: '2023-05-01', notes: '台灣本地豬肉 25公斤' },
  { id: 4, categoryId: 2, name: '餐盒', amount: 1200, date: '2023-05-02', notes: '外帶餐盒 500個' },
  { id: 5, categoryId: 2, name: '飲料杯', amount: 800, date: '2023-05-02', notes: '珍奶杯 300個' },
  { id: 6, categoryId: 3, name: '洗碗精', amount: 500, date: '2023-05-03', notes: '洗碗精 5瓶' },
  { id: 7, categoryId: 4, name: '電費', amount: 8000, date: '2023-05-05', notes: '5月電費' },
  { id: 8, categoryId: 4, name: '水費', amount: 3000, date: '2023-05-05', notes: '5月水費' },
  { id: 9, categoryId: 4, name: '瓦斯費', amount: 2000, date: '2023-05-05', notes: '5月瓦斯費' },
  { id: 10, categoryId: 5, name: '店面租金', amount: 30000, date: '2023-05-10', notes: '5月店面租金' },
  { id: 11, categoryId: 6, name: '員工薪資', amount: 120000, date: '2023-05-31', notes: '5月員工薪資' },
  { id: 12, categoryId: 7, name: '網路廣告', amount: 5000, date: '2023-05-15', notes: 'Facebook廣告' },
];

// Inventory items
export const inventoryItems = [
  { id: 1, name: '牛肉', category: '食材', unit: '公斤', quantity: 30, cost: 350, threshold: 10 },
  { id: 2, name: '雞肉', category: '食材', unit: '公斤', quantity: 25, cost: 200, threshold: 10 },
  { id: 3, name: '豬肉', category: '食材', unit: '公斤', quantity: 20, cost: 180, threshold: 10 },
  { id: 4, name: '白米', category: '食材', unit: '公斤', quantity: 50, cost: 80, threshold: 15 },
  { id: 5, name: '茶葉', category: '食材', unit: '公斤', quantity: 5, cost: 500, threshold: 2 },
  { id: 6, name: '珍珠', category: '食材', unit: '公斤', quantity: 8, cost: 300, threshold: 3 },
  { id: 7, name: '芒果', category: '食材', unit: '公斤', quantity: 15, cost: 120, threshold: 5 },
  { id: 8, name: '紅豆', category: '食材', unit: '公斤', quantity: 10, cost: 150, threshold: 3 },
  { id: 9, name: '馬鈴薯', category: '食材', unit: '公斤', quantity: 20, cost: 80, threshold: 8 },
  { id: 10, name: '味噌', category: '食材', unit: '公斤', quantity: 5, cost: 250, threshold: 2 },
  { id: 11, name: '外帶餐盒', category: '包裝材料', unit: '個', quantity: 300, cost: 5, threshold: 100 },
  { id: 12, name: '珍奶杯', category: '包裝材料', unit: '個', quantity: 250, cost: 4, threshold: 100 },
  { id: 13, name: '吸管', category: '包裝材料', unit: '包', quantity: 30, cost: 60, threshold: 10 },
  { id: 14, name: '餐巾紙', category: '包裝材料', unit: '包', quantity: 40, cost: 50, threshold: 15 },
  { id: 15, name: '洗碗精', category: '清潔用品', unit: '瓶', quantity: 8, cost: 100, threshold: 3 },
];

// Staff
export const staff = [
  { id: 1, name: '王大明', position: '店長', hourlyRate: 250, monthlySalary: 50000, contactNumber: '0912-345-678', email: 'wang@example.com' },
  { id: 2, name: '李小華', position: '廚師', hourlyRate: 220, monthlySalary: 45000, contactNumber: '0923-456-789', email: 'lee@example.com' },
  { id: 3, name: '張美美', position: '廚師', hourlyRate: 220, monthlySalary: 45000, contactNumber: '0934-567-890', email: 'chang@example.com' },
  { id: 4, name: '陳小明', position: '服務生', hourlyRate: 180, monthlySalary: 36000, contactNumber: '0945-678-901', email: 'chen@example.com' },
  { id: 5, name: '林美玲', position: '服務生', hourlyRate: 180, monthlySalary: 36000, contactNumber: '0956-789-012', email: 'lin@example.com' },
  { id: 6, name: '黃小婷', position: '收銀員', hourlyRate: 200, monthlySalary: 40000, contactNumber: '0967-890-123', email: 'huang@example.com' },
];

// Staff schedules
export const staffSchedules = [
  { id: 1, staffId: 1, day: '週一', startTime: '09:00', endTime: '18:00' },
  { id: 2, staffId: 1, day: '週二', startTime: '09:00', endTime: '18:00' },
  { id: 3, staffId: 1, day: '週三', startTime: '09:00', endTime: '18:00' },
  { id: 4, staffId: 1, day: '週四', startTime: '09:00', endTime: '18:00' },
  { id: 5, staffId: 1, day: '週五', startTime: '09:00', endTime: '18:00' },
  { id: 6, staffId: 2, day: '週一', startTime: '10:00', endTime: '19:00' },
  { id: 7, staffId: 2, day: '週二', startTime: '10:00', endTime: '19:00' },
  { id: 8, staffId: 2, day: '週三', startTime: '10:00', endTime: '19:00' },
  { id: 9, staffId: 2, day: '週四', startTime: '10:00', endTime: '19:00' },
  { id: 10, staffId: 2, day: '週五', startTime: '10:00', endTime: '19:00' },
  { id: 11, staffId: 3, day: '週三', startTime: '10:00', endTime: '19:00' },
  { id: 12, staffId: 3, day: '週四', startTime: '10:00', endTime: '19:00' },
  { id: 13, staffId: 3, day: '週五', startTime: '10:00', endTime: '19:00' },
  { id: 14, staffId: 3, day: '週六', startTime: '10:00', endTime: '19:00' },
  { id: 15, staffId: 3, day: '週日', startTime: '10:00', endTime: '19:00' },
  { id: 16, staffId: 4, day: '週一', startTime: '11:00', endTime: '20:00' },
  { id: 17, staffId: 4, day: '週二', startTime: '11:00', endTime: '20:00' },
  { id: 18, staffId: 4, day: '週六', startTime: '11:00', endTime: '20:00' },
  { id: 19, staffId: 4, day: '週日', startTime: '11:00', endTime: '20:00' },
  { id: 20, staffId: 5, day: '週三', startTime: '11:00', endTime: '20:00' },
  { id: 21, staffId: 5, day: '週四', startTime: '11:00', endTime: '20:00' },
  { id: 22, staffId: 5, day: '週五', startTime: '11:00', endTime: '20:00' },
  { id: 23, staffId: 5, day: '週六', startTime: '11:00', endTime: '20:00' },
  { id: 24, staffId: 5, day: '週日', startTime: '11:00', endTime: '20:00' },
  { id: 25, staffId: 6, day: '週一', startTime: '11:00', endTime: '20:00' },
  { id: 26, staffId: 6, day: '週二', startTime: '11:00', endTime: '20:00' },
  { id: 27, staffId: 6, day: '週三', startTime: '11:00', endTime: '20:00' },
  { id: 28, staffId: 6, day: '週四', startTime: '11:00', endTime: '20:00' },
  { id: 29, staffId: 6, day: '週五', startTime: '11:00', endTime: '20:00' },
];

// Financial data for charts
export const financialData = {
  // Monthly revenue
  monthlyRevenue: [
    { month: '一月', revenue: 250000 },
    { month: '二月', revenue: 220000 },
    { month: '三月', revenue: 280000 },
    { month: '四月', revenue: 300000 },
    { month: '五月', revenue: 320000 },
    { month: '六月', revenue: 340000 },
  ],
  
  // Expense breakdown by category
  expenseBreakdown: [
    { category: '食材', amount: 100000, percentage: 40 },
    { category: '人事成本', amount: 80000, percentage: 32 },
    { category: '房租', amount: 30000, percentage: 12 },
    { category: '水電瓦斯', amount: 15000, percentage: 6 },
    { category: '包裝材料', amount: 10000, percentage: 4 },
    { category: '其他', amount: 15000, percentage: 6 },
  ],
  
  // Profit trend
  profitTrend: [
    { month: '一月', revenue: 250000, expense: 200000, profit: 50000 },
    { month: '二月', revenue: 220000, expense: 195000, profit: 25000 },
    { month: '三月', revenue: 280000, expense: 210000, profit: 70000 },
    { month: '四月', revenue: 300000, expense: 220000, profit: 80000 },
    { month: '五月', revenue: 320000, expense: 240000, profit: 80000 },
    { month: '六月', revenue: 340000, expense: 250000, profit: 90000 },
  ],
  
  // Key metrics
  keyMetrics: {
    foodCostRatio: 35, // 35%
    laborCostRatio: 28, // 28%
    profitMargin: 22, // 22%
    averageOrderValue: 320, // NT$320
    ordersPerDay: 95, // 95 orders per day
  }
};
