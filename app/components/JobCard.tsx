import React, { memo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Job interface
export interface Job {
    _id: string;
    jobTitle: string;
    companyName?: string;
    companyLogo?: string | null;
    city?: string;
    state?: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryType?: 'monthly' | 'yearly' | 'hourly';
    employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
    workMode?: 'onsite' | 'remote' | 'hybrid';
    hiringInfo?: {
        phone?: string;
        whatsAppNumber?: string;
        email?: string;
    } | null;
}

interface JobCardProps {
    job: Job;
    onApply?: (job: Job) => void;
}

// Format salary with Indian number format
const formatSalary = (min?: number, max?: number, type?: string): string => {
    if (!min && !max) return 'Not disclosed';

    const formatNum = (n: number) => {
        if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
        if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
        return n.toString();
    };

    const suffix = type === 'yearly' ? '/yr' : type === 'hourly' ? '/hr' : '/mo';

    if (min && max) {
        return `₹${formatNum(min)} - ₹${formatNum(max)}${suffix}`;
    }
    return min ? `₹${formatNum(min)}+${suffix}` : `Up to ₹${formatNum(max!)}${suffix}`;
};

// Get badge color based on type
const getBadgeStyle = (type: string) => {
    switch (type) {
        case 'full-time':
            return { bg: '#E8F5E9', text: '#2E7D32' };
        case 'part-time':
            return { bg: '#FFF3E0', text: '#E65100' };
        case 'contract':
            return { bg: '#E3F2FD', text: '#1565C0' };
        case 'internship':
            return { bg: '#F3E5F5', text: '#7B1FA2' };
        case 'freelance':
            return { bg: '#FBE9E7', text: '#BF360C' };
        case 'remote':
            return { bg: '#E0F7FA', text: '#00838F' };
        case 'hybrid':
            return { bg: '#FFF8E1', text: '#FF8F00' };
        case 'onsite':
            return { bg: '#ECEFF1', text: '#546E7A' };
        default:
            return { bg: '#F5F5F5', text: '#616161' };
    }
};

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
    const navigation = useNavigation<any>();

    const handleApply = () => {
        // Always open the jobs website
        Linking.openURL('https://prithu.app/jobs');
    };

    const employmentBadge = job.employmentType ? getBadgeStyle(job.employmentType) : null;
    const workModeBadge = job.workMode ? getBadgeStyle(job.workMode) : null;

    return (
        <View style={styles.container}>
            {/* Card with subtle gradient border */}
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
            >
                <View style={styles.card}>
                    {/* Job Label */}
                    <View style={styles.jobLabel}>
                        <Text style={styles.jobLabelText}>💼 JOB</Text>
                    </View>

                    {/* Header: Logo + Company Info */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            {job.companyLogo ? (
                                <Image source={{ uri: job.companyLogo }} style={styles.logo} />
                            ) : (
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    style={styles.logoPlaceholder}
                                >
                                    <Text style={styles.logoText}>
                                        {(job.companyName || 'C').charAt(0).toUpperCase()}
                                    </Text>
                                </LinearGradient>
                            )}
                        </View>
                        <View style={styles.companyInfo}>
                            <Text style={styles.jobTitle} numberOfLines={2}>
                                {job.jobTitle}
                            </Text>
                            <Text style={styles.companyName} numberOfLines={1}>
                                {job.companyName || 'Company'}
                            </Text>
                        </View>
                    </View>

                    {/* Details Row */}
                    <View style={styles.detailsRow}>
                        {/* Location */}
                        {(job.city || job.state) && (
                            <View style={styles.detailItem}>
                                <Text style={styles.detailIcon}>📍</Text>
                                <Text style={styles.detailText} numberOfLines={1}>
                                    {job.city}{job.city && job.state ? ', ' : ''}{job.state}
                                </Text>
                            </View>
                        )}

                        {/* Salary */}
                        <View style={styles.detailItem}>
                            <Text style={styles.detailIcon}>💰</Text>
                            <Text style={styles.salaryText}>
                                {formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}
                            </Text>
                        </View>
                    </View>

                    {/* Badges */}
                    <View style={styles.badgesRow}>
                        {employmentBadge && (
                            <View style={[styles.badge, { backgroundColor: employmentBadge.bg }]}>
                                <Text style={[styles.badgeText, { color: employmentBadge.text }]}>
                                    {job.employmentType?.replace('-', ' ').toUpperCase()}
                                </Text>
                            </View>
                        )}
                        {workModeBadge && (
                            <View style={[styles.badge, { backgroundColor: workModeBadge.bg }]}>
                                <Text style={[styles.badgeText, { color: workModeBadge.text }]}>
                                    {job.workMode?.toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Apply Button */}
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApply}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#00c853', '#00e676']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.applyGradient}
                        >
                            <Text style={styles.applyText}>Apply Now</Text>
                            <Text style={styles.applyIcon}>→</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    gradientBorder: {
        borderRadius: 20,
        padding: 2,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
    },
    jobLabel: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    jobLabelText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#667eea',
        letterSpacing: 0.5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    logoContainer: {
        marginRight: 12,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    logoPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    companyInfo: {
        flex: 1,
        paddingRight: 50,
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 4,
        lineHeight: 22,
    },
    companyName: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    detailText: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },
    salaryText: {
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: '600',
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 14,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    applyButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    applyGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    applyText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginRight: 6,
    },
    applyIcon: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});

export default memo(JobCard);
