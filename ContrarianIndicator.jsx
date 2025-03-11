import React from "react";

function ContrarianIndicator() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-center">Bitcoin Google Search Trends</h2>

            {/* 🔹 Show a Button to Open Google Trends in a New Tab */}
            <a
                href="https://trends.google.com/trends/explore?date=today%203-m&q=bitcoin&hl=ko"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
                📈 View Google Trends Chart
            </a>
        </div>
    );
}

export default ContrarianIndicator;