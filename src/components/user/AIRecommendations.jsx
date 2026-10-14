// src/components/user/AIRecommendations.jsx
// Result views for the AI food advisor: suggested dishes (orderable), guidance lists and
// the daily meal plan.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiMapPin, FiAlertTriangle, FiCheck, FiX, FiDroplet, FiZap } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';

export const FoodItemCard = ({ item, compact = false }) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const add = async () => {
    setAdding(true);
    try {
      await addItem(null, 1, item.price, item.item_name, item.menu_item_id);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-3">
        {item.image_url ? (
          <img src={item.image_url} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" loading="lazy" />
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-2xl dark:bg-emerald-900/30">🍽️</div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 dark:text-white">{item.item_name}</p>
          <Link to={`/restaurants/${item.restaurant_id}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            {item.restaurant_name}
          </Link>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-800 dark:text-gray-200">{formatPrice(item.price)}</span>
            {item.calories ? <span>{item.calories} kcal</span> : null}
            {item.distance_km !== null && item.distance_km !== undefined && (
              <span className="inline-flex items-center gap-1">
                <FiMapPin className="h-3 w-3" /> {item.distance_km} km
              </span>
            )}
          </div>
        </div>
      </div>
      {item.reason && !compact && <p className="mt-3 flex-1 text-sm text-gray-600 dark:text-gray-300">{item.reason}</p>}
      <button
        type="button"
        onClick={add}
        disabled={adding}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        <FiShoppingCart className="h-4 w-4" /> {adding ? 'Adding…' : 'Add to cart'}
      </button>
    </div>
  );
};

export const UrgentNotice = ({ message }) => (
  <div className="flex gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200" role="alert">
    <FiAlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
    <div>
      <p className="font-semibold">Please seek medical help</p>
      <p className="text-sm">{message || 'What you describe may need urgent care. Contact a doctor or call 1122 now.'}</p>
    </div>
  </div>
);

const ListCard = ({ title, items, tone = 'neutral', icon: Icon }) => {
  if (!items?.length) return null;
  const tones = {
    good: 'text-emerald-600 dark:text-emerald-400',
    bad: 'text-red-600 dark:text-red-400',
    neutral: 'text-blue-600 dark:text-blue-400',
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((text, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
            {Icon && <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tones[tone]}`} />}
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const MetricsStrip = ({ metrics }) => {
  if (!metrics) return null;
  const tiles = [
    metrics.bmi && { label: 'BMI', value: metrics.bmi, hint: metrics.bmi_category },
    metrics.target_calories && { label: 'Daily target', value: `${metrics.target_calories} kcal`, hint: 'from your profile' },
    metrics.suggested_water_liters && { label: 'Water', value: `${metrics.suggested_water_liters} L`, hint: 'per day, approx.' },
  ].filter(Boolean);
  if (!tiles.length) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{t.label}</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{t.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.hint}</p>
        </div>
      ))}
    </div>
  );
};

export const RecommendationResult = ({ result }) => {
  const r = result.recommendation;
  return (
    <div className="space-y-5">
      {r.urgent && <UrgentNotice message={r.urgent_message} />}

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-900/20">
        <p className="text-gray-800 dark:text-gray-100">{r.summary}</p>
        {r.key_guidelines.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
            {r.key_guidelines.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        )}
      </div>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Suggested dishes on KFT</h3>
        {r.recommended_items.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {r.recommended_items.map((item) => (
              <FoodItemCard key={item.menu_item_id} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            No dish on the current menus is a good match for this yet. The guidance below still applies, and more
            restaurants are joining KFT.
          </p>
        )}
        {result.excluded_for_allergies > 0 && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {result.excluded_for_allergies} dish{result.excluded_for_allergies === 1 ? ' was' : 'es were'} left out because
            they may contain something you are allergic to.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListCard title="Good choices" items={r.foods_to_choose} tone="good" icon={FiCheck} />
        <ListCard title="Limit or avoid" items={r.foods_to_avoid} tone="bad" icon={FiX} />
      </div>
      <ListCard title="Ordering tips" items={r.ordering_tips} icon={FiZap} />
    </div>
  );
};

export const MealPlanResult = ({ result }) => {
  const plan = result.plan;
  return (
    <div className="space-y-5">
      {plan.urgent && <UrgentNotice message={plan.urgent_message} />}

      <div className="flex flex-wrap gap-3">
        {plan.calories_per_day && (
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            <FiZap className="h-4 w-4" /> ~{plan.calories_per_day} kcal / day
          </span>
        )}
        {plan.water_liters && (
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
            <FiDroplet className="h-4 w-4" /> {plan.water_liters} L water
          </span>
        )}
      </div>

      <div className="space-y-4">
        {plan.meals.map((meal) => (
          <section key={meal.meal} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{meal.meal}</h3>
              {meal.approx_calories && <span className="text-sm text-gray-500 dark:text-gray-400">~{meal.approx_calories} kcal</span>}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">{meal.plan}</p>
            {meal.items.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {meal.items.map((item) => (
                  <FoodItemCard key={item.menu_item_id} item={item} compact />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListCard title="Healthy swaps" items={plan.healthy_alternatives} tone="good" icon={FiCheck} />
        <ListCard title="Limit or avoid" items={plan.foods_to_avoid} tone="bad" icon={FiX} />
      </div>
      {plan.nutrition_notes && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Why this plan</h3>
          {plan.nutrition_notes}
        </div>
      )}
    </div>
  );
};

export const MedicalDisclaimer = () => (
  <p className="text-xs text-gray-500 dark:text-gray-400">
    KFT's AI advisor gives general food guidance, not medical advice. It can make mistakes. If you have a medical
    condition, are pregnant, or take medication, check changes to your diet with your doctor. In an emergency call 1122.
  </p>
);

export default RecommendationResult;
