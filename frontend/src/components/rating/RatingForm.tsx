import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';

interface RatingInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    maxStars?: number;
}

export const RatingInput: React.FC<RatingInputProps> = ({
    label,
    value,
    onChange,
    maxStars = 5,
}) => {
    return (
        <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{label}</Text>
            <View style={styles.starsContainer}>
                {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
                    <TouchableOpacity key={star} onPress={() => onChange(star)} style={styles.starButton}>
                        <Text style={[styles.star, star <= value ? styles.starFilled : styles.starEmpty]}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

interface ReviewRatingFormProps {
    onSubmit: (ratings: ReviewRatings, comment: string) => void;
    isLoading?: boolean;
    type: 'client' | 'manager';
}

export interface ReviewRatings {
    overall: number;
    cleanliness?: number;
    condition?: number;
    staff?: number;
    value?: number;
    vehicleCare?: number;
    punctuality?: number;
    communication?: number;
}

export const ReviewRatingForm: React.FC<ReviewRatingFormProps> = ({
    onSubmit,
    isLoading,
    type,
}) => {
    const [ratings, setRatings] = useState<ReviewRatings>({
        overall: 0,
        cleanliness: 0,
        condition: 0,
        staff: 0,
        value: 0,
        vehicleCare: 0,
        punctuality: 0,
        communication: 0,
    });
    const [comment, setComment] = useState('');
    const [wouldRentAgain, setWouldRentAgain] = useState<boolean | null>(null);

    const updateRating = (key: keyof ReviewRatings, value: number) => {
        setRatings((prev) => ({ ...prev, [key]: value }));
    };

    const isValid = () => {
        if (type === 'client') {
            return (
                ratings.overall > 0 &&
                ratings.cleanliness! > 0 &&
                ratings.condition! > 0 &&
                ratings.staff! > 0 &&
                ratings.value! > 0
            );
        } else {
            return (
                ratings.overall > 0 &&
                ratings.vehicleCare! > 0 &&
                ratings.punctuality! > 0 &&
                ratings.communication! > 0
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {type === 'client' ? 'Rate Your Experience' : 'Rate the Customer'}
            </Text>
            <Text style={styles.subtitle}>
                {type === 'client'
                    ? 'Help others by sharing your rental experience'
                    : "Provide feedback on the customer's rental behavior"}
            </Text>

            <View style={styles.ratingsSection}>
                <RatingInput
                    label="Overall Experience"
                    value={ratings.overall}
                    onChange={(v) => updateRating('overall', v)}
                />

                {type === 'client' ? (
                    <>
                        <RatingInput
                            label="Vehicle Cleanliness"
                            value={ratings.cleanliness || 0}
                            onChange={(v) => updateRating('cleanliness', v)}
                        />
                        <RatingInput
                            label="Vehicle Condition"
                            value={ratings.condition || 0}
                            onChange={(v) => updateRating('condition', v)}
                        />
                        <RatingInput
                            label="Staff Friendliness"
                            value={ratings.staff || 0}
                            onChange={(v) => updateRating('staff', v)}
                        />
                        <RatingInput
                            label="Value for Money"
                            value={ratings.value || 0}
                            onChange={(v) => updateRating('value', v)}
                        />
                    </>
                ) : (
                    <>
                        <RatingInput
                            label="Vehicle Care"
                            value={ratings.vehicleCare || 0}
                            onChange={(v) => updateRating('vehicleCare', v)}
                        />
                        <RatingInput
                            label="Punctuality"
                            value={ratings.punctuality || 0}
                            onChange={(v) => updateRating('punctuality', v)}
                        />
                        <RatingInput
                            label="Communication"
                            value={ratings.communication || 0}
                            onChange={(v) => updateRating('communication', v)}
                        />

                        <View style={styles.wouldRentRow}>
                            <Text style={styles.wouldRentLabel}>Would you rent to them again?</Text>
                            <View style={styles.wouldRentButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.wouldRentButton,
                                        wouldRentAgain === true && styles.wouldRentButtonActive,
                                    ]}
                                    onPress={() => setWouldRentAgain(true)}
                                >
                                    <Text
                                        style={[
                                            styles.wouldRentButtonText,
                                            wouldRentAgain === true && styles.wouldRentButtonTextActive,
                                        ]}
                                    >
                                        Yes
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.wouldRentButton,
                                        wouldRentAgain === false && styles.wouldRentButtonNo,
                                    ]}
                                    onPress={() => setWouldRentAgain(false)}
                                >
                                    <Text
                                        style={[
                                            styles.wouldRentButtonText,
                                            wouldRentAgain === false && styles.wouldRentButtonTextActive,
                                        ]}
                                    >
                                        No
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.commentSection}>
                <Text style={styles.commentLabel}>
                    {type === 'client' ? 'Write a review (optional)' : 'Internal notes (optional)'}
                </Text>
                <TextInput
                    style={styles.commentInput}
                    placeholder={
                        type === 'client'
                            ? 'Share your experience with other renters...'
                            : 'Add notes about this customer...'
                    }
                    placeholderTextColor={colors.neutral[400]}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={comment}
                    onChangeText={setComment}
                    maxLength={500}
                />
                <Text style={styles.charCount}>{comment.length}/500</Text>
            </View>

            <TouchableOpacity
                style={[styles.submitButton, !isValid() && styles.submitButtonDisabled]}
                disabled={!isValid() || isLoading}
                onPress={() => onSubmit(ratings, comment)}
            >
                <Text style={styles.submitButtonText}>
                    {isLoading ? 'Submitting...' : 'Submit Rating'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.base,
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '700',
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    ratingsSection: {
        marginBottom: spacing.xl,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    ratingLabel: {
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        flex: 1,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    starButton: {
        padding: spacing.xs,
    },
    star: {
        fontSize: 28,
    },
    starFilled: {
        color: colors.secondary[500],
    },
    starEmpty: {
        color: colors.neutral[300],
    },
    wouldRentRow: {
        paddingVertical: spacing.md,
    },
    wouldRentLabel: {
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    wouldRentButtons: {
        flexDirection: 'row',
    },
    wouldRentButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.neutral[200],
        marginRight: spacing.md,
        alignItems: 'center',
    },
    wouldRentButtonActive: {
        borderColor: colors.success.main,
        backgroundColor: colors.success.light,
    },
    wouldRentButtonNo: {
        borderColor: colors.error.main,
        backgroundColor: colors.error.light,
    },
    wouldRentButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    wouldRentButtonTextActive: {
        color: colors.text.primary,
    },
    commentSection: {
        marginBottom: spacing.xl,
    },
    commentLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    commentInput: {
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        padding: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        minHeight: 100,
    },
    charCount: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    submitButton: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.base,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: colors.neutral[300],
    },
    submitButtonText: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.inverse,
    },
});

export default ReviewRatingForm;
