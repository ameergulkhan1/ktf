// src/components/user/HealthProfile.jsx
// The customer's saved health profile, which personalises the AI food advisor.
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { aiApi, aiErrorMessage } from '../../api/aiApi';

const PREFERENCES = ['Halal', 'Vegetarian', 'Vegan', 'High protein', 'Low carb', 'Low fat', 'Low sodium', 'Gluten-free', 'Diabetic-friendly'];
const COMMON_ALLERGIES = ['Peanuts', 'Tree nuts', 'Dairy', 'Eggs', 'Gluten', 'Shellfish', 'Fish', 'Soy', 'Sesame'];

const EMPTY = {
  age: '',
  gender: '',
  height_cm: '',
  weight_kg: '',
  exercise_level: '',
  water_intake_liters: '',
  weight_goal: '',
  food_preferences: [],
  allergies: [],
  stomach_issues: '',
  skin_conditions: '',
  diabetes_or_bp: '',
  heart_conditions: '',
  other_conditions: '',
};

const fromProfile = (p) =>
  p
    ? Object.fromEntries(
        Object.keys(EMPTY).map((k) => [k, Array.isArray(EMPTY[k]) ? p[k] || [] : p[k] ?? ''])
      )
    : EMPTY;

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300';

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-full border px-3 py-1 text-sm transition ${
      active
        ? 'border-emerald-600 bg-emerald-600 text-white'
        : 'border-gray-300 text-gray-700 hover:border-emerald-500 dark:border-gray-600 dark:text-gray-300'
    }`}
  >
    {children}
  </button>
);

const HealthProfile = ({ profile, onSaved, onDeleted }) => {
  const [form, setForm] = useState(() => fromProfile(profile));
  const [otherAllergy, setOtherAllergy] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(fromProfile(profile)), [profile]);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const onChange = (e) => set(e.target.name, e.target.value);
  const toggle = (name, value) =>
    setForm((f) => ({
      ...f,
      [name]: f[name].includes(value) ? f[name].filter((v) => v !== value) : [...f[name], value],
    }));

  const addOtherAllergy = () => {
    const value = otherAllergy.trim();
    if (value && !form.allergies.some((a) => a.toLowerCase() === value.toLowerCase())) {
      set('allergies', [...form.allergies, value]);
    }
    setOtherAllergy('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await aiApi.saveHealthProfile(form);
      if (res.success) {
        toast.success('Health profile saved');
        onSaved?.(res);
      }
    } catch (error) {
      toast.error(aiErrorMessage(error, 'Could not save your profile'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await aiApi.deleteHealthProfile();
      toast.success('Health profile deleted');
      onDeleted?.();
    } catch (error) {
      toast.error(aiErrorMessage(error, 'Could not delete your profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Everything here is optional and only used to personalise your food suggestions. You can delete it at any time.
      </p>

      <fieldset className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <legend className="sr-only">Body measurements</legend>
        <div>
          <label className={labelClass} htmlFor="hp-age">Age</label>
          <input id="hp-age" name="age" type="number" min="1" max="120" value={form.age} onChange={onChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="hp-gender">Gender</label>
          <select id="hp-gender" name="gender" value={form.gender} onChange={onChange} className={inputClass}>
            <option value="">Prefer not to say</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="hp-height">Height (cm)</label>
          <input id="hp-height" name="height_cm" type="number" min="50" max="300" step="0.1" value={form.height_cm} onChange={onChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="hp-weight">Weight (kg)</label>
          <input id="hp-weight" name="weight_kg" type="number" min="10" max="500" step="0.1" value={form.weight_kg} onChange={onChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="hp-exercise">Activity level</label>
          <select id="hp-exercise" name="exercise_level" value={form.exercise_level} onChange={onChange} className={inputClass}>
            <option value="">Select…</option>
            <option value="sedentary">Sedentary (little exercise)</option>
            <option value="light">Light (1–3 days/week)</option>
            <option value="moderate">Moderate (3–5 days/week)</option>
            <option value="active">Active (6–7 days/week)</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="hp-goal">Weight goal</label>
          <select id="hp-goal" name="weight_goal" value={form.weight_goal} onChange={onChange} className={inputClass}>
            <option value="">Select…</option>
            <option value="lose">Lose weight</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain weight</option>
          </select>
        </div>
        <div className="col-span-2 md:col-span-2">
          <label className={labelClass} htmlFor="hp-water">Water you drink now (litres/day)</label>
          <input id="hp-water" name="water_intake_liters" type="number" min="0" max="20" step="0.1" value={form.water_intake_liters} onChange={onChange} className={inputClass} />
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Food preferences</legend>
        <div className="flex flex-wrap gap-2">
          {PREFERENCES.map((p) => (
            <Chip key={p} active={form.food_preferences.includes(p)} onClick={() => toggle('food_preferences', p)}>
              {p}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Allergies</legend>
        <div className="flex flex-wrap gap-2">
          {[...COMMON_ALLERGIES, ...form.allergies.filter((a) => !COMMON_ALLERGIES.includes(a))].map((a) => (
            <Chip key={a} active={form.allergies.includes(a)} onClick={() => toggle('allergies', a)}>
              {a}
            </Chip>
          ))}
        </div>
        <div className="mt-2 flex max-w-sm gap-2">
          <input
            value={otherAllergy}
            onChange={(e) => setOtherAllergy(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addOtherAllergy();
              }
            }}
            placeholder="Other allergy, e.g. mushrooms"
            className={inputClass}
            aria-label="Other allergy"
          />
          <button type="button" onClick={addOtherAllergy} className="rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:text-gray-200">
            Add
          </button>
        </div>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <legend className={`${labelClass} md:col-span-2`}>Health conditions (optional)</legend>
        {[
          ['diabetes_or_bp', 'Diabetes or blood pressure', 'e.g. Type 2 diabetes, hypertension'],
          ['heart_conditions', 'Heart / cholesterol', 'e.g. high cholesterol'],
          ['stomach_issues', 'Stomach / digestion', 'e.g. acidity, IBS'],
          ['skin_conditions', 'Skin', 'e.g. acne, eczema'],
        ].map(([name, label, placeholder]) => (
          <div key={name}>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400" htmlFor={`hp-${name}`}>{label}</label>
            <input id={`hp-${name}`} name={name} value={form[name]} onChange={onChange} maxLength={300} placeholder={placeholder} className={inputClass} />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400" htmlFor="hp-other">Anything else</label>
          <input id="hp-other" name="other_conditions" value={form.other_conditions} onChange={onChange} maxLength={300} placeholder="e.g. pregnant, kidney stones, recovering from surgery" className={inputClass} />
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save profile'}
        </button>
        {profile && (
          <button type="button" onClick={remove} disabled={saving} className="rounded-lg border border-red-300 px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-900/20">
            Delete my health data
          </button>
        )}
      </div>
    </form>
  );
};

export default HealthProfile;
