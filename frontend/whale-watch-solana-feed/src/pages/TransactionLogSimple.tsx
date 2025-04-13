import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const TransactionLogSimple: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mb-6">
          Transaction History (Simple Version)
        </h1>
        
        <p className="text-white mb-6">
          This is a simplified version of the transaction log page to help diagnose rendering issues.
        </p>
        
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default TransactionLogSimple;
