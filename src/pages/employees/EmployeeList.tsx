import { Users } from 'lucide-react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';

export const EmployeeList = () => {
  return (
    <PlaceholderPage 
      title="Employees Directory" 
      description="View and manage all employees in the system." 
      icon={<Users size={32} />} 
    />
  );
};
