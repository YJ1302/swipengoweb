import { ItineraryDay } from "@/types";

export function parseItinerary(value: string | undefined | null): ItineraryDay[] {
    if (!value) return [];
    const trimmed = value.trim();

    // Try JSON first (Option A)
    if (trimmed.startsWith('[')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map((item, index) => ({
                    id: item.id || `day-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    day: typeof item.day === 'number' ? item.day : index + 1,
                    title: item.title || '',
                    description: item.description || '',
                    image: item.image || ''
                }));
            }
        } catch {
            // Fall through 
        }
    }

    // Pipe-separated format (Legacy fallback): "Day 1: Title - Description | Day 2: ..."
    const days: ItineraryDay[] = [];
    const parts = trimmed.split('|');

    parts.forEach((part, index) => {
        const cleaned = part.trim();
        if (!cleaned) return;

        const dayMatch = cleaned.match(/^Day\s*(\d+)\s*[:\.]\s*([\s\S]+)/i);

        if (dayMatch) {
            const dayNum = parseInt(dayMatch[1]);
            let rest = dayMatch[2];
            let image: string | undefined;

            const imgMatch = rest.match(/!\[.*?\]\((.*?)\)/);
            if (imgMatch) {
                image = imgMatch[1];
                rest = rest.replace(imgMatch[0], '').trim();
            }

            let title = '';
            let description = '';

            const dashIndex = rest.indexOf(' - ');

            if (dashIndex > 0) {
                title = rest.substring(0, dashIndex).trim();
                description = rest.substring(dashIndex + 3).trim();
            } else {
                const simpleDash = rest.indexOf('-');
                if (simpleDash > 0 && simpleDash < 50) {
                    title = rest.substring(0, simpleDash).trim();
                    description = rest.substring(simpleDash + 1).trim();
                } else {
                    const lines = rest.split('\n');
                    if (lines.length > 1) {
                        title = lines[0].trim();
                        description = lines.slice(1).join('\n').trim();
                    } else {
                        title = `Day ${dayNum}`;
                        description = rest.trim();
                    }
                }
            }

            days.push({
                id: `day-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                day: dayNum,
                title,
                description,
                image
            });
        } else {
            days.push({
                id: `day-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                day: index + 1,
                title: `Day ${index + 1}`,
                description: cleaned
            });
        }
    });

    return days;
}

export function serializeItinerary(days: ItineraryDay[]): string {
    if (!days || days.length === 0) return '';

    // Save strictly as JSON layout (Robust Option A)
    const processedDays = days
        .sort((a, b) => a.day - b.day)
        .map(d => ({
            id: d.id,
            day: d.day,
            title: d.title.trim(),
            description: d.description.trim(),
            image: d.image ? d.image.trim() : undefined
        }));

    return JSON.stringify(processedDays);
}
