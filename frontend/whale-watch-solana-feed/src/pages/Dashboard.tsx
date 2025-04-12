import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { SolanaWalletManager } from '../components/SolanaWalletManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 text-white">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please log in to access the dashboard
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              CryptoWhale Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome, {userProfile?.displayName || currentUser.email}
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="mt-4 md:mt-0 border-gray-700 hover:bg-gray-800"
          >
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wallet">Solana Wallet</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your account details and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="font-medium">{currentUser.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">User ID</p>
                        <p className="font-medium text-sm truncate">{currentUser.uid}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Account Status</p>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <p className="font-medium">Active</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Common tasks and operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                      Connect Wallet
                    </Button>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      View Transactions
                    </Button>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      Portfolio Analysis
                    </Button>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      Market Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Solana Wallet Tab */}
          <TabsContent value="wallet">
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle>Solana Wallet Manager</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your Solana wallets with our Rust-powered integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SolanaWalletManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 mb-2">Profile Information</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Display Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1"
                            defaultValue={userProfile?.displayName || ''}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Email</label>
                          <input 
                            type="email" 
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1"
                            defaultValue={currentUser.email || ''}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
