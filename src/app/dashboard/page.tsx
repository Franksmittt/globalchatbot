import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}