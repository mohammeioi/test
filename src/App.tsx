import React from 'react';
import { Wallet } from 'lucide-react';
import { DebtForm } from './components/DebtForm';
import { DebtList } from './components/DebtList';
import type { Debt, DebtFormData, Payment } from './types';

const STORAGE_KEY = 'debt-tracker-data';

function App() {
  const [debts, setDebts] = React.useState<Debt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(debts));
  }, [debts]);

  const handleAddDebt = (data: DebtFormData) => {
    const newDebt: Debt = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      isPaid: false,
      collectionNotes: [],
      paymentHistory: [],
      ...data,
    };
    setDebts(prev => [newDebt, ...prev]);
  };

  const handleToggleDebt = (id: string) => {
    setDebts(prev => prev.map(debt =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    ));
  };

  const handleAddPayment = (debtId: string, paymentData: Omit<Payment, 'id'>) => {
    setDebts(prev => prev.map(debt => {
      if (debt.id === debtId) {
        const payment: Payment = {
          id: crypto.randomUUID(),
          ...paymentData,
        };
        const totalPaid = [...debt.paymentHistory, payment]
          .reduce((sum, p) => sum + p.amount, 0);
        
        return {
          ...debt,
          paymentHistory: [...debt.paymentHistory, payment],
          isPaid: totalPaid >= debt.amount,
        };
      }
      return debt;
    }));
  };

  const handleAddCollectionNote = (debtId: string, note: string) => {
    setDebts(prev => prev.map(debt =>
      debt.id === debtId
        ? { ...debt, collectionNotes: [...debt.collectionNotes, note] }
        : debt
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4 py-8 space-y-8">
        <header className="text-center">
          <div className="inline-flex items-center gap-2 text-blue-600 mb-2">
            <Wallet size={32} />
            <h1 className="text-3xl font-bold">Debt Tracker</h1>
          </div>
          <p className="text-gray-600">Keep track of who owes you money</p>
        </header>

        <div className="grid gap-8 md:grid-cols-[350px,1fr]">
          <DebtForm onSubmit={handleAddDebt} />
          <DebtList
            debts={debts}
            onToggleDebt={handleToggleDebt}
            onAddPayment={handleAddPayment}
            onAddCollectionNote={handleAddCollectionNote}
          />
        </div>
      </div>
    </div>
  );
}

export default App;