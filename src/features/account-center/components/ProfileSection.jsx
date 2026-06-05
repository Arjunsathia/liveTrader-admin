import React, { useState } from 'react';
import { User, Mail, Globe, Save, Home, Landmark, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import {
  FieldLabel,
  FGroup,
  TInput,
  TSelect,
  ToggleRow,
  Btn,
} from '@/features/settings/components/SettingsForm';

export function ProfileSection({ user }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile Form States
  const [name, setName] = useState(user?.name ?? '');
  const [displayName, setDisplayName] = useState(user?.name?.split(' ')[0] ?? '');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [secondaryEmail, setSecondaryEmail] = useState('recovery.contact@email.com');
  
  // Address States
  const [street, setStreet] = useState('123 Financial District');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [country, setCountry] = useState('United States');
  const [zipCode, setZipCode] = useState('10005');

  // Preferences States
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [platformUpdates, setPlatformUpdates] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Regional States
  const [timezone, setTimezone] = useState('UTC+5:30');
  const [language, setLanguage] = useState('en');

  // Mock KYC details
  const kycStatus = user?.role === 'client' ? 'verified' : 'verified'; // All admin personnel are verified by default
  const kycLevel = 'Level 2 - Institutional Access';

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const getKycDetails = () => {
    switch (kycStatus) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'var(--positive)',
          title: 'Identity Fully Verified',
          desc: 'Your profile has completed Level 2 verification. Full trading and withdrawal facilities are unlocked.',
        };
      case 'pending':
        return {
          icon: AlertTriangle,
          color: 'var(--warning)',
          title: 'Verification Pending Review',
          desc: 'Compliance operators are auditing your uploaded document scans. Review takes up to 24 hours.',
        };
      default:
        return {
          icon: AlertOctagon,
          color: 'var(--negative)',
          title: 'KYC Verification Required',
          desc: 'Please submit your proof of address and identity scan to unlock all financial trading features.',
        };
    }
  };

  const kyc = getKycDetails();
  const KycIcon = kyc.icon;

  const timezoneOptions = [
    { value: 'UTC+5:30', label: 'UTC +5:30 (Mumbai, IST)' },
    { value: 'UTC+0', label: 'UTC +0:00 (London, GMT)' },
    { value: 'UTC-5', label: 'UTC -5:00 (New York, EST)' },
    { value: 'UTC+1', label: 'UTC +1:00 (Berlin, CET)' },
    { value: 'UTC+8', label: 'UTC +8:00 (Singapore, SGT)' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English (US)' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
  ];

  const countryOptions = [
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'India', label: 'India' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Canada', label: 'Canada' },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
      
      {/* 1. KYC Onboarding Status Card */}
      <SettingsCard
        title="Compliance & KYC Verification"
        desc="Check your current personnel account onboarding verification clearance level."
        Icon={Landmark}
      >
        <div
          className="flex items-start gap-4 rounded-[10px] border px-4 py-3.5 transition-all duration-300"
          style={{
            borderColor: `color-mix(in srgb, ${kyc.color} 22%, transparent)`,
            background: `color-mix(in srgb, ${kyc.color} 5%, transparent)`,
          }}
        >
          <KycIcon size={18} style={{ color: kyc.color }} className="flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold" style={{ color: kyc.color }}>
                {kyc.title}
              </span>
              <span
                className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-[4px] border"
                style={{
                  color: kyc.color,
                  background: `color-mix(in srgb, ${kyc.color} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${kyc.color} 20%, transparent)`,
                }}
              >
                {kycLevel}
              </span>
            </div>
            <p className="text-[11.5px] text-text-muted/65 leading-relaxed">
              {kyc.desc}
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* 2. Personal Information */}
      <SettingsCard
        title="Personal Information"
        desc="Configure your identity labels, contact coordinate points, and recovery emails."
        Icon={User}
      >
        <FGroup cols={2}>
          <div>
            <FieldLabel required hint="Your official registration full name">Full Name</FieldLabel>
            <TInput
              value={name}
              onChange={setName}
              placeholder="e.g. Arjun Sathia"
            />
          </div>

          <div>
            <FieldLabel required hint="Friendly username for UI navigation greetings">Display Name</FieldLabel>
            <TInput
              value={displayName}
              onChange={setDisplayName}
              placeholder="e.g. Arjun"
            />
          </div>

          <div>
            <FieldLabel hint="Primary credential log in address (Immutable)">Email Address (Read-only)</FieldLabel>
            <TInput
              value={user?.email}
              readOnly
              disabled
              mono
            />
          </div>

          <div>
            <FieldLabel hint="Secondary contact for security alerts & recoveries">Backup Recovery Email</FieldLabel>
            <TInput
              value={secondaryEmail}
              onChange={setSecondaryEmail}
              placeholder="e.g. backup@email.com"
              mono
            />
          </div>

          <div>
            <FieldLabel required hint="Phone coordinate with country prefix code">Phone Number</FieldLabel>
            <TInput
              value={phone}
              onChange={setPhone}
              placeholder="e.g. +1 (555) 019-2834"
              mono
            />
          </div>
        </FGroup>
      </SettingsCard>

      {/* 3. Residential Address */}
      <SettingsCard
        title="Residential Address"
        desc="Your billing and geographical physical location details matching your KYC documentations."
        Icon={Home}
      >
        <div className="space-y-4">
          <div>
            <FieldLabel required hint="Street location details (Apartment, Suite, Unit)">Street Address</FieldLabel>
            <TInput
              value={street}
              onChange={setStreet}
              placeholder="e.g. 123 Financial District Rd"
            />
          </div>

          <FGroup cols={4}>
            <div className="col-span-2">
              <FieldLabel required>City</FieldLabel>
              <TInput
                value={city}
                onChange={setCity}
                placeholder="e.g. New York"
              />
            </div>
            <div>
              <FieldLabel required>State / Province</FieldLabel>
              <TInput
                value={state}
                onChange={setState}
                placeholder="e.g. NY"
              />
            </div>
            <div>
              <FieldLabel required>Postal / ZIP Code</FieldLabel>
              <TInput
                value={zipCode}
                onChange={setZipCode}
                placeholder="e.g. 10001"
                mono
              />
            </div>
          </FGroup>

          <div className="w-full md:w-1/2">
            <FieldLabel required hint="Your primary state jurisdiction">Country / Region</FieldLabel>
            <TSelect
              value={country}
              onChange={setCountry}
              options={countryOptions}
            />
          </div>
        </div>
      </SettingsCard>

      {/* 4. Regional Coordinate Preferences */}
      <SettingsCard
        title="Regional Locale Settings"
        desc="Select timezone coordinates and interface languages used across transaction panels."
        Icon={Globe}
      >
        <FGroup cols={2}>
          <div>
            <FieldLabel hint="Primary timezone coordinates governing chronological indexes">Preferred Timezone</FieldLabel>
            <TSelect
              value={timezone}
              onChange={setTimezone}
              options={timezoneOptions}
            />
          </div>
          <div>
            <FieldLabel hint="Language used in headers and tooltips">Preferred Language</FieldLabel>
            <TSelect
              value={language}
              onChange={setLanguage}
              options={languageOptions}
            />
          </div>
        </FGroup>
      </SettingsCard>

      {/* 5. Communication Preferences */}
      <SettingsCard
        title="Communication Preferences"
        desc="Control the distribution parameters of platform news and newsletters."
        Icon={Mail}
      >
        <div className="space-y-1">
          <ToggleRow
            label="Marketing Newsletters"
            desc="Receive weekly digests, platform summaries, promotional opportunities, and custom loyalty programs."
            val={marketingEmails}
            onChange={setMarketingEmails}
          />
          <ToggleRow
            label="Platform Infrastructure Updates"
            desc="Receive updates on critical system enhancements and scheduled downtime alerts."
            val={platformUpdates}
            onChange={setPlatformUpdates}
          />
          <ToggleRow
            label="Daily Activity Summaries"
            desc="Commit summaries of your recent personal transactions and logins to daily recap emails."
            val={dailyDigest}
            onChange={setDailyDigest}
          />
        </div>
      </SettingsCard>

      {/* Save Action Bar */}
      <div className="flex items-center gap-4 pt-2">
        <Btn
          type="submit"
          Icon={Save}
          label={loading ? 'Saving Changes...' : 'Save Profile Details'}
          variant="brand"
          loading={loading}
        />
        {saved && (
          <span className="text-[12.5px] font-semibold text-positive animate-fade-in">
            ✓ Personal profile preferences updated successfully
          </span>
        )}
      </div>

    </form>
  );
}
