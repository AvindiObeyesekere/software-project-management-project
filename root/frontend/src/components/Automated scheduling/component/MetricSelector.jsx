import React from "react";

const MetricSelector = ({
  tools,
  selectedTools,
  toolMetrics,
  handleMetricChange,
  disable,
}) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">Select Metrics for Each Tool</h3>
    {tools
      .filter((tool) => selectedTools.includes(tool.name))
      .map((tool) => (
        <div key={tool.name} className="mb-4 p-3 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h4 className="text-lg font-semibold mb-2">{tool.name}</h4>
          {tool.metrics.map((metric) => (
            <div key={metric} className="mb-2 flex items-center">
              <input
                type="checkbox"
                id={`${tool.name}-${metric}`}
                checked={
                  toolMetrics[tool.name] && toolMetrics[tool.name][metric]
                }
                onChange={() =>
                  !disable && handleMetricChange(tool.name, metric)
                }
                className={`mr-2 ${disable ? 'cursor-not-allowed' : ''}`}
                disabled={disable}
              />
              <label
                htmlFor={`${tool.name}-${metric}`}
                className={`text-gray-700 ${disable ? 'opacity-50' : ''}`}
              >
                {metric}
              </label>
            </div>
          ))}
        </div>
      ))}
  </div>
);

export default MetricSelector;
