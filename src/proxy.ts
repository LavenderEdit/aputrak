import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "es"];
const defaultLocale = "en";

const spanishCountries = [
    "ES",
    "PE",
    "MX",
    "AR",
    "CO",
    "CL",
    "EC",
    "VE",
    "BO",
    "PY",
    "UY",
    "CR",
    "PA",
    "GT",
    "HN",
    "NI",
    "SV",
    "DO",
    "CU",
];

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Rate Limiting Logic
    if (ip !== "unknown") {
        const now = Date.now();
        const clientData = rateLimit.get(ip);

        if (clientData) {
            if (now - clientData.timestamp < RATE_LIMIT_WINDOW) {
                if (clientData.count >= MAX_REQUESTS) {
                    return new NextResponse("Too Many Requests", { status: 429 });
                }
                clientData.count++;
            } else {
                rateLimit.set(ip, { count: 1, timestamp: now });
            }
        } else {
            rateLimit.set(ip, { count: 1, timestamp: now });
        }
    }

    // Locale routing
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    let detectedLocale = request.cookies.get("NEXT_LOCALE")?.value || "";
    let detectedRegion = "US";

    if (!locales.includes(detectedLocale)) {
        try {
            if (ip !== "unknown") {
                const response = await fetch(
                    `http://ip-api.com/json/${ip}?fields=countryCode`
                );
                const data = await response.json();

                if (data && data.countryCode) {
                    detectedRegion = data.countryCode.toUpperCase();
                    detectedLocale = spanishCountries.includes(detectedRegion) ? "es" : "en";
                } else {
                    detectedLocale = defaultLocale;
                }
            } else {
                detectedLocale = defaultLocale;
            }
        } catch (error) {
            console.error("Error detecting country:", error);
            detectedLocale = defaultLocale;
        }
    }

    if (!pathnameHasLocale && !pathname.startsWith('/_next') && !pathname.startsWith('/api') && !pathname.includes('.')) {
        const response = NextResponse.next();
        response.cookies.set("NEXT_LOCALE", detectedLocale, {
            path: "/",
            maxAge: 31536000, 
        });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
