import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { dashboardApi } from "../api/dashboard.api";
import type { DashboardUser, DashboardUserListResponse } from "../types";

const PAGE_SIZE = 8;

const formatJoinedDate = (iso?: string) => {
	if (!iso) return "-";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "-";
	return d.toLocaleDateString();
};

const shortId = (id: string) => {
	if (!id) return "-";
	return id.slice(-4);
};

const CustomersPage: React.FC = () => {
	const [users, setUsers] = useState<DashboardUser[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [pages, setPages] = useState(1);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadUsers = async (nextPage: number, nextSearch: string) => {
		setLoading(true);
		setError(null);
		try {
			const res: DashboardUserListResponse = await dashboardApi.getUsers({
				page: nextPage,
				limit: PAGE_SIZE,
				search: nextSearch || undefined,
			});
			setUsers(res.data);
			setPage(res.pagination.page);
			setTotal(res.pagination.total);
			setPages(res.pagination.pages);
		} catch (e) {
			setError("Failed to load users");
			setUsers([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers(page, search);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		loadUsers(1, value);
	};

	const handlePageChange = (next: number) => {
		if (next < 1 || next > pages || next === page) return;
		loadUsers(next, search);
	};

	const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
	const to = Math.min(page * PAGE_SIZE, total);

	const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).slice(0, 5);

	return (
		<div className="min-h-screen bg-[#f5f7fb] p-8 flex flex-col">
			<div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-xl font-semibold text-slate-900">Manage Customers</h1>
						<p className="text-sm text-slate-500 mt-1">
							Manage all your customers here !
						</p>
					</div>
					<button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
						<Plus size={16} />
						Add Customer
					</button>
				</div>

				{/* Card */}
				<div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col">
					{/* Card header with search */}
					<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
						<h2 className="text-sm font-semibold text-slate-800">Customer List</h2>
						<div className="relative w-64">
							<Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
							<input
								type="text"
								placeholder="Search by name, email, or phone"
								value={search}
								onChange={handleSearchChange}
								className="w-full pl-9 pr-3 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>

					{/* Table */}
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead>
								<tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
									<th className="px-6 py-3 text-left">User ID</th>
									<th className="px-6 py-3 text-left">Name</th>
									<th className="px-6 py-3 text-left">Email</th>
									<th className="px-6 py-3 text-left">Role</th>
									<th className="px-6 py-3 text-left">Joined Date</th>
									<th className="px-6 py-3 text-left">Status</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td colSpan={5} className="px-6 py-12 text-center text-slate-400">
											Loading customers...
										</td>
									</tr>
								) : error ? (
									<tr>
										<td colSpan={5} className="px-6 py-12 text-center text-red-500">
											{error}
										</td>
									</tr>
								) : users.length === 0 ? (
									<tr>
										<td colSpan={5} className="px-6 py-12 text-center text-slate-400">
											No customers found
										</td>
									</tr>
								) : (
									users.map((user) => (
										<tr key={user._id} className="border-t border-slate-100 hover:bg-slate-50/60">
											<td className="px-6 py-4 text-blue-600 font-medium">
												<span className="text-xs text-slate-400 mr-1">CU -</span>
												<span>{shortId(user._id)}</span>
											</td>
											<td className="px-6 py-4 text-slate-900 font-medium">{user.name}</td>
											<td className="px-6 py-4 text-slate-600">{user.email}</td>
											<td className="px-6 py-4 text-slate-600 capitalize">{user.role.toLowerCase()}</td>
											<td className="px-6 py-4 text-slate-600">
												{formatJoinedDate(user.createdAt)}
											</td>
											<td className="px-6 py-4">
												<span
													className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
														user.isActive
															? "bg-emerald-50 text-emerald-700"
															: "bg-rose-50 text-rose-700"
													}`}
												>
													<span
														className={`w-1.5 h-1.5 rounded-full ${
															user.isActive ? "bg-emerald-500" : "bg-rose-500"
														}`}
													/>
													{user.isActive ? "Active" : "Inactive"}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Footer / Pagination */}
					<div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
						<div>
							Showing {from} to {to} of {total} results
						</div>
						<div className="flex items-center gap-1">
							<button
								onClick={() => handlePageChange(page - 1)}
								disabled={page <= 1}
								className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-md bg-white disabled:opacity-40 disabled:cursor-not-allowed text-xs"
							>
								<ChevronLeft size={14} className="mr-1" />
								Previous
							</button>
							{pageNumbers.map((p) => (
								<button
									key={p}
									onClick={() => handlePageChange(p)}
									className={`px-3 py-1.5 text-xs rounded-md border ${
										p === page
											? "bg-blue-500 text-white border-blue-500"
											: "bg-white text-slate-700 border-slate-200"
										}`}
								>
									{p}
								</button>
							))}
							<button
								onClick={() => handlePageChange(page + 1)}
								disabled={page >= pages}
								className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-md bg-white disabled:opacity-40 disabled:cursor-not-allowed text-xs"
							>
								Next
								<ChevronRight size={14} className="ml-1" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomersPage;
