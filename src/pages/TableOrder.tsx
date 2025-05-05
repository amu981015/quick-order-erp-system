
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { menuItems, menuCategories, promotions } from "@/data/mockData";
import { Minus, Plus, ShoppingCart, ArrowLeft, Info, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

const TableOrder = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<typeof menuItems[0] | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemNote, setItemNote] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  // Set default category on mount
  useEffect(() => {
    if (menuCategories.length > 0) {
      setSelectedCategory(menuCategories[0].id);
    }
  }, []);

  // Get filtered menu items by category
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems;

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add item to cart from quick add
  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { 
          id: item.id, 
          name: item.name, 
          price: item.price, 
          quantity: 1 
        }];
      }
    });

    toast({
      title: "已加入購物車",
      description: `${item.name} x1`,
      duration: 1500,
    });
  };

  // Add item to cart from details dialog
  const addToCartWithDetails = () => {
    if (!selectedItem) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === selectedItem.id && 
        (itemNote ? cartItem.note === itemNote : !cartItem.note)
      );
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === selectedItem.id && (itemNote ? cartItem.note === itemNote : !cartItem.note)
            ? { ...cartItem, quantity: cartItem.quantity + itemQuantity } 
            : cartItem
        );
      } else {
        return [...prevCart, { 
          id: selectedItem.id, 
          name: selectedItem.name, 
          price: selectedItem.price, 
          quantity: itemQuantity,
          note: itemNote || undefined
        }];
      }
    });

    toast({
      title: "已加入購物車",
      description: `${selectedItem.name} x${itemQuantity}${itemNote ? ' (有特殊要求)' : ''}`,
      duration: 1500,
    });

    // Reset and close dialog
    setItemQuantity(1);
    setItemNote("");
    setSelectedItem(null);
  };

  // Update item quantity in cart
  const updateCartItemQuantity = (itemId: number, note: string | undefined, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId && item.note === note) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  // Submit order
  const submitOrder = () => {
    // Generate a random order number
    const newOrderNumber = Math.floor(1000 + Math.random() * 9000);
    setOrderNumber(newOrderNumber);
    setOrderCompleted(true);

    toast({
      title: "訂單已送出",
      description: `訂單編號: ${newOrderNumber}`,
    });
  };

  // Place a new order
  const placeNewOrder = () => {
    setCart([]);
    setOrderCompleted(false);
    setOrderNumber(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">快速點餐</h1>
            <p className="text-sm opacity-90">桌號: {tableId}</p>
          </div>
          <Button 
            variant="secondary"
            size="sm"
            className="relative"
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Promotions Banner */}
      {promotions.filter(p => p.active).length > 0 && (
        <div className="bg-yellow-100 p-3 text-yellow-800">
          <div className="container mx-auto">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">優惠活動</span>
            </div>
            <div className="mt-1">
              {promotions.filter(p => p.active).map(promo => (
                <div key={promo.id} className="text-sm py-1">
                  <span className="font-medium">{promo.name}:</span> {promo.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="border-b sticky top-16 bg-white z-10 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto whitespace-nowrap py-2">
          <div className="flex space-x-2">
            {menuCategories.map(category => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="min-w-fit"
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">
          {selectedCategory !== null && 
            menuCategories.find(c => c.id === selectedCategory)?.name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="menu-item hover-scale">
              <CardContent className="p-0">
                <div 
                  className="h-40 bg-cover bg-center rounded-t-lg cursor-pointer"
                  style={{ backgroundImage: `url(${item.image})` }}
                  onClick={() => {
                    setSelectedItem(item);
                    setItemQuantity(1);
                    setItemNote("");
                  }}
                ></div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="font-bold">NT$ {item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setItemQuantity(1);
                        setItemNote("");
                      }}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      詳細
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addToCart(item)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={open => !open && setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4 mt-2">
              <div className="relative h-48 rounded-md overflow-hidden">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <p className="text-muted-foreground">{selectedItem.description}</p>
                <p className="font-bold mt-2">NT$ {selectedItem.price}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="quantity">數量</Label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setItemQuantity(prev => Math.max(1, prev - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 font-medium">{itemQuantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setItemQuantity(prev => prev + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="note">特殊要求</Label>
                <Input
                  id="note"
                  placeholder="例如：不要辣、少鹽等"
                  value={itemNote}
                  onChange={e => setItemNote(e.target.value)}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full"
                  onClick={addToCartWithDetails}
                >
                  加入購物車 - NT$ {selectedItem.price * itemQuantity}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>購物車</DialogTitle>
          </DialogHeader>
          
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">購物車是空的</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowCart(false)}
              >
                繼續點餐
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.note && (
                        <div className="text-xs text-muted-foreground">
                          要求: {item.note}
                        </div>
                      )}
                      <div className="text-sm">NT$ {item.price} x {item.quantity}</div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCartItemQuantity(item.id, item.note, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCartItemQuantity(item.id, item.note, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex justify-between pt-2">
                <span className="font-medium">總計</span>
                <span className="font-bold">NT$ {cartTotal}</span>
              </div>

              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full"
                  onClick={submitOrder}
                >
                  送出訂單
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowCart(false)}
                >
                  繼續點餐
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Completed Dialog */}
      <Dialog open={orderCompleted} onOpenChange={setOrderCompleted}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>訂單已送出</DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium mb-1">感謝您的訂單</h3>
            <p className="text-muted-foreground mb-4">您的餐點正在準備中</p>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <div className="text-sm text-muted-foreground mb-2">訂單資訊</div>
              <div className="flex justify-between mb-1">
                <span>訂單編號:</span>
                <span className="font-medium">{orderNumber}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>桌號:</span>
                <span className="font-medium">{tableId}</span>
              </div>
              <div className="flex justify-between">
                <span>總金額:</span>
                <span className="font-medium">NT$ {cartTotal}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full"
                onClick={placeNewOrder}
              >
                再次點餐
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fixed Cart Button on Bottom */}
      {cart.length > 0 && !showCart && !orderCompleted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
          <div className="container mx-auto">
            <Button 
              className="w-full flex justify-between items-center"
              onClick={() => setShowCart(true)}
            >
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>購物車</span>
              </div>
              <div className="flex items-center">
                <span>{cartItemCount} 項</span>
                <span className="mx-2">|</span>
                <span>NT$ {cartTotal}</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOrder;
