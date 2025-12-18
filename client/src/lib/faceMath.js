/**
 * Face Geometry Math Utility
 * Calculates precise face ratios from MediaPipe landmarks to determine face shape.
 */

/**
 * Calculates the Euclidean distance between two points {x, y, z}
 */
const getDistance = (p1, p2, width, height) => {
    const x = (p1.x - p2.x) * width;
    const y = (p1.y - p2.y) * height;
    return Math.sqrt(x * x + y * y);
};

/**
 * Determines face shape based on geometric ratios
 * @param {Object} landmarks - The MediaPipe landmarks object
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Object} { shape, confidence, metrics }
 */
export const calculateFaceShape = (landmarks, width, height) => {
    if (!landmarks || landmarks.length === 0) return null;

    // Key Landmarks (MediaPipe Face Mesh)
    // 10: Top Forehead, 152: Chin
    // 234: Left Cheek, 454: Right Cheek
    // 58: Left Jaw, 288: Right Jaw
    // 103: Left Forehead Width, 332: Right Forehead Width

    const faceLength = getDistance(landmarks[10], landmarks[152], width, height);
    const cheekWidth = getDistance(landmarks[234], landmarks[454], width, height);
    const jawWidth = getDistance(landmarks[58], landmarks[288], width, height);
    const foreheadWidth = getDistance(landmarks[103], landmarks[332], width, height);

    // Ratios
    const lengthToWidthRatio = faceLength / cheekWidth;
    const jawToCheekRatio = jawWidth / cheekWidth;
    const foreheadToCheekRatio = foreheadWidth / cheekWidth;

    let shape = 'Oval';
    let confidence = 0.85; // Base confidence
    let reasoning = [];

    // Logic Tree for Shape Determination
    // 1. Face Length vs Width
    if (lengthToWidthRatio > 1.45) {
        // High length/width -> Oblong or Rectangle
        if (jawToCheekRatio > 0.9) {
            shape = 'Square'; // Actually Rectangle/Long Square
            confidence = 0.90;
            reasoning.push('High face length with strong angular jawline.');
        } else {
            shape = 'Oblong';
            confidence = 0.88;
            reasoning.push('Face length is significantly greater than width.');
        }
    } else if (lengthToWidthRatio < 1.15) {
        // Short face
        if (jawToCheekRatio > 0.9) {
            shape = 'Square';
            confidence = 0.92;
            reasoning.push('Face width and length are similar with strong jaw.');
        } else {
            shape = 'Round';
            confidence = 0.91;
            reasoning.push('Face width and length are similar with soft jaw.');
        }
    } else {
        // Balanced Length (Oval, Diamond, Heart)
        if (jawWidth < foreheadWidth && jawToCheekRatio < 0.75) {
            shape = 'Heart';
            confidence = 0.89;
            reasoning.push('Forehead is wider than jawline, tapering down.');
        } else if (cheekWidth > foreheadWidth && cheekWidth > jawWidth) {
            if (jawToCheekRatio < 0.7) {
                shape = 'Diamond';
                confidence = 0.87;
                reasoning.push('Cheekbones are widest point, narrow forehead and jaw.');
            } else {
                shape = 'Oval';
                confidence = 0.95;
                reasoning.push('Balanced proportions with cheekbones slightly wider than jaw.');
            }
        }
    }

    return {
        shape,
        confidence: (confidence * 100).toFixed(1) + '%',
        metrics: {
            faceLength: Math.round(faceLength),
            cheekWidth: Math.round(cheekWidth),
            jawWidth: Math.round(jawWidth),
            ratio: lengthToWidthRatio.toFixed(2)
        },
        reasoning: reasoning[0] || 'Balanced features detected.'
    };
};

/**
 * Estimates gender based on facial feature ratios (Heuristic)
 * @param {Object} landmarks
 * @param {number} width
 * @param {number} height
 * @returns {Object} { gender, score, confidence }
 */
export const calculateGender = (landmarks, width, height) => {
    if (!landmarks || landmarks.length === 0) return { gender: 'Unknown', score: 0 };

    // 1. Jaw Width (58-288) vs Cheek Width (234-454)
    // Men have wider jaws relative to cheeks.
    const jawWidth = getDistance(landmarks[58], landmarks[288], width, height);
    const cheekWidth = getDistance(landmarks[234], landmarks[454], width, height);
    const jawCheekRatio = jawWidth / cheekWidth;

    // 2. Lip Fullness (Top 13 - Bottom 14) vs Mouth Width (61-291)
    // Women often have fuller lips relative to mouth width.
    const lipHeight = getDistance(landmarks[13], landmarks[14], width, height);
    const mouthWidth = getDistance(landmarks[61], landmarks[291], width, height);
    const lipRatio = lipHeight / mouthWidth;

    // Scoring
    let score = 0; // + = Male, - = Female

    // Jaw Logic
    if (jawCheekRatio > 0.92) score += 3;       // Strong male jaw
    else if (jawCheekRatio > 0.88) score += 1;  // Leaning male
    else if (jawCheekRatio < 0.82) score -= 1;  // Leaning female

    // Lip Logic
    if (lipRatio > 0.35) score -= 3;            // Very full lips (Female)
    else if (lipRatio > 0.25) score -= 1;       // Full lips
    else if (lipRatio < 0.15) score += 2;       // Thin lips (Male)

    const gender = score >= 0 ? 'Male' : 'Female';

    return {
        gender,
        score,
        metrics: { jawCheekRatio: jawCheekRatio.toFixed(2), lipRatio: lipRatio.toFixed(2) }
    };
};
