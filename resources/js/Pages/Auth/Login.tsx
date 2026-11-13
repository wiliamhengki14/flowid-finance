import React, { FormEventHandler, useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../../Components/atoms/Button';

declare function route(name?: string, params?: any): any;

export default function Login({ status }: { status?: string }) {
    // State untuk melihat / menyembunyikan kata sandi
    const [showPassword, setShowPassword] = useState(false);

    // Form state kosong untuk keamanan (tidak otomatis mengisi kredensial)
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(typeof route !== 'undefined' ? route('login') : '/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Masuk">
            {status && (
                <div className="mb-4 text-xs font-medium text-[#2E6B4E] bg-[#E8F3ED] p-3 rounded-xl border border-[#CDE5D6]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Input Email */}
                <div>
                    <label 
                        htmlFor="email"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                        Email Pengguna
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            placeholder="nama@flowid.id"
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2E6B4E]/20 ${
                                errors.email
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#E2D9CB] focus:border-[#2E6B4E]'
                            }`}
                        />
                    </div>
                    {errors.email && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email}</span>
                        </div>
                    )}
                </div>

                {/* Input Password dengan Toggle Icon Mata */}
                <div>
                    <label 
                        htmlFor="password"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            placeholder="Masukkan kata sandi"
                            onChange={(e) => setData('password', e.target.value)}
                            className={`w-full pl-10 pr-11 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2E6B4E]/20 ${
                                errors.password
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#E2D9CB] focus:border-[#2E6B4E]'
                            }`}
                        />
                        {/* Tombol Icon Mata Lihat/Sembunyikan Kata Sandi */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                            title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none transition-colors cursor-pointer"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4 text-slate-600" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.password}</span>
                        </div>
                    )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-[#D0C7B7] text-[#2E6B4E] focus:ring-[#2E6B4E] h-4 w-4"
                        />
                        <span className="text-xs text-slate-600 font-medium">Ingat saya di perangkat ini</span>
                    </label>
                </div>

                {/* Tombol Masuk dengan Atom Button */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={processing}
                        className="w-full shadow-md py-2.5 text-sm font-semibold rounded-xl"
                    >
                        Masuk ke Sistem
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
