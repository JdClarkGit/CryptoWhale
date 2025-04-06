
import WalletSidebar from "@/components/WalletSidebar";
import TransactionFeed from "@/components/TransactionFeed";
import { useSettingsStore } from "@/store/store";

const Dashboard = () => {
  const { settings } = useSettingsStore();

  // Remove duplicate dark mode effect - now only handled in Index.tsx
  
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-[auto_1fr] h-[calc(100vh-64px)]">
      <WalletSidebar />
      <TransactionFeed />
    </div>
  );
};

export default Dashboard;
