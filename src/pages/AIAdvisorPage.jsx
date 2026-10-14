// src/pages/AIAdvisorPage.jsx
// AI food advisor: ask a health question and get dishes you can order on KFT, or get a
// day's meal plan from your saved health profile.
import React, { useEffect, useState } from 'react';
import { FiSend, FiMapPin, FiCalendar, FiUser, FiMessageCircle } from 'react-icons/fi';
import { aiApi, aiErrorMessage } from '../api/aiApi';
import HealthProfile from '../components/user/HealthProfile';
import {
  RecommendationResult,
  MealPlanResult,
  MetricsStrip,
  MedicalDisclaimer,
} from '../components/user/AIRecommendations';

const QUICK_QUESTIONS = [
  'I have type 2 diabetes. What can I order for dinner?',
  'Something light for acidity and a sensitive stomach',
  'High-protein lunch after the gym',
  'Low-calorie meals to lose weight',
  'Heart-healthy food for high blood pressure',
  'What should I eat when I have a fever or flu?',
];

const TABS = [
  { id: 'ask', label: 'Ask the AI', icon: FiMessageCircle },
  { id: 'plan', label: 'Daily meal plan', icon: FiCalendar },
  { id: 'profile', label: 'Health profile', icon: FiUser },
];

const Thinking = ({ text }) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" role="status">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
    {text}
  </div>
);

const AIAdvisorPage = () => {
  const [tab, setTab] = useState('ask');
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [query, setQuery] = useState('');
  const [useProfile, setUseProfile] = useState(true);
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [askError, setAskError] = useState('');

  const [planNotes, setPlanNotes] = useState('');
  const [planning, setPlanning] = useState(false);
  const [plan, setPlan] = useState(null);
  const [planError, setPlanError] = useState('');

  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    let alive = true;
    aiApi
      .getHealthProfile()
      .then((res) => {
        if (!alive) return;
        setProfile(res.profile);
        setMetrics(res.metrics);
      })
      .catch(() => {})
      .finally(() => alive && setProfileLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const toggleLocation = () => {
    if (coords) {
      setCoords(null);
      return;
    }
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  };

  const ask = async (text = query) => {
    const q = text.trim();
    if (q.length < 3 || asking) return;
    setQuery(q);
    setAsking(true);
    setAskError('');
    setAnswer(null);
    try {
      const res = await aiApi.recommend({ query: q, use_profile: useProfile, ...(coords || {}) });
      setAnswer(res);
    } catch (error) {
      setAskError(aiErrorMessage(error, 'Could not get suggestions right now.'));
    } finally {
      setAsking(false);
    }
  };

  const makePlan = async () => {
    if (planning) return;
    setPlanning(true);
    setPlanError('');
    setPlan(null);
    try {
      const res = await aiApi.mealPlan({ notes: planNotes, ...(coords || {}) });
      setPlan(res);
    } catch (error) {
      setPlanError(aiErrorMessage(error, 'Could not create a meal plan right now.'));
    } finally {
      setPlanning(false);
    }
  };

  const locationToggle = (
    <button
      type="button"
      onClick={toggleLocation}
      disabled={locating}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
        coords
          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
          : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'
      }`}
    >
      <FiMapPin className="h-4 w-4" />
      {locating ? 'Locating…' : coords ? 'Nearby restaurants only' : 'Prefer restaurants near me'}
    </button>
  );

  return (
    <div className="container-custom py-6 sm:py-10">
      <header className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-100">KFT AI Food Advisor</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Eat right for your health</h1>
        <p className="mt-2 max-w-2xl text-emerald-50">
          Tell us about a health goal or condition and get dishes from KFT restaurants that suit it, or a full day's meal
          plan built from your health profile.
        </p>
      </header>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`inline-flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              tab === id
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'ask' && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <label htmlFor="ai-query" className="mb-2 block font-medium text-gray-900 dark:text-white">
              What would you like to eat for your health?
            </label>
            <textarea
              id="ai-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  ask();
                }
              }}
              rows={3}
              maxLength={1000}
              placeholder="e.g. I have high cholesterol and want a filling lunch under Rs. 1000"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  disabled={asking}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {locationToggle}
                <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <input type="checkbox" checked={useProfile} onChange={(e) => setUseProfile(e.target.checked)} className="rounded" />
                  Use my health profile
                  {profileLoaded && !profile && (
                    <button type="button" onClick={() => setTab('profile')} className="text-emerald-600 underline">
                      (add one)
                    </button>
                  )}
                </label>
              </div>
              <button
                type="submit"
                disabled={asking || query.trim().length < 3}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <FiSend className="h-4 w-4" /> {asking ? 'Thinking…' : 'Get suggestions'}
              </button>
            </div>
          </form>

          {asking && <Thinking text="Finding the right dishes for you…" />}
          {askError && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{askError}</p>}
          {answer && <RecommendationResult result={answer} />}
          <MedicalDisclaimer />
        </div>
      )}

      {tab === 'plan' && (
        <div className="space-y-6">
          {profileLoaded && !profile ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
              <p className="text-gray-700 dark:text-gray-300">A meal plan is built from your health profile.</p>
              <button type="button" onClick={() => setTab('profile')} className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                Set up my health profile
              </button>
            </div>
          ) : (
            <>
              <MetricsStrip metrics={metrics} />
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <label htmlFor="plan-notes" className="mb-2 block font-medium text-gray-900 dark:text-white">
                  Anything special about today? (optional)
                </label>
                <input
                  id="plan-notes"
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  maxLength={300}
                  placeholder="e.g. I'm fasting until iftar, or I have a long gym session"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  {locationToggle}
                  <button
                    type="button"
                    onClick={makePlan}
                    disabled={planning}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <FiCalendar className="h-4 w-4" /> {planning ? 'Planning…' : plan ? 'Make a new plan' : 'Create my meal plan'}
                  </button>
                </div>
              </div>
              {planning && <Thinking text="Building your meal plan…" />}
              {planError && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{planError}</p>}
              {plan && <MealPlanResult result={plan} />}
            </>
          )}
          <MedicalDisclaimer />
        </div>
      )}

      {tab === 'profile' && (
        <div className="space-y-6">
          <MetricsStrip metrics={metrics} />
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            {profileLoaded ? (
              <HealthProfile
                profile={profile}
                onSaved={(res) => {
                  setProfile(res.profile);
                  setMetrics(res.metrics);
                }}
                onDeleted={() => {
                  setProfile(null);
                  setMetrics(null);
                }}
              />
            ) : (
              <Thinking text="Loading your profile…" />
            )}
          </div>
          <MedicalDisclaimer />
        </div>
      )}
    </div>
  );
};

export default AIAdvisorPage;
