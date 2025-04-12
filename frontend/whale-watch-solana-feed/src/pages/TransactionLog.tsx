import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: "buy",
    asset: "SOL",
    amount: 10.5,
    price: 102.75,
    total: 1078.88,
    fee: 2.5,
    status: "completed",
    exchange: "Coinbase",
    wallet: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV"
  },
  {
    id: "tx2",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    type: "sell",
    asset: "ETH",
    amount: 1.2,
    price: 3450.25,
    total: 4140.30,
    fee: 8.75,
    status: "completed",
    exchange: "Binance",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  {
    id: "tx3",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    type: "transfer",
    asset: "BTC",
    amount: 0.25,
    price: 42500.00,
    total: 10625.00,
    fee: 0.0005,
    status: "completed",
    exchange: null,
    wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  },
  {
    id: "tx4",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    type: "buy",
    asset: "AVAX",
    amount: 50,
    price: 28.75,
    total: 1437.50,
    fee: 3.25,
    status: "completed",
    exchange: "Kraken",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  {
    id: "tx5",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    type: "buy",
    asset: "SOL",
    amount: 25,
    price: 98.50,
    total: 2462.50,
    fee: 5.75,
    status: "completed",
    exchange: "Coinbase",
    wallet: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV"
  },
  {
    id: "tx6",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: "sell",
    asset: "BTC",
    amount: 0.1,
    price: 43250.00,
    total: 4325.00,
    fee: 8.65,
    status: "pending",
    exchange: "Binance",
    wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  }
];

const TransactionLog = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  
  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [assetFilter, setAssetFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination settings
  const itemsPerPage = 5;

  // Get the dark mode state from localStorage if available
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
    }
  }, []);

  // Filter and sort transactions
  const filteredTransactions = mockTransactions.filter(tx => {
    // Search term filter (case insensitive)
    if (searchTerm && !Object.values(tx).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Asset filter
    if (assetFilter && tx.asset !== assetFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter && tx.type !== typeFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter && tx.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc" 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortField === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    }
    
    if (sortField === "total") {
      return sortDirection === "asc" ? a.total - b.total : b.total - a.total;
    }
    
    // Default sort by date desc
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Paginate transactions
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setAssetFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // Get unique asset types for filter dropdown
  const uniqueAssets = Array.from(new Set(mockTransactions.map(tx => tx.asset)));
  
  // Get transaction type options
  const transactionTypes = ["buy", "sell", "transfer"];
  
  // Get transaction status options
  const statusTypes = ["completed", "pending", "failed"];

  // View transaction details
  const viewTransactionDetails = (txId: string) => {
    setSelectedTransaction(selectedTransaction === txId ? null : txId);
  };

  // Theme classes
  const themeClasses = darkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-100 text-gray-900";
  
  const cardClasses = darkMode 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 text-white">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please log in to view your transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses} p-4 md:p-8 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-white">
              View and analyze your crypto transaction history
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-teal-500 text-teal-400 hover:bg-gray-700 hover:text-teal-300"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className={`mb-6 ${cardClasses}`}>
          <CardHeader>
            <CardTitle className="text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <Select value={assetFilter} onValueChange={setAssetFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Asset" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="">All Assets</SelectItem>
                  {uniqueAssets.map(asset => (
                    <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="">All Types</SelectItem>
                  {transactionTypes.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="">All Statuses</SelectItem>
                  {statusTypes.map(status => (
                    <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className="text-white">Transactions</CardTitle>
            <CardDescription className="text-gray-400">
              {filteredTransactions.length} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : paginatedTransactions.length === 0 ? (
              <div className="text-center py-16 text-white">
                <p className="text-gray-400 mb-4">No transactions found</p>
                <Button 
                  onClick={resetFilters}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead 
                          className="text-white cursor-pointer"
                          onClick={() => handleSort("date")}
                        >
                          Date
                          {sortField === "date" && (
                            sortDirection === "asc" ? 
                              <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                              <ArrowDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white">Asset</TableHead>
                        <TableHead 
                          className="text-white cursor-pointer"
                          onClick={() => handleSort("amount")}
                        >
                          Amount
                          {sortField === "amount" && (
                            sortDirection === "asc" ? 
                              <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                              <ArrowDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="text-white cursor-pointer"
                          onClick={() => handleSort("price")}
                        >
                          Price
                          {sortField === "price" && (
                            sortDirection === "asc" ? 
                              <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                              <ArrowDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="text-white cursor-pointer"
                          onClick={() => handleSort("total")}
                        >
                          Total
                          {sortField === "total" && (
                            sortDirection === "asc" ? 
                              <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                              <ArrowDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTransactions.map((tx) => (
                        <React.Fragment key={tx.id}>
                          <TableRow className="border-gray-700 hover:bg-gray-700">
                            <TableCell className="text-white">
                              {new Date(tx.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  tx.type === "buy" 
                                    ? "bg-green-900 text-green-300" 
                                    : tx.type === "sell"
                                    ? "bg-red-900 text-red-300"
                                    : "bg-blue-900 text-blue-300"
                                }
                              >
                                {tx.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white">{tx.asset}</TableCell>
                            <TableCell className="text-white">{tx.amount}</TableCell>
                            <TableCell className="text-white">${tx.price.toFixed(2)}</TableCell>
                            <TableCell className="text-white">${tx.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  tx.status === "completed" 
                                    ? "bg-green-900 text-green-300" 
                                    : tx.status === "pending"
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-red-900 text-red-300"
                                }
                              >
                                {tx.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewTransactionDetails(tx.id)}
                                className="text-teal-400 hover:text-teal-300 hover:bg-gray-700"
                              >
                                {selectedTransaction === tx.id ? "Hide" : "View"}
                              </Button>
                            </TableCell>
                          </TableRow>
                          
                          {/* Transaction Details */}
                          {selectedTransaction === tx.id && (
                            <TableRow className="border-gray-700 bg-gray-700">
                              <TableCell colSpan={8} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-white font-medium mb-2">Transaction Details</h4>
                                    <p className="text-gray-300">
                                      <span className="text-gray-400">ID:</span> {tx.id}
                                    </p>
                                    <p className="text-gray-300">
                                      <span className="text-gray-400">Date:</span> {new Date(tx.date).toLocaleString()}
                                    </p>
                                    <p className="text-gray-300">
                                      <span className="text-gray-400">Fee:</span> ${tx.fee.toFixed(2)}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-white font-medium mb-2">Source/Destination</h4>
                                    {tx.exchange && (
                                      <p className="text-gray-300">
                                        <span className="text-gray-400">Exchange:</span> {tx.exchange}
                                      </p>
                                    )}
                                    <p className="text-gray-300">
                                      <span className="text-gray-400">Wallet:</span> {tx.wallet.substring(0, 8)}...{tx.wallet.substring(tx.wallet.length - 8)}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-400">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? "bg-teal-600 text-white hover:bg-teal-700"
                              : "border-gray-600 text-white hover:bg-gray-700"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionLog;
