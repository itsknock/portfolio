// VendorFormFields.tsx
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { DropdownCountries, DropdownHomologado } from './Dropdown';
import styles from '../app/Styles';

type Props = {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export default function VendorFormFields({ formData, setFormData }: Props) {
    return (
        <View>
            <Text style={styles.modalFieldText}>Company name</Text>
            <TextInput
                style={styles.input}
                value={formData.Name}
                onChangeText={(text) => setFormData({ ...formData, Name: text })}
            />


           

            <Text style={styles.modalFieldText}>Email</Text>
            <TextInput
                style={styles.input}
                value={formData.EMail}
                onChangeText={(text) => setFormData({ ...formData, EMail: text })}
            />

            <View >
                <View style={styles.dropdownWrapper}>
                    <Text style={styles.modalFieldText}>Country</Text>
                    <View style={styles.dropdownContainer}>
                        <DropdownCountries
                            value={formData.CountryRegionCode}
                            onChange={(val: string) => setFormData({ ...formData, CountryRegionCode: val })}
                        />
                    </View>
                </View>

                <View style={styles.dropdownWrapper}>
                    <Text style={styles.modalFieldText}>Validation state</Text>
                    <View style={styles.dropdownContainer}>
                        <DropdownHomologado
                            value={formData.EstadoHomologacion}
                            onChange={(val: string) => setFormData({ ...formData, EstadoHomologacion: val })}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
