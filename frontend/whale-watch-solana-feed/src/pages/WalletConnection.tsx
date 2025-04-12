import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Copy, ExternalLink, Trash2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock wallet data
const mockWallets = [
  {
    id: "wallet1",
    walletType: "solana",
    walletAddress: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV",
    publicKey: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV",
    connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: "wallet2",
    walletType: "ethereum",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    publicKey: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    connectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
  },
  {
    id: "wallet3",
    walletType: "bitcoin",
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    publicKey: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  }
];

// Mock exchange data
const mockExchanges = [
  {
    id: "exchange1",
    exchangeType: "coinbase",
    apiKey: "CBPRO_API_KEY_12345",
    apiSecret: "********",
    connectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: "exchange2",
    exchangeType: "binance",
    apiKey: "BINANCE_API_KEY_67890",
    apiSecret: "********",
    connectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  }
];

const WalletConnection = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("wallets");
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<string>("");
  const [selectedExchangeType, setSelectedExchangeType] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Mock data states
  const [wallets, setWallets] = useState(mockWallets);
  const [exchanges, setExchanges] = useState(mockExchanges);
  const [isLoading, setIsLoading] = useState(false);

  // Get the dark mode state from localStorage if available
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
    }
  }, []);

  const resetWalletForm = () => {
    setSelectedWalletType("");
    setWalletAddress("");
    setPublicKey("");
  };

  const resetExchangeForm = () => {
    setSelectedExchangeType("");
    setApiKey("");
    setApiSecret("");
  };

  const handleConnectWallet = () => {
    if (!currentUser) {
      setError("You must be logged in to connect a wallet.");
      return;
    }

    if (!selectedWalletType) {
      setError("Please select a wallet type.");
      return;
    }

    if (!walletAddress) {
      setError("Please enter a wallet address.");
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const newWallet = {
        id: `wallet${wallets.length + 1}`,
        walletType: selectedWalletType,
        walletAddress,
        publicKey: publicKey || walletAddress,
        connectedAt: new Date().toISOString()
      };
      
      setWallets([...wallets, newWallet]);
      setWalletDialogOpen(false);
      setSuccess("Wallet connected successfully!");
      setTimeout(() => setSuccess(null), 3000);
      resetWalletForm();
      setIsLoading(false);
    }, 1000);
  };

  const handleConnectExchange = () => {
    if (!currentUser) {
      setError("You must be logged in to connect an exchange.");
      return;
    }

    if (!selectedExchangeType) {
      setError("Please select an exchange.");
      return;
    }

    if (!apiKey || !apiSecret) {
      setError("API key and secret are required.");
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const newExchange = {
        id: `exchange${exchanges.length + 1}`,
        exchangeType: selectedExchangeType,
        apiKey,
        apiSecret: "********",
        connectedAt: new Date().toISOString()
      };
      
      setExchanges([...exchanges, newExchange]);
      setExchangeDialogOpen(false);
      setSuccess("Exchange connected successfully!");
      setTimeout(() => setSuccess(null), 3000);
      resetExchangeForm();
      setIsLoading(false);
    }, 1000);
  };

  const handleDisconnectWallet = (walletId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setWallets(wallets.filter(wallet => wallet.id !== walletId));
      setSuccess("Wallet disconnected successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setIsLoading(false);
    }, 500);
  };

  const handleDisconnectExchange = (exchangeId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setExchanges(exchanges.filter(exchange => exchange.id !== exchangeId));
      setSuccess("Exchange disconnected successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setIsLoading(false);
    }, 500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
    setTimeout(() => setSuccess(null), 2000);
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
              Please log in to manage your wallet connections
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
              Wallet & Exchange Connections
            </h1>
            <p className="text-white">
              Connect your crypto wallets and trading accounts
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

        {/* Success/Error Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-900 border-green-800">
            <Check className="h-4 w-4 text-green-400" />
            <AlertTitle className="text-green-400">Success</AlertTitle>
            <AlertDescription className="text-green-300">{success}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="wallets" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border-gray-700 mb-6">
            <TabsTrigger value="wallets" className="text-white data-[state=active]:bg-teal-600">Crypto Wallets</TabsTrigger>
            <TabsTrigger value="exchanges" className="text-white data-[state=active]:bg-teal-600">Trading Accounts</TabsTrigger>
          </TabsList>
          
          {/* Wallets Tab */}
          <TabsContent value="wallets">
            <div className="grid grid-cols-1 gap-6">
              <Card className={cardClasses}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Connected Wallets</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your connected crypto wallets
                    </CardDescription>
                  </div>
                  <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Wallet
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white border-gray-700">
                      <DialogHeader>
                        <DialogTitle>Connect a Crypto Wallet</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Connect your wallet to track your assets and transactions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="walletType">Wallet Type</Label>
                          <Select
                            value={selectedWalletType}
                            onValueChange={setSelectedWalletType}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select wallet type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600 text-white">
                              <SelectItem value="solana">Solana (Phantom, Solflare)</SelectItem>
                              <SelectItem value="ethereum">Ethereum (MetaMask)</SelectItem>
                              <SelectItem value="bitcoin">Bitcoin</SelectItem>
                              <SelectItem value="binance">Binance Chain</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="walletAddress">Wallet Address</Label>
                          <Input
                            id="walletAddress"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="publicKey">Public Key (Optional)</Label>
                          <Input
                            id="publicKey"
                            value={publicKey}
                            onChange={(e) => setPublicKey(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setWalletDialogOpen(false)}
                          className="border-gray-600 text-white hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleConnectWallet}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-teal-500 to-cyan-600"
                        >
                          {isLoading ? "Connecting..." : "Connect Wallet"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  ) : wallets.length === 0 ? (
                    <div className="text-center py-16 text-white">
                      <p className="text-gray-400 mb-4">No wallets connected yet</p>
                      <Button 
                        onClick={() => setWalletDialogOpen(true)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Your First Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wallets.map((wallet) => (
                        <Card key={wallet.id} className="bg-gray-700 border-gray-600">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-white capitalize">
                                  {wallet.walletType} Wallet
                                </h3>
                                <div className="flex items-center mt-2">
                                  <p className="text-sm text-gray-300 truncate max-w-[200px] md:max-w-[300px]">
                                    {wallet.walletAddress}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(wallet.walletAddress)}
                                    className="ml-2 h-8 w-8 text-gray-400 hover:text-white"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                  Connected on {new Date(wallet.connectedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center mt-4 md:mt-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    let explorerUrl = "";
                                    switch(wallet.walletType) {
                                      case "solana":
                                        explorerUrl = `https://explorer.solana.com/address/${wallet.walletAddress}`;
                                        break;
                                      case "ethereum":
                                        explorerUrl = `https://etherscan.io/address/${wallet.walletAddress}`;
                                        break;
                                      case "bitcoin":
                                        explorerUrl = `https://www.blockchain.com/explorer/addresses/btc/${wallet.walletAddress}`;
                                        break;
                                      default:
                                        explorerUrl = "#";
                                    }
                                    window.open(explorerUrl, '_blank');
                                  }}
                                  className="mr-2 border-gray-600 text-white hover:bg-gray-600"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Explorer
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDisconnectWallet(wallet.id)}
                                  className="bg-red-900 hover:bg-red-800 text-white"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Disconnect
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Exchanges Tab */}
          <TabsContent value="exchanges">
            <div className="grid grid-cols-1 gap-6">
              <Card className={cardClasses}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Connected Exchanges</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your connected trading accounts
                    </CardDescription>
                  </div>
                  <Dialog open={exchangeDialogOpen} onOpenChange={setExchangeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Exchange
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white border-gray-700">
                      <DialogHeader>
                        <DialogTitle>Connect a Trading Account</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Connect your exchange or trading platform account
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="exchangeType">Exchange Type</Label>
                          <Select
                            value={selectedExchangeType}
                            onValueChange={setSelectedExchangeType}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select exchange" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600 text-white">
                              <SelectItem value="coinbase">Coinbase</SelectItem>
                              <SelectItem value="binance">Binance</SelectItem>
                              <SelectItem value="kraken">Kraken</SelectItem>
                              <SelectItem value="tdameritrade">TD Ameritrade</SelectItem>
                              <SelectItem value="alpaca">Alpaca</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apiSecret">API Secret</Label>
                          <Input
                            id="apiSecret"
                            type="password"
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <Alert className="bg-gray-700 border-gray-600">
                          <AlertCircle className="h-4 w-4 text-yellow-400" />
                          <AlertTitle className="text-yellow-400">Security Note</AlertTitle>
                          <AlertDescription className="text-gray-300">
                            We recommend using read-only API keys for security. Your API credentials are encrypted and stored securely.
                          </AlertDescription>
                        </Alert>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setExchangeDialogOpen(false)}
                          className="border-gray-600 text-white hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleConnectExchange}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-teal-500 to-cyan-600"
                        >
                          {isLoading ? "Connecting..." : "Connect Exchange"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  ) : exchanges.length === 0 ? (
                    <div className="text-center py-16 text-white">
                      <p className="text-gray-400 mb-4">No exchanges connected yet</p>
                      <Button 
                        onClick={() => setExchangeDialogOpen(true)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Your First Exchange
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {exchanges.map((exchange) => (
                        <Card key={exchange.id} className="bg-gray-700 border-gray-600">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-white capitalize">
                                  {exchange.exchangeType}
                                </h3>
                                <div className="flex items-center mt-2">
                                  <p className="text-sm text-gray-300 truncate max-w-[200px] md:max-w-[300px]">
                                    API Key: {exchange.apiKey.substring(0, 8)}...
                                  </p>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                  Connected on {new Date(exchange.connectedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center mt-4 md:mt-0">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDisconnectExchange(exchange.id)}
                                  className="bg-red-900 hover:bg-red-800 text-white"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Disconnect
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletConnection;
