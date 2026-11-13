<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    //
    protected $fillable = [
        'user_id',
        'category_id',
        'transaction_date',
        'type',
        'amount',
        'description',
        'payment_method',
        'is_verified',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'amount' => 'integer',
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Scope untuk memfilter transaksi berdasarkan kata kunci description, type, category_id, dan rentang tanggal.
     *
     * @param  Builder  $query
     * @param  array<string, mixed>  $filters
     */
    public function scopeFilter(Builder $query, array $filters): void
    {
        // 1. Filter kata kunci pencarian pada description atau nama kategori
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $sub) use ($search) {
                $sub->where('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function (Builder $cat) use ($search) {
                        $cat->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // 2. Filter jenis transaksi (pemasukan / pengeluaran)
        if (! empty($filters['type']) && $filters['type'] !== 'semua') {
            $query->where('type', $filters['type']);
        }

        // 3. Filter kategori ID
        if (! empty($filters['category_id']) && $filters['category_id'] !== 'semua') {
            $query->where('category_id', $filters['category_id']);
        }

        // 4. Filter rentang tanggal transaksi (start_date & end_date)
        if (! empty($filters['start_date']) && ! empty($filters['end_date'])) {
            $query->whereBetween('transaction_date', [$filters['start_date'], $filters['end_date']]);
        } elseif (! empty($filters['start_date'])) {
            $query->where('transaction_date', '>=', $filters['start_date']);
        } elseif (! empty($filters['end_date'])) {
            $query->where('transaction_date', '<=', $filters['end_date']);
        }
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }
}
