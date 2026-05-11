export const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const THEME_COLORS: Record<number, string> = {
    0: 'bg-sky-400', 1: 'bg-teal-400', 2: 'bg-lime-400',
    3: 'bg-yellow-400', 4: 'bg-orange-400', 5: 'bg-pink-500', 6: 'bg-red-500',
};

export const DEFAULT_SETTINGS = {
    startHour: 8,
    endHour: 20,
    activeDays: [0, 1, 2, 3, 4]
};

export const ACTIVITY_COLORS = [
  { id: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', dot: 'bg-indigo-400', picker: 'bg-indigo-400' },
  { id: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', dot: 'bg-emerald-400', picker: 'bg-emerald-400' },
  { id: 'rose', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', dot: 'bg-rose-400', picker: 'bg-rose-400' },
  { id: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', dot: 'bg-amber-400', picker: 'bg-amber-400' },
  { id: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', dot: 'bg-purple-400', picker: 'bg-purple-400' },
];

export const SPANISH_SPEAKING_COUNTRIES = [
    'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GQ',
    'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'ES', 'UY', 'VE'
];