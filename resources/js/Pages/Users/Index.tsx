import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Users, 
    Plus, 
    Pencil, 
    Trash2, 
    AlertTriangle, 
    ShieldAlert,
    CheckCircle2, 
    X, 
    Save, 
    UserCheck,
    UserX,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/atoms/Button';
import Input from '@/Components/atoms/Input';
import Select from '@/Components/atoms/Select';
import Modal from '@/Components/Modal';

declare function route(name?: string, params?: any): any;

export interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'pemilik' | 'admin' | 'kasir';
    is_active: boolean;
    transactions_count: number;
    created_at: string;
}

interface UsersIndexProps {
    users: UserItem[];
    currentUserId: number;
}

export default function UsersIndex({ users, currentUserId }: UsersIndexProps) {
    // State Tab Navigasi: 'list' (Daftar Pengguna) | 'create' (Tambah Pengguna)
    const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

    // State Modal Edit Pengguna
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    // State Modal Hapus Pengguna
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    // State Toggle Lihat/Sembunyikan Kata Sandi
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [showCreatePassword, setShowCreatePassword] = useState(false);

    // Form Tambah Pengguna
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'admin' as 'pemilik' | 'admin' | 'kasir',
        is_active: true,
    });

    // Form Edit Pengguna
    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'admin' as 'pemilik' | 'admin' | 'kasir',
        is_active: true,
    });

    // Efek Reveal Interaktif (Sinkron dengan AuthenticatedLayout & Desain Global)
    useEffect(() => {
        const triggerReveal = () => {
            const selector = '.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-on-scroll';
            const elements = document.querySelectorAll(selector);
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < windowHeight * 0.95 && rect.bottom > 20) {
                    el.classList.add('revealed');
                }
            });
        };

        const t1 = setTimeout(triggerReveal, 40);
        const t2 = setTimeout(triggerReveal, 150);
        const t3 = setTimeout(triggerReveal, 300);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [activeTab]);

    // Handle submit tambah pengguna
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            onSuccess: () => {
                createForm.reset();
                setShowCreatePassword(false);
                setActiveTab('list');
            },
        });
    };

    // Buka Modal Edit
    const openEditModal = (user: UserItem) => {
        setEditingUser(user);
        setShowEditPassword(false);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            is_active: user.is_active,
        });
        editForm.clearErrors();
    };

    // Tutup Modal Edit
    const closeEditModal = () => {
        setEditingUser(null);
        setShowEditPassword(false);
        editForm.reset();
        editForm.clearErrors();
    };

    // Handle submit edit pengguna
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(route('users.update', editingUser.id), {
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    // Buka Modal Konfirmasi Hapus
    const openDeleteModal = (user: UserItem) => {
        setDeletingUser(user);
    };

    // Tutup Modal Konfirmasi Hapus
    const closeDeleteModal = () => {
        setDeletingUser(null);
    };

    // Eksekusi Hapus Akun
    const handleDeleteExecute = () => {
        if (!deletingUser) return;

        router.delete(route('users.destroy', deletingUser.id), {
            onSuccess: () => {
                closeDeleteModal();
            },
        });
    };

    // Pilihan role untuk Select Dropdown
    const roleOptions = [
        { value: 'pemilik', label: 'Pemilik (Owner)' },
        { value: 'admin', label: 'Admin Operasional' },
        { value: 'kasir', label: 'Kasir Florist' },
    ];

    // Pilihan status untuk Select Dropdown
    const statusOptions = [
        { value: '1', label: 'Aktif' },
        { value: '0', label: 'Nonaktif' },
    ];

    // Helper label role
    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'pemilik': return 'Pemilik';
            case 'admin': return 'Admin';
            case 'kasir': return 'Kasir';
            default: return role;
        }
    };

    return (
        <AuthenticatedLayout header="Pengaturan Pengguna">
            <Head title="Pengaturan Pengguna - FLOWID Finance" />

            <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
                {/* ============================================================== */}
                {/* 1. PAGE HEADING SECTION                                        */}
                {/* ============================================================== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 reveal-left reveal-delay-100">
                        <div className="w-10 h-10 rounded-xl bg-[#2E6B4E]/10 text-[#2E6B4E] flex items-center justify-center shrink-0 mt-0.5 border border-[#2E6B4E]/15">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-sans">
                                Pengaturan Pengguna
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Kelola akun staf internal dan hak akses pengguna sistem FLOWID Finance.
                            </p>
                        </div>
                    </div>

                    {/* Tombol Aksi Cepat + Tambah Pengguna */}
                    <div className="reveal-right reveal-delay-150">
                        <button
                            type="button"
                            onClick={() => setActiveTab('create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E6B4E] hover:bg-[#25573F] text-white rounded-xl shadow-sm text-sm font-semibold transition active:scale-[0.98] shadow-emerald-900/10 cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Tambah Pengguna</span>
                        </button>
                    </div>
                </div>

                {/* ============================================================== */}
                {/* 2. PILL NAVIGATION (SEGMENTED CONTROL TOGGLE)                  */}
                {/* ============================================================== */}
                <div className="inline-flex items-center p-1 bg-white border border-[#E9E4DC] rounded-full self-start shadow-xs reveal-up reveal-delay-150">
                    <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === 'list'
                                ? 'bg-[#2E6B4E] text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-[#FAF8F5]'
                        }`}
                    >
                        Daftar Pengguna ({users.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('create')}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === 'create'
                                ? 'bg-[#2E6B4E] text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-[#FAF8F5]'
                        }`}
                    >
                        Tambah Pengguna
                    </button>
                </div>

                {/* ============================================================== */}
                {/* 3. TAB CONTENT 1: DAFTAR PENGGUNA (5-COLUMN TABLE)            */}
                {/* ============================================================== */}
                {activeTab === 'list' && (
                    <div className="bg-white rounded-2xl border border-[#ECE7DE] shadow-sm overflow-hidden reveal-up reveal-delay-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#F4EFEA] text-[13px] font-semibold text-gray-600 bg-[#FCFAF8]/70">
                                        <th scope="col" className="py-4 px-6">Nama</th>
                                        <th scope="col" className="py-4 px-6">Email</th>
                                        <th scope="col" className="py-4 px-6 text-center w-36">Role</th>
                                        <th scope="col" className="py-4 px-6 text-center w-32">Status</th>
                                        <th scope="col" className="py-4 px-6 text-center w-32">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F6F2EC] text-sm text-gray-700">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-400">
                                                Belum ada data pengguna yang terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u) => {
                                            const isCurrentUser = u.id === currentUserId;

                                            return (
                                                <tr key={u.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                                                    {/* Kolom 1: Nama */}
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            {/* Initial Avatar */}
                                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                                                                u.role === 'pemilik' 
                                                                    ? 'bg-[#E2F2E9] text-[#255C3E] border border-[#CDE5D6]' 
                                                                    : u.role === 'admin' 
                                                                        ? 'bg-[#FCECEE] text-[#C24158] border border-[#FAD0D6]' 
                                                                        : 'bg-[#FEF4E2] text-[#B27017] border border-[#FCE2B6]'
                                                            }`}>
                                                                {u.name.substring(0, 2)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-gray-900">
                                                                        {u.name}
                                                                    </span>
                                                                    {isCurrentUser && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E2F2E9] text-[#255C3E] border border-[#CDE5D6]">
                                                                            Anda
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs text-gray-400 sm:hidden">
                                                                    {u.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Kolom 2: Email */}
                                                    <td className="py-4 px-6 text-gray-600">
                                                        {u.email}
                                                    </td>

                                                    {/* Kolom 3: Role (Badge warna spesifik sesuai Design System) */}
                                                    <td className="py-4 px-6 text-center">
                                                        {u.role === 'pemilik' && (
                                                            <span className="inline-block px-3.5 py-1 text-xs font-semibold text-[#255C3E] bg-[#E2F2E9] rounded-full border border-[#CDE5D6]">
                                                                Pemilik
                                                            </span>
                                                        )}
                                                        {u.role === 'admin' && (
                                                            <span className="inline-block px-3.5 py-1 text-xs font-semibold text-[#C24158] bg-[#FCECEE] rounded-full border border-[#FAD0D6]">
                                                                Admin
                                                            </span>
                                                        )}
                                                        {u.role === 'kasir' && (
                                                            <span className="inline-block px-3.5 py-1 text-xs font-semibold text-[#B27017] bg-[#FEF4E2] rounded-full border border-[#FCE2B6]">
                                                                Kasir
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Kolom 4: Status */}
                                                    <td className="py-4 px-6 text-center">
                                                        {u.is_active ? (
                                                            <span className="inline-block px-3.5 py-1 text-xs font-semibold text-[#2E7A4A] bg-[#E3F4EA] rounded-full border border-[#CDE5D6]">
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block px-3.5 py-1 text-xs font-semibold text-stone-500 bg-stone-100 rounded-full border border-stone-200">
                                                                Nonaktif
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Kolom 5: Aksi (Edit & Hapus dengan Proteksi Self-Deletion) */}
                                                    <td className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {/* Tombol Edit */}
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditModal(u)}
                                                                aria-label={`Edit ${u.name}`}
                                                                title={`Edit ${u.name}`}
                                                                className="text-[#3A7B5A] hover:text-[#28573F] p-1.5 rounded-lg hover:bg-emerald-50 transition border border-[#D5E6DC] cursor-pointer"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>

                                                            {/* Tombol Hapus: Dilindungi jika user yang sedang login */}
                                                            {isCurrentUser ? (
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    aria-label="Tidak dapat menghapus akun sendiri"
                                                                    title="Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan."
                                                                    className="text-stone-300 bg-stone-50 p-1.5 rounded-lg border border-stone-200 cursor-not-allowed"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openDeleteModal(u)}
                                                                    aria-label={`Hapus ${u.name}`}
                                                                    title={`Hapus ${u.name}`}
                                                                    className="text-[#DF5160] hover:text-[#B93846] p-1.5 rounded-lg hover:bg-rose-50 transition border border-[#F6D0D5]/60 cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* 4. TAB CONTENT 2: FORM TAMBAH PENGGUNA                         */}
                {/* ============================================================== */}
                {activeTab === 'create' && (
                    <div className="bg-white rounded-2xl border border-[#ECE7DE] shadow-sm p-6 sm:p-8 max-w-2xl reveal-up reveal-delay-200">
                        <div className="border-b border-[#F4EFEA] pb-5 mb-6">
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                                Tambah Pengguna Baru
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Daftarkan staf baru untuk mengoperasikan sistem pencatatan keuangan FLOWID.
                            </p>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-5">
                            {/* Input Nama Lengkap */}
                            <Input
                                label="Nama Lengkap"
                                type="text"
                                placeholder="Contoh: Siti Aisyah"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                error={createForm.errors.name}
                                required
                            />

                            {/* Input Email */}
                            <Input
                                label="Alamat Email"
                                type="email"
                                placeholder="contoh: siti@flowid.id"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                error={createForm.errors.email}
                                required
                            />

                            {/* Input Kata Sandi */}
                            <Input
                                label="Kata Sandi"
                                type={showCreatePassword ? 'text' : 'password'}
                                placeholder="Minimal 6 karakter"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                error={createForm.errors.password}
                                helperText="Gunakan kombinasi karakter yang aman untuk staf."
                                required
                                suffixAction={
                                    <button
                                        type="button"
                                        onClick={() => setShowCreatePassword(!showCreatePassword)}
                                        aria-label={showCreatePassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                                        title={showCreatePassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                                        className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition cursor-pointer focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {showCreatePassword ? (
                                            <EyeOff className="w-4 h-4 text-stone-600" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                }
                            />

                            {/* Grid 2 Kolom: Role & Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label="Role Pengguna"
                                    options={roleOptions}
                                    value={createForm.data.role}
                                    onChange={(e) => createForm.setData('role', e.target.value as any)}
                                    error={createForm.errors.role}
                                />

                                <Select
                                    label="Status Akun"
                                    options={statusOptions}
                                    value={createForm.data.is_active ? '1' : '0'}
                                    onChange={(e) => createForm.setData('is_active', e.target.value === '1')}
                                    error={createForm.errors.is_active}
                                />
                            </div>

                            {/* Tombol Aksi Form Tambah */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4EFEA]">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        createForm.reset();
                                        setActiveTab('list');
                                    }}
                                    disabled={createForm.processing}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={createForm.processing}
                                >
                                    Simpan Pengguna
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* 5. MODAL EDIT PENGGUNA                                         */}
            {/* ============================================================== */}
            <Modal show={!!editingUser} onClose={closeEditModal} maxWidth="lg">
                <div className="p-6 bg-white rounded-2xl">
                    <div className="flex items-center justify-between pb-4 border-b border-[#F4EFEA]">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#2E6B4E]/10 text-[#2E6B4E] flex items-center justify-center shrink-0">
                                <Pencil className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                                    Edit Akun Pengguna
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Perbarui informasi, peran, atau status aktif pengguna.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={closeEditModal}
                            aria-label="Tutup modal edit"
                            title="Tutup modal"
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {editingUser && editingUser.id === currentUserId && (
                        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                            <span>
                                Anda sedang mengedit akun yang sedang aktif digunakan. Anda tidak dapat menonaktifkan akun sendiri.
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
                        <Input
                            label="Nama Lengkap"
                            type="text"
                            value={editForm.data.name}
                            onChange={(e) => editForm.setData('name', e.target.value)}
                            error={editForm.errors.name}
                            required
                        />

                        <Input
                            label="Alamat Email"
                            type="email"
                            value={editForm.data.email}
                            onChange={(e) => editForm.setData('email', e.target.value)}
                            error={editForm.errors.email}
                            required
                        />

                        <Input
                            label="Kata Sandi Baru (Opsional)"
                            type={showEditPassword ? 'text' : 'password'}
                            placeholder="Biarkan kosong jika tidak diubah"
                            value={editForm.data.password}
                            onChange={(e) => editForm.setData('password', e.target.value)}
                            error={editForm.errors.password}
                            helperText="Kosongkan jika ingin mempertahankan kata sandi saat ini."
                            suffixAction={
                                <button
                                    type="button"
                                    onClick={() => setShowEditPassword(!showEditPassword)}
                                    aria-label={showEditPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                                    title={showEditPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                                    className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition cursor-pointer focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showEditPassword ? (
                                        <EyeOff className="w-4 h-4 text-stone-600" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            }
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select
                                label="Role Pengguna"
                                options={roleOptions}
                                value={editForm.data.role}
                                onChange={(e) => editForm.setData('role', e.target.value as any)}
                                error={editForm.errors.role}
                            />

                            <div>
                                <Select
                                    label="Status Akun"
                                    options={statusOptions}
                                    value={editForm.data.is_active ? '1' : '0'}
                                    onChange={(e) => editForm.setData('is_active', e.target.value === '1')}
                                    error={editForm.errors.is_active}
                                    disabled={editingUser?.id === currentUserId}
                                />
                                {editingUser?.id === currentUserId && (
                                    <p className="text-[11px] text-stone-500 mt-1">
                                        Akun login harus tetap aktif
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4EFEA] mt-6">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={closeEditModal}
                                disabled={editForm.processing}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={editForm.processing}
                            >
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ============================================================== */}
            {/* 6. MODAL KONFIRMASI HAPUS PENGGUNA                             */}
            {/* ============================================================== */}
            <Modal show={!!deletingUser} onClose={closeDeleteModal} maxWidth="md">
                <div className="p-6 bg-white rounded-2xl">
                    <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                                Hapus Akun Pengguna
                            </h3>
                            <p className="text-xs text-gray-500">
                                Tindakan ini bersifat permanen.
                            </p>
                        </div>
                    </div>

                    {deletingUser && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Apakah Anda yakin ingin menghapus pengguna <strong className="text-gray-900 font-semibold">{deletingUser.name}</strong> ({deletingUser.email})?
                            </p>

                            {/* Peringatan Foreign Key jika user memiliki transaksi */}
                            {deletingUser.transactions_count > 0 ? (
                                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5">
                                    <div className="flex items-center gap-1.5 font-bold text-rose-900">
                                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                        <span>Perhatian: Data Terikat Transaksi</span>
                                    </div>
                                    <p className="leading-relaxed">
                                        Pengguna ini memiliki <strong>{deletingUser.transactions_count} riwayat transaksi</strong>. Sistem database akan mencegah penghapusan akun ini demi menjaga integritas data keuangan (foreign key constraint).
                                    </p>
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 text-xs">
                                    Pengguna ini belum memiliki riwayat transaksi, sehingga dapat dihapus dengan aman.
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4EFEA] mt-5">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={closeDeleteModal}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="button"
                                    variant="tonal-danger"
                                    onClick={handleDeleteExecute}
                                >
                                    Ya, Hapus Pengguna
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
