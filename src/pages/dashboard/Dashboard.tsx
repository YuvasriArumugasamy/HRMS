export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
          <div className="text-sm font-medium text-gray-500">Total Employees</div>
          <div className="text-3xl font-bold text-[#115e88]">128</div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
          <div className="text-sm font-medium text-gray-500">Active Departments</div>
          <div className="text-3xl font-bold text-[#115e88]">12</div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
          <div className="text-sm font-medium text-gray-500">New Joiners (Month)</div>
          <div className="text-3xl font-bold text-[#115e88]">5</div>
        </div>
      </div>
      <div className="p-8 bg-white border rounded-xl flex items-center justify-center text-gray-400">
         Quick Stats Visualization
      </div>
    </div>
  );
}
