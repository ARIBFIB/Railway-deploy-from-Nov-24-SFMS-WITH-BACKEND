import React, { useState } from 'react';
import { CheckCircle, Info, ExternalLink, Download, Upload } from 'lucide-react';

const WarehousesPage: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Start', active: currentStep === 1 },
    { number: 2, title: 'Controls', active: currentStep === 2 },
    { number: 3, title: 'Settings', active: currentStep === 3 },
    { number: 4, title: 'Complete', active: currentStep === 4 }
  ];

  const handleNext = () => {
    if (isChecked && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">ACTIVATION OF WAREHOUSE</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.active 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.active ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    step.active ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Glad you want to get started!</h2>
            
            {/* Check your items section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Check your items</h3>
              <p className="text-gray-700 mb-6">
                There are two ways to check items before Warehouse is activated. Choose the best method for you.
                We also recommend reading the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  important information about activating the warehouse system
                </a>{' '}
                before proceeding.
              </p>

              {/* Method 1: Via article register */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Via article register</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      1
                    </span>
                    <p className="text-gray-700">
                      Go to your{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                        article register
                      </a>
                      .
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      2
                    </span>
                    <p className="text-gray-700">
                      Ensure that <strong>Quantity</strong>, <strong>Estimated Cost</strong> and <strong>Stock Item</strong> are correctly specified on all items.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      3
                    </span>
                    <p className="text-gray-700">
                      Correct any incorrect values.
                    </p>
                  </div>
                </div>
              </div>

              {/* Method 2: Via file export */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Via file export</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      1
                    </span>
                    <p className="text-gray-700">
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                        Export
                      </a>{' '}
                      your article register to a CSV file.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      2
                    </span>
                    <p className="text-gray-700">
                      Ensure that <strong>Quantity</strong>, <strong>Estimated Cost</strong> and <strong>Stock Item</strong> are correctly specified on all items.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      3
                    </span>
                    <p className="text-gray-700">
                      Correct any incorrect values directly in the file, and then{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                        import
                      </a>{' '}
                      it again into the system.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">The following happens during activation:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                      All items with a positive inventory balance are changed to in-stock items.
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                      The inventory balance for all inventory items with a negative inventory balance is set to 0.
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                      It may be a good idea to create invoices from customer orders that have already been delivered, as the delivered quantity will otherwise not be transferred to the warehouse system.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action section */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  I have checked my articles.
                </span>
              </label>
              
              <button
                onClick={handleNext}
                disabled={!isChecked}
                className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  isChecked
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehousesPage;


