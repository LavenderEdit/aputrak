export const DAY_ALIASES: Record<string, string> = {
    lunes: "Lunes",
    lun: "Lunes",
    lu: "Lunes",

    martes: "Martes",
    mar: "Martes",
    ma: "Martes",

    miercoles: "Miércoles",
    miércoles: "Miércoles",
    mie: "Miércoles",
    mié: "Miércoles",
    mi: "Miércoles",

    jueves: "Jueves",
    jue: "Jueves",
    ju: "Jueves",

    viernes: "Viernes",
    vie: "Viernes",
    vi: "Viernes",

    sabado: "Sábado",
    sábado: "Sábado",
    sab: "Sábado",
    sáb: "Sábado",
    sa: "Sábado",

    domingo: "Domingo",
    dom: "Domingo",
    do: "Domingo",
};

export const MERIDIEM_PATTERN = String.raw`(?:am|pm|a\.m\.|p\.m\.|a\s*m|p\s*m|prm|pnm|pim|pmm)`;