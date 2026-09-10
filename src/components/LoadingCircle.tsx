import "../App.css";

type LoadingCircleProps = {
    /** Diameter of the spinner in pixels. Defaults to 48. */
    size?: number;
};

/**
 * A loading spinner that fills and dims ONLY its parent container
 * (not the whole screen). The parent must be positioned — give it
 * `position: relative` (Tailwind `relative`) so the overlay clips to it.
 *
 * Render it conditionally inside the container you want to cover:
 *   {loading && <LoadingCircle />}
 */
export function LoadingCircle({size = 48}: LoadingCircleProps): React.JSX.Element {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner" style={{width: size, height: size}}/>
        </div>
    );
}
