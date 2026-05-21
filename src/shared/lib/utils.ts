export const Utils = {
    formatTime: (hour: number) => {
        if (hour === 0 || hour === 24) return '12:00 am';
        if (hour === 12) return '12:00 pm';
        return hour > 12 ? `${hour - 12}:00 pm` : `${hour}:00 am`;
    },

    getWeekStartIdentifier: (dateObj: Date) => {
        const d = new Date(dateObj);
        const day = d.getDay() || 7;
        d.setHours(-24 * (day - 1));
        return d.toISOString().split('T')[0];
    },

    getDatesOfWeek: (weekId: string) => {
        const startDate = new Date(weekId + 'T00:00:00');
        const dates = [];
        for (let i = 0; i < 7; i++) {
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