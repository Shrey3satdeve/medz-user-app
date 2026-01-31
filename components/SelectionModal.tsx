import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../src/theme';
import { XCircle } from './Icons';

interface SelectionModalProps {
    visible: boolean;
    title: string;
    options: string[];
    onSelect: (option: string) => void;
    onClose: () => void;
    selectedValue?: string;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({
    visible,
    title,
    options,
    onSelect,
    onClose,
    selectedValue
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <XCircle size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionItem,
                                    selectedValue === option && styles.selectedOption
                                ]}
                                onPress={() => {
                                    onSelect(option);
                                    onClose();
                                }}
                            >
                                <Text style={[
                                    styles.optionText,
                                    selectedValue === option && styles.selectedOptionText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text,
    },
    list: {
        width: '100%',
    },
    optionItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    selectedOption: {
        backgroundColor: '#eff6ff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 0,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center'
    },
    selectedOptionText: {
        color: theme.colors.primary,
        fontWeight: '800',
    }
});
