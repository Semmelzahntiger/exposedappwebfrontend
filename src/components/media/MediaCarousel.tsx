import {type ReactNode, useState} from "react";

const iconStyle = {fontFamily: "'Material Symbols Rounded Variable', sans-serif", fontVariantLigatures: "normal"} as const;

type MediaCarouselProps = {
    count: number;
    /** Renders one page. `active` is true for the visible page (only it is mounted here). */
    renderPage: (index: number, active: boolean) => ReactNode;
};

/**
 * Paged media container with explicit left/right buttons + a dot indicator.
 * Only the active page is rendered, which guarantees a single playing <video>
 * (navigating away unmounts it, so it stops).
 */
export function MediaCarousel({count, renderPage}: MediaCarouselProps): React.JSX.Element {
    const [index, setIndex] = useState<number>(0);

    if (count === 0) {
        return <div className="media-stage-empty"/>;
    }

    const active = Math.min(index, count - 1);

    return (
        <div className="media-carousel">
            <div className="media-carousel-page">
                {renderPage(active, true)}
            </div>

            {count > 1 && (
                <>
                    <button
                        className="carousel-arrow carousel-arrow--left"
                        style={iconStyle}
                        disabled={active === 0}
                        onClick={() => setIndex(Math.max(0, active - 1))}
                        aria-label="Previous"
                    >
                        chevron_left
                    </button>
                    <button
                        className="carousel-arrow carousel-arrow--right"
                        style={iconStyle}
                        disabled={active === count - 1}
                        onClick={() => setIndex(Math.min(count - 1, active + 1))}
                        aria-label="Next"
                    >
                        chevron_right
                    </button>
                    <div className="carousel-dots">
                        {Array.from({length: count}).map((_, i) => (
                            <span key={i} className={`carousel-dot ${i === active ? "carousel-dot--active" : ""}`}/>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
