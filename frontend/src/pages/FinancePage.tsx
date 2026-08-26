import React, { useEffect, useState } from 'react';
import { useFinanceStore } from '../stores/financeStore';
import {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '../types/transaction';
import { FinanceSummary } from '../components/finance/FinanceSummary';
import { TransactionFilters } from '../components/finance/TransactionFilters';
import { TransactionCard } from '../components/finance/TransactionCard';
import { TransactionModal } from '../components/finance/TransactionModal';
import { TransactionDeleteModal } from '../components/finance/TransactionDeleteModal';
import { Button } from '../components/common/Button';
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateFeedback';
import { Plus, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const FinancePage: React.FC = () => {
  const {
    transactions,
    categories,
    summary,
    pagination,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    fetchTransactions,
    fetchCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setPage,
    clearSuccessMessage,
  } = useFinanceStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setModalOpen(true);
  };

  const handleOpenDelete = (tx: Transaction) => {
    setDeletingTransaction(tx);
    setDeleteModalOpen(true);
  };

  const handleModalSubmit = async (
    data: CreateTransactionRequest | UpdateTransactionRequest
  ) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await createTransaction(data as CreateTransactionRequest);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingTransaction) {
      await deleteTransaction(deletingTransaction.id);
      setDeleteModalOpen(false);
      setDeletingTransaction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Add Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản trị Tài chính Cá nhân
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Theo dõi dòng tiền thu nhập, kiểm soát chi tiêu và cân đối ngân sách.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="space-x-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Thêm giao dịch</span>
        </Button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. Finance Summary Cards & Category Breakdown */}
      <FinanceSummary summary={summary} />

      {/* 3. Search & Filter Bar */}
      <TransactionFilters />

      {/* 4. Transactions List */}
      {isLoading && <LoadingState message="Đang tải danh sách giao dịch..." />}

      {error && !isLoading && <ErrorState message={error} onRetry={() => fetchTransactions()} />}

      {!isLoading && !error && transactions.length === 0 && (
        <EmptyState
          title="Chưa có giao dịch nào"
          description="Hãy tạo giao dịch thu/chi đầu tiên để bắt đầu quản lý dòng tiền cá nhân của bạn."
          actionLabel="+ Thêm giao dịch mới"
          onAction={handleOpenCreate}
        />
      )}

      {!isLoading && !error && transactions.length > 0 && (
        <>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hiển thị trang <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.page}</span> / {pagination.totalPages} ({pagination.total} giao dịch)
              </p>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Trang trước</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                  className="space-x-1"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        transaction={editingTransaction}
        categories={categories}
        isSubmitting={isSubmitting}
      />

      <TransactionDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        transaction={deletingTransaction}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};