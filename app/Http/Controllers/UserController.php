<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Tampilkan halaman Daftar dan Kelola Pengguna (/users)
     */
    public function index(): Response
    {
        $users = User::withCount('transactions')
            ->orderBy('id')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'is_active' => (bool) $u->is_active,
                    'transactions_count' => (int) $u->transactions_count,
                    'created_at' => $u->created_at?->format('d/m/Y') ?? '-',
                ];
            });

        return Inertia::render('Users/Index', [
            'users' => $users,
            'currentUserId' => Auth::id(),
        ]);
    }

    /**
     * Simpan pengguna baru ke database (POST /users)
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', Rule::in(['pemilik', 'admin', 'kasir'])],
            'is_active' => ['boolean'],
        ], [
            'name.required' => 'Nama pengguna wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
            'role.required' => 'Role pengguna wajib dipilih.',
            'role.in' => 'Role tidak valid.',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('users.index')->with('success', 'Pengguna baru berhasil ditambahkan.');
    }

    /**
     * Perbarui data pengguna (PUT /users/{user})
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['required', Rule::in(['pemilik', 'admin', 'kasir'])],
            'is_active' => ['required', 'boolean'],
        ], [
            'name.required' => 'Nama pengguna wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh akun lain.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
            'role.required' => 'Role pengguna wajib dipilih.',
            'role.in' => 'Role tidak valid.',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'is_active' => (bool) $validated['is_active'],
        ];

        // Proteksi: User yang sedang login tidak boleh menonaktifkan dirinya sendiri
        if ($user->id === Auth::id() && !$updateData['is_active']) {
            return redirect()->back()->with('error', 'Anda tidak dapat menonaktifkan akun yang sedang Anda gunakan.');
        }

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('users.index')->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Hapus pengguna dari database (DELETE /users/{user})
     * Dilengkapi proteksi Self-Deletion Prevention dan Foreign Key Check transaksi
     */
    public function destroy(User $user): RedirectResponse
    {
        // 1. Proteksi Self-Deletion: Blokir jika user yang dihapus adalah user yang sedang login
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        // 2. Proteksi Foreign Key: Cek apakah user memiliki riwayat pencatatan transaksi
        if ($user->transactions()->exists()) {
            return redirect()->back()->with('error', 'Pengguna tidak dapat dihapus karena memiliki riwayat pencatatan transaksi dalam sistem.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil dihapus.');
    }
}

