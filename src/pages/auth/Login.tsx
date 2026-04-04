export function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 bg-[#115e88]">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">HRMS Portal Login</h1>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href='/'; }}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" placeholder="admin@example.com" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115e88] outline-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115e88] outline-none" required />
          </div>
          <button type="submit" className="w-full bg-[#115e88] text-white p-3 rounded-lg font-semibold hover:bg-[#0d4d70] transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
