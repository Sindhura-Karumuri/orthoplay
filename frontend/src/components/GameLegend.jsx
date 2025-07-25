import { Info, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const GameLegend = () => {
    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Color Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Correct</p>
                        <p className="text-sm text-gray-600">Right letter, right position</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Misplaced</p>
                        <p className="text-sm text-gray-600">Right letter, wrong position</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-400 rounded-lg flex items-center justify-center">
                        <XCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Incorrect</p>
                        <p className="text-sm text-gray-600">Letter not in word</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameLegend;
