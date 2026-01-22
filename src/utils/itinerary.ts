import { ItineraryDay } from "@/types";

export function parseItinerary(value: string | undefined | null): ItineraryDay[] {
    if (!value) return [];
    const trimmed = value.trim();

    // Try JSON first
    if (trimmed.startsWith('[')) {
        try {
            return JSON.parse(trimmed);
        } catch {
            // Fall through 
        }
    }

    // Pipe-separated format: "Day 1: Title - Description | Day 2: ..."
    const days: ItineraryDay[] = [];
    const parts = trimmed.split('|');

    parts.forEach((part, index) => {
        const cleaned = part.trim();
        if (!cleaned) return;

        // Try to parse "Day N: Title - Description"
        // Use [\s\S] to match valid content including newlines
        const dayMatch = cleaned.match(/^Day\s*(\d+)\s*[:\.]\s*([\s\S]+)/i);

        if (dayMatch) {
            const dayNum = parseInt(dayMatch[1]);
            let rest = dayMatch[2];
            let image: string | undefined;

            // Extract Markdown Image if present: ![alt](url)
            const imgMatch = rest.match(/!\[.*?\]\((.*?)\)/);
            if (imgMatch) {
                image = imgMatch[1];
                rest = rest.replace(imgMatch[0], '').trim();
            }

            let title = '';
            let description = '';

            // Limit title search to first line if possible, or look for separator
            const dashIndex = rest.indexOf(' - ');

            if (dashIndex > 0) {
                // Check if dash is reasonably close to start (e.g. valid title length)
                title = rest.substring(0, dashIndex).trim();
                description = rest.substring(dashIndex + 3).trim();
            } else {
                // Fallback: Check for single dash
                const simpleDash = rest.indexOf('-');
                // Ensure simple dash is within fitst 50 chars to call it a title separator
                if (simpleDash > 0 && simpleDash < 50) {
                    title = rest.substring(0, simpleDash).trim();
                    description = rest.substring(simpleDash + 1).trim();
                } else {
                    // No separator found.
                    // If it's multiline, maybe First Line is title?
                    const lines = rest.split('\n');
                    if (lines.length > 1) {
                        title = lines[0].trim();
                        description = lines.slice(1).join('\n').trim();
                    } else {
                        // Title - Details format missing
                        title = `Day ${dayNum}`;
                        description = rest.trim();
                    }
                }
            }

            days.push({
                day: dayNum,
                title,
                description,
                image
            });
        } else {
            // Fallback for Malformed 'Day X' or just text
            days.push({
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

    return days
        .sort((a, b) => a.day - b.day)
        .map(d => {
            const title = d.title.trim();
            let desc = d.description.trim();

            // Append image markdown if exists
            if (d.image && d.image.trim()) {
                desc = `${desc}\n\n![Image](${d.image.trim()})`;
            }

            // Ensure we don't output "Day 1: - " if title missing
            const safeTitle = title || `Day ${d.day}`;

            if (desc) {
                return `Day ${d.day}: ${safeTitle} - ${desc}`;
            }
            return `Day ${d.day}: ${safeTitle}`;
        })
        .join(' | ');
}
