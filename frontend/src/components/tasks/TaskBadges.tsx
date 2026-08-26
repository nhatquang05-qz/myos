import React from 'react';
import { TaskPriority, TaskStatus } from '../../types/task';
import { Badge } from '../common/Badge';

export const TaskStatusBadge: React.FC<{ status: TaskStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'TODO':
      return <Badge variant="neutral" className={className}>Cần làm</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="info" className={className}>Đang làm</Badge>;
    case 'COMPLETED':
      return <Badge variant="success" className={className}>Hoàn thành</Badge>;
    case 'CANCELLED':
      return <Badge variant="danger" className={className}>Đã hủy</Badge>;
  }
};

export const TaskPriorityBadge: React.FC<{ priority: TaskPriority; className?: string }> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'LOW':
      return <Badge variant="neutral" className={className}>Thấp</Badge>;
    case 'MEDIUM':
      return <Badge variant="info" className={className}>Vừa</Badge>;
    case 'HIGH':
      return <Badge variant="warning" className={className}>Cao</Badge>;
    case 'URGENT':
      return <Badge variant="danger" className={className}>Khẩn cấp</Badge>;
  }
};