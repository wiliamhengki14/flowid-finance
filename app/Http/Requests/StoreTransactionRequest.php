<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Override;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'type' => ['required', Rule::in(['pemasukan', 'pengeluaran'])],
            'transaction_date' => ['required', 'date'],
            // Validasi Silang: Pastikan category_id ada di tabel categories DAN bertipe sesuai input 'type'
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')->where(function ($query) {
                    return $query->where('type', $this->input('type'));
                }),
            ],
            'amount' => ['required', 'integer', 'min:1'],
            'description' => ['required', 'string', 'max:255'],
            'payment_method' => ['required', Rule::in(['transfer', 'tunai', 'qris'])],
        ];
    }
    #[Override]
    public function messages(): array
    {
        return [
            'type.required' => 'Jenis transaksi wajib dipilih.',
            'transaction_date.required' => 'Tanggal transaksi wajib diisi.',
            'category_id.required' => 'Kategori transaksi wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak sesuai dengan jenis transaksi.',
            'amount.required' => 'Nominal transaksi wajib diisi.',
            'amount.min' => 'Nominal transaksi harus lebih dari Rp 0.',
            'description.required' => 'Keterangan transaksi wajib diisi.',
            'description.max' => 'Keterangan maksimal 255 karakter.',
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
        ];
    }
}
