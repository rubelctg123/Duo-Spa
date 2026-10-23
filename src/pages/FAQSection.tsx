import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/faqData';

export const FAQSection: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleIndex = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-900 border border-sage-300/80 px-4 py-1.5 rounded-full text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-sage-700" />
          <span>Questions fréquentes</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-sage-950 font-normal">
          Tout ce que vous devez savoir
        </h1>
        <p className="text-taupe-600 text-sm max-w-lg mx-auto">
          Détails pratiques concernant la réservation, le déroulement des soins en duo et nos conditions d’annulation.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-sand-200 shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none hover:bg-sand-50/60 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-base sm:text-lg font-medium text-sage-950">
                  {item.question}
                </span>
                <span
                  className={`w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center shrink-0 text-taupe-700 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-sage-100 text-sage-800' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-taupe-700 text-xs sm:text-sm leading-relaxed border-t border-sand-100/60 animate-fadeIn">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-sand-100/80 rounded-2xl border border-sand-200 text-center text-xs text-taupe-600 space-y-1">
        <p className="font-semibold text-taupe-800">
          Vous avez une question spécifique sur votre condition de santé ou une réservation de groupe ?
        </p>
        <p>
          Communiquez avec nous par courriel à <span className="text-sage-800 font-medium">bonjour@duospa-joliette.ca</span> ou par téléphone au <span className="text-sage-800 font-medium">(450) 759-0000</span>.
        </p>
      </div>
    </div>
  );
};
