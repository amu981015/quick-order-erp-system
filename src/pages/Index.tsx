
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">正在載入...</h1>
        <p className="text-lg text-gray-600">
          快速點餐 ERP 系統
        </p>
      </div>
    </div>
  );
};

export default Index;
