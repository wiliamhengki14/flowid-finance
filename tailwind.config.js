import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{ts,tsx}',
    ],

    theme: {
        extend: {
            colors: {
                // Background & Surface Tokens
                'bg-canvas': '#FAF7F5',
                'bg-sidebar': '#F2EFE9',
                'bg-surface': '#FFFFFF',
                'bg-surface-muted': '#F6F8F6',

                // Brand & Primary Tokens (Botanical Forest)
                'brand-primary': '#23533B',
                'brand-primary-hover': '#1A3F2C',
                'brand-secondary': '#3B7A57',
                'brand-subtle': '#E6F2EC',

                // Semantic Financial & Accent Tokens (Blush & Rose)
                'finance-expense': '#D96B7B',
                'finance-expense-text': '#A83244',
                'finance-expense-subtle': '#FCECEE',
                'accent-gold': '#D99B26',
                'accent-gold-subtle': '#FEF6E6',
                'accent-gold-text': '#8C5E0A',
                'accent-lavender': '#A78BFA',
                'accent-sage-chart': '#74A88E',

                // Typography & Border Tokens
                'text-primary': '#18221D',
                'text-secondary': '#526058',
                'text-muted': '#84928A',
                'border-subtle': '#E6E2DD',
                'border-focus': '#23533B',
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
                display: ['"Playfair Display"', 'serif'],
                script: ['"Caveat"', 'cursive'],
            },
            boxShadow: {
                'card': '0 2px 10px -2px rgba(24, 34, 29, 0.05), 0 1px 3px -1px rgba(24, 34, 29, 0.03)',
                'dropdown': '0 10px 25px -5px rgba(24, 34, 29, 0.10), 0 4px 10px -2px rgba(24, 34, 29, 0.05)',
            },
        },
    },

    plugins: [forms],
};
