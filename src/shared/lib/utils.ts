import { DAYS_IN_WEEK, HOURS_IN_DAY } from "./constants";

export const Utils = {
    /**
     * Formatea una hora en formato militar a formato de 12 horas (AM/PM).
     */
    formatTime: (hour: number) => {
        const MIDNIGHT = 0;
        const NOON = 12;

        if (hour === MIDNIGHT || hour === HOURS_IN_DAY) return '12:00 am';
        if (hour === NOON) return '12:00 pm';
        return hour > NOON ? `${hour - NOON}:00 pm` : `${hour}:00 am`;
    },

    /**
     * Obtiene el identificador de inicio de la semana (Lunes) en formato YYYY-MM-DD.
     * Resta el offset necesario a las horas para encontrar el Lunes más cercano.
     */
    getWeekStartIdentifier: (dateObj: Date) => {
        const d = new Date(dateObj);
        // getDay() devuelve 0 para Domingo. Lo convertimos a 7 para que la semana empiece en Lunes (1).
        const dayOfWeek = d.getDay() || DAYS_IN_WEEK;
        // Ajustamos la fecha retrocediendo las horas correspondientes para llegar al lunes anterior
        d.setHours(-HOURS_IN_DAY * (dayOfWeek - 1));
        return d.toISOString().split('T')[0];
    },

    /**
     * Devuelve un array de strings con formato DD/MM/YY correspondientes a los 7 días de la semana
     * a partir del identificador de la semana actual.
     */
    getDatesOfWeek: (weekId: string) => {
        const startDate = new Date(weekId + 'T00:00:00');
        const dates = [];
        for (let i = 0; i < DAYS_IN_WEEK; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = String(d.getFullYear()).slice(-2);
            dates.push(`${day}/${month}/${year}`);
        }
        return dates;
    },

    loadExportScripts: async () => {
        const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) return resolve();
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    },

    exportToJSON: (data: unknown, filename: string) => {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};