import { useMemo } from 'react';

function StarBackground() {
    // Generate 80 random falling stars
    const stars = useMemo(() => {
        const starArray = [];
        for (let i = 0; i < 400; i++) {
            starArray.push({
                left: Math.random() * 100,
                size: Math.random() * 2 + 1,
                delay: Math.random() * 15,
                duration: Math.random() * 10 + 10,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
        return starArray;
    }, []);

    return (
        <div className="star-field">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="falling-star"
                    style={{
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                        opacity: star.opacity
                    }}
                />
            ))}
        </div>
    );
}

export default StarBackground;
