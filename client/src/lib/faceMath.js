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
