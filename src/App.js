// App.js
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const metrics = [
  {
    category: "Core Metrics",
    weight: 2,
    items: [
      { 
        id: 1, 
        text: "Net Revenue Retention (NRR) > 120%",
        tooltip: "NRR measures how much existing customers grow their spending over time, including expansions and contractions"
      },
      { 
        id: 2, 
        text: "Gross Margins > 70%",
        tooltip: "The percentage of revenue remaining after accounting for direct costs of delivering the service"
      },
      { 
        id: 3, 
        text: "ARR Growth Rate > 100%",
        tooltip: "Year-over-year growth rate of Annual Recurring Revenue"
      },
      { 
        id: 4, 
        text: "Churn Rate < 3% annually",
        tooltip: "Percentage of customers who stop using your service within a year"
      }
    ]
  },
  {
    category: "Market & Competition",
    weight: 1.5,
    items: [
      { 
        id: 5, 
        text: "Market Size (TAM) > $1B",
        tooltip: "Total Addressable Market - the total market demand for your product/service"
      },
      { 
        id: 6, 
        text: "Limited Direct Competition",
        tooltip: "Few companies offering similar solutions in your target market"
      },
      { 
        id: 7, 
        text: "Category Leader/First Mover",
        tooltip: "Either created the category or is recognized as a leading provider"
      }
    ]
  },
  {
    category: "Customer & Sales",
    weight: 1.5,
    items: [
      { 
        id: 8, 
        text: "Enterprise Customers > 20%",
        tooltip: "Percentage of customer base that consists of enterprise-level clients"
      },
      { 
        id: 9, 
        text: "ACV > $10,000",
        tooltip: "Annual Contract Value - average revenue per customer per year"
      },
      { 
        id: 10, 
        text: "CAC Payback < 12 months",
        tooltip: "Time needed to recover the cost of acquiring a customer"
      }
    ]
  },
  {
    category: "Team & Technology",
    weight: 1,
    items: [
      { 
        id: 11, 
        text: "Experienced Founders/Team",
        tooltip: "Team has prior successful exits or significant industry experience"
      },
      { 
        id: 12, 
        text: "Proprietary Technology/Patents",
        tooltip: "Unique technical advantages protected by patents or trade secrets"
      },
      { 
        id: 13, 
        text: "Security/Compliance Certifications",
        tooltip: "Has necessary certifications like SOC2, GDPR, ISO27001, etc."
      }
    ]
  },
  {
    category: "Business Fundamentals",
    weight: 1,
    items: [
      { 
        id: 14, 
        text: "International Market Presence",
        tooltip: "Active operations in multiple countries or regions"
      },
      { 
        id: 15, 
        text: "Rule of 40 Achievement",
        tooltip: "Combined growth rate and profit margin exceeds 40%"
      }
    ]
  }
];

const getValuationLevel = (percentage) => {
  if (percentage >= 80) return { level: 1, range: "15-25x ARR", color: "bg-green-500" };
  if (percentage >= 60) return { level: 2, range: "10-15x ARR", color: "bg-green-300" };
  if (percentage >= 40) return { level: 3, range: "6-10x ARR", color: "bg-yellow-400" };
  if (percentage >= 20) return { level: 4, range: "3-6x ARR", color: "bg-orange-400" };
  return { level: 5, range: "1-3x ARR", color: "bg-red-500" };
};

function App() {
  const [answers, setAnswers] = useState({});

  const handleToggle = (id) => {
    setAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const { score, maxScore, percentage } = useMemo(() => {
    let totalScore = 0;
    let maxPossibleScore = 0;

    metrics.forEach(category => {
      category.items.forEach(item => {
        maxPossibleScore += category.weight;
        if (answers[item.id]) {
          totalScore += category.weight;
        }
      });
    });

    return {
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage: (totalScore / maxPossibleScore) * 100
    };
  }, [answers]);

  const valuation = getValuationLevel(percentage);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SaaS Company Valuation Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.map((category, idx) => (
            <div key={category.category} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {category.category} (Weight: {category.weight}x)
              </h3>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left flex-1">
                          <label className="cursor-help">{item.text}</label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{item.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Switch
                      checked={answers[item.id] || false}
                      onCheckedChange={() => handleToggle(item.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Score:</span>
              <span className="font-semibold">{score.toFixed(1)} / {maxScore.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Percentage:</span>
              <span className="font-semibold">{percentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Valuation Level:</span>
              <span className={`px-3 py-1 rounded-full text-white ${valuation.color}`}>
                Level {valuation.level} ({valuation.range})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
