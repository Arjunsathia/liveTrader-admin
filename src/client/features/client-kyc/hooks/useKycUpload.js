import { useMemo, useState } from 'react';
import { kycApi } from '../services/kyc.api';
import { addressProofSchema, identityDocumentSchema, personalInfoSchema, validateSection } from '../schemas/kyc.schema';

const initialData = {
  personalInfo: {
    fullName: 'Aarav Mehta', dateOfBirth: '', email: 'aarav.mehta@example.com', phone: '',
    country: 'India', address: '', city: '', postalCode: '',
  },
  identityDocument: { type: 'passport', documentNumber: '', expiryDate: '', issuingCountry: 'India', front: null, back: null },
  selfie: null,
  addressProof: { type: 'utility-bill', issueDate: '', file: null },
  declaration: false,
};

export function useKycUpload() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateSection = (section, value) => setData((current) => ({
    ...current,
    [section]: typeof value === 'function' ? value(current[section]) : value,
  }));

  const completedSteps = useMemo(() => [
    Object.values(data.personalInfo).every(Boolean),
    Boolean(data.identityDocument.front && data.identityDocument.documentNumber && data.identityDocument.expiryDate),
    Boolean(data.selfie),
    Boolean(data.addressProof.file && data.addressProof.issueDate),
    false,
    submitted,
  ], [data, submitted]);

  const validateCurrent = () => {
    const validation = step === 1
      ? validateSection(personalInfoSchema, data.personalInfo)
      : step === 2
        ? validateSection(identityDocumentSchema, data.identityDocument)
        : step === 3 && !data.selfie
          ? { selfie: 'Complete a selfie or live capture to continue' }
          : step === 4
            ? validateSection(addressProofSchema, data.addressProof)
            : {};
    setErrors(validation);
    return Object.keys(validation).length === 0;
  };

  const next = async () => {
    if (!validateCurrent()) return false;
    setSaving(true);
    await kycApi.saveDraft(data);
    setSaving(false);
    setStep((value) => Math.min(value + 1, 6));
    return true;
  };

  const submit = async () => {
    if (!data.declaration) {
      setErrors({ declaration: 'Accept the declaration before submitting' });
      return false;
    }
    setSaving(true);
    await kycApi.submit(data);
    setSaving(false);
    setSubmitted(true);
    setStep(6);
    return true;
  };

  return { step, setStep, data, updateSection, errors, setErrors, saving, submitted, completedSteps, next, submit };
}
