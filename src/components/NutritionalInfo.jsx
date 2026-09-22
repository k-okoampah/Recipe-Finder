import React, { useState } from 'react';
import { Activity, Plus, Minus, RotateCcw } from 'lucide-react';
import { calculateRecipeNutrition } from '../utils/nutrition.js';

/**
 * NutritionalInfo Component
 * 
 * Displays per-serving calorie and macronutrient counts in a clean,
 * accessible, text-based grid format with Daily Value (% DV) references.
 * 
 * @param {Object} props
 * @param {Object} props.recipe - The meal / recipe object
 */
export default function NutritionalInfo({ recipe }) {
  const [servings, setServings] = useState(1);

  if (!recipe) {
    return null;
  }

  const nutrition = calculateRecipeNutrition(recipe, servings);
  if (!nutrition) {
    return null;
  }

  const handleDecrease = () => {
    setServings((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setServings((prev) => Math.min(8, prev + 1));
  };

  const handleReset = () => {
    setServings(1);
  };

  return (
    <div
      id="recipe-nutritional-info-section"
      className="border-t border-[#E2E8F0] pt-5 print:pt-3 print:border-t-2 print:border-gray-800 print-avoid-break"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 print:mb-2">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-[#0056B3] print:hidden" aria-hidden="true" />
            <h2 className="font-serif font-bold text-lg text-[#003B73] print:text-black">
              Nutritional Information
            </h2>
          </div>
          <p className="text-xs text-[#64748B] print:text-gray-600 mt-0.5">
            Estimated per-serving values based on a standard 2,000 calorie daily diet
          </p>
        </div>

        {/* Servings Adjuster (Screen Only) */}
        <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
          <span className="text-xs font-medium text-[#64748B]">Portion:</span>
          <div className="inline-flex items-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-0.5">
            <button
              type="button"
              id="nutrition-decrease-serving-btn"
              onClick={handleDecrease}
              disabled={servings <= 1}
              aria-label="Decrease serving count"
              className="w-7 h-7 flex items-center justify-center text-[#334155] hover:text-[#0056B3] hover:bg-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Minus size={13} />
            </button>
            <span className="px-2.5 text-xs font-bold text-[#0F172A] min-w-[70px] text-center">
              {servings} {servings === 1 ? 'serving' : 'servings'}
            </span>
            <button
              type="button"
              id="nutrition-increase-serving-btn"
              onClick={handleIncrease}
              disabled={servings >= 8}
              aria-label="Increase serving count"
              className="w-7 h-7 flex items-center justify-center text-[#334155] hover:text-[#0056B3] hover:bg-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>
          {servings !== 1 && (
            <button
              type="button"
              id="nutrition-reset-serving-btn"
              onClick={handleReset}
              title="Reset to 1 serving"
              aria-label="Reset to 1 serving"
              className="p-1.5 text-xs text-[#64748B] hover:text-[#0056B3] hover:bg-[#EAF4FF] rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Primary Calorie & Macro Counts Bar (Clean Text Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <div className="bg-[#F8FAFC] print:bg-transparent border border-[#E2E8F0] print:border-gray-300 p-2.5 rounded-lg text-left">
          <div className="text-[11px] font-semibold text-[#64748B] print:text-gray-700 uppercase tracking-wider">
            Calories
          </div>
          <div className="text-xl font-bold text-[#003B73] print:text-black mt-0.5">
            {nutrition.calories} <span className="text-xs font-normal text-[#64748B]">kcal</span>
          </div>
          <div className="text-[11px] text-[#0056B3] font-medium print:text-gray-600 mt-0.5">
            {nutrition.dailyValues.calories}% DV
          </div>
        </div>

        <div className="bg-[#F8FAFC] print:bg-transparent border border-[#E2E8F0] print:border-gray-300 p-2.5 rounded-lg text-left">
          <div className="text-[11px] font-semibold text-[#64748B] print:text-gray-700 uppercase tracking-wider">
            Protein
          </div>
          <div className="text-xl font-bold text-[#0F172A] print:text-black mt-0.5">
            {nutrition.protein} <span className="text-xs font-normal text-[#64748B]">g</span>
          </div>
          <div className="text-[11px] text-[#64748B] font-medium print:text-gray-600 mt-0.5">
            {nutrition.dailyValues.protein}% DV
          </div>
        </div>

        <div className="bg-[#F8FAFC] print:bg-transparent border border-[#E2E8F0] print:border-gray-300 p-2.5 rounded-lg text-left">
          <div className="text-[11px] font-semibold text-[#64748B] print:text-gray-700 uppercase tracking-wider">
            Carbohydrates
          </div>
          <div className="text-xl font-bold text-[#0F172A] print:text-black mt-0.5">
            {nutrition.carbohydrates} <span className="text-xs font-normal text-[#64748B]">g</span>
          </div>
          <div className="text-[11px] text-[#64748B] font-medium print:text-gray-600 mt-0.5">
            {nutrition.dailyValues.carbohydrates}% DV
          </div>
        </div>

        <div className="bg-[#F8FAFC] print:bg-transparent border border-[#E2E8F0] print:border-gray-300 p-2.5 rounded-lg text-left">
          <div className="text-[11px] font-semibold text-[#64748B] print:text-gray-700 uppercase tracking-wider">
            Total Fat
          </div>
          <div className="text-xl font-bold text-[#0F172A] print:text-black mt-0.5">
            {nutrition.fat} <span className="text-xs font-normal text-[#64748B]">g</span>
          </div>
          <div className="text-[11px] text-[#64748B] font-medium print:text-gray-600 mt-0.5">
            {nutrition.dailyValues.fat}% DV
          </div>
        </div>
      </div>

      {/* Detailed Macro & Micronutrient Text-Based Grid */}
      <div className="border border-[#E2E8F0] print:border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Table / Grid Header */}
        <div className="grid grid-cols-12 bg-[#F1F5F9] print:bg-gray-100 px-3.5 py-2 text-xs font-bold text-[#0F172A] print:text-black border-b border-[#E2E8F0] print:border-gray-300">
          <div className="col-span-7 sm:col-span-8">Nutrient Profile</div>
          <div className="col-span-3 sm:col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">% Daily Value*</div>
        </div>

        {/* Grid Rows */}
        <div className="divide-y divide-[#F1F5F9] text-xs text-[#334155] print:text-black">
          {/* Calories */}
          <div className="grid grid-cols-12 px-3.5 py-2 font-semibold bg-white">
            <div className="col-span-7 sm:col-span-8 text-[#0F172A]">Calories</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.calories} kcal</div>
            <div className="col-span-2 text-right text-[#0056B3] print:text-black font-bold">
              {nutrition.dailyValues.calories}%
            </div>
          </div>

          {/* Total Fat */}
          <div className="grid grid-cols-12 px-3.5 py-2 font-semibold bg-white">
            <div className="col-span-7 sm:col-span-8 text-[#0F172A]">Total Fat</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.fat}g</div>
            <div className="col-span-2 text-right">{nutrition.dailyValues.fat}%</div>
          </div>

          {/* Saturated Fat */}
          <div className="grid grid-cols-12 px-3.5 py-1.5 pl-6 sm:pl-8 text-[#64748B] print:text-gray-700 bg-[#FAFCFF] print:bg-white">
            <div className="col-span-7 sm:col-span-8 italic">Saturated Fat</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.saturatedFat}g</div>
            <div className="col-span-2 text-right">{nutrition.dailyValues.saturatedFat}%</div>
          </div>

          {/* Cholesterol */}
          <div className="grid grid-cols-12 px-3.5 py-2 bg-white">
            <div className="col-span-7 sm:col-span-8 font-semibold text-[#0F172A]">Cholesterol</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.cholesterol}mg</div>
            <div className="col-span-2 text-right">{nutrition.dailyValues.cholesterol}%</div>
          </div>

          {/* Sodium */}
          <div className="grid grid-cols-12 px-3.5 py-2 bg-white">
            <div className="col-span-7 sm:col-span-8 font-semibold text-[#0F172A]">Sodium</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.sodium}mg</div>
            <div className="col-span-2 text-right">{nutrition.dailyValues.sodium}%</div>
          </div>

          {/* Carbohydrates */}
          <div className="grid grid-cols-12 px-3.5 py-2 font-semibold bg-white">
            <div className="col-span-7 sm:col-span-8 text-[#0F172A]">Total Carbohydrates</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.carbohydrates}g</div>
            <div className="col-span-2 text-right">{nutrition.dailyValues.carbohydrates}%</div>
          </div>

          {/* Dietary Fiber */}
          <div className="grid grid-cols-12 px-3.5 py-1.5 pl-6 sm:pl-8 text-[#64748B] print:text-gray-700 bg-[#FAFCFF] print:bg-white">
            <div className="col-span-7 sm:col-span-8 italic">Dietary Fiber</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.fiber}g</div>
            <div className="col-span-2 text-right">{nutrition.dailyValues.fiber}%</div>
          </div>

          {/* Sugars */}
          <div className="grid grid-cols-12 px-3.5 py-1.5 pl-6 sm:pl-8 text-[#64748B] print:text-gray-700 bg-[#FAFCFF] print:bg-white">
            <div className="col-span-7 sm:col-span-8 italic">Total Sugars</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.sugar}g</div>
            <div className="col-span-2 text-right text-[#94A3B8] print:text-gray-500">—</div>
          </div>

          {/* Protein */}
          <div className="grid grid-cols-12 px-3.5 py-2 font-semibold bg-white">
            <div className="col-span-7 sm:col-span-8 text-[#0F172A]">Protein</div>
            <div className="col-span-3 sm:col-span-2 text-right">{nutrition.protein}g</div>
            <div className="col-span-2 text-right text-[#0056B3] print:text-black font-bold">
              {nutrition.dailyValues.protein}%
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="bg-[#F8FAFC] print:bg-gray-50 px-3.5 py-2 text-[11px] text-[#64748B] print:text-gray-600 border-t border-[#E2E8F0] print:border-gray-300">
          * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
        </div>
      </div>
    </div>
  );
}
